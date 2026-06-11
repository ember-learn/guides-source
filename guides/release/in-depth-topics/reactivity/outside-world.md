The reactive graph—[root state](../root-state/) at the bottom, [derived state](../derived-state/) above it—is a closed, pure world: values in, values out, no surprises. But applications exist to affect the world outside that graph: paint pixels, play audio, talk to servers, listen to sockets. This chapter is about the edges of the graph—how data gets in, how it gets out, and why Ember draws those edges where it does.

The shape to keep in mind:

- **Inputs** write to root state: event handlers, response callbacks, subscription messages, timers.
- **Outputs** read the graph and act on the world: the renderer first among them.

Everything in between stays pure.

## Rendering Is the Effect

In some reactive systems, you wire outputs yourself with an _effect_ primitive—Solid's `createEffect`, for example, re-runs a function whenever the reactive values it read change. If you ask "where is Ember's `createEffect`?", the first answer is: **you've been using it all along—it's the renderer.**

A template is a declaration of effects: every `{{expression}}`, every attribute binding is a tiny "when this value changes, update that DOM" rule. The renderer plays the same role Signalium assigns to its _watchers_: it is the exit point of the graph, the thing that actively pulls on your derivations and pushes the results into the world. You write the pure part; the framework owns the part that touches the world—batching, scheduling before paint, and updating only the DOM whose inputs actually changed.

## Why There Is No `createEffect`

The second answer is that the omission is deliberate, and the reasons are instructive—you can find most of them stated as _warnings_ in the documentation of frameworks that have effects:

- **Effects are eager.** An effect must re-run on every change to its inputs, whether or not anyone needs the result, breaking the lazy, pull-based economics that make the rest of the system cheap. (Signalium, which is lazy like Ember, allows watchers but tells you never to create them inside reactive code.)
- **Effect ordering is undefined.** When one change triggers several effects, the execution order is unspecified—Solid's documentation says plainly that it "should not be relied upon." Correctness that depends on effect order is a latent bug.
- **Effects that write state are a trap.** The most common effect mistake is using one to _sync_ state: "when X changes, update Y." Now Y is stale until the effect runs, can disagree with X, and if the effect's write triggers another effect, you have a cascade or an infinite loop. Solid's own guides answer this with "use `createMemo` instead"—that is: _derive, don't sync_. In Ember, [the getter was the answer all along](../derived-state/), and the backtracking assertion makes write-during-derivation a loud error rather than a quiet bug.
- **Almost every "effect" is something more specific.** Look closely at real `createEffect` calls and you find: derived values (should be getters), DOM manipulation (should be scoped to an element), and lifecycle-bound processes like subscriptions (should be tied to an owner's lifetime, with cleanup). Ember provides each of those as a dedicated, managed construct instead of one general escape hatch.

## Managed Outputs: Effects with a Lifetime

When you do need to act on the world, Ember's tools all share one design: the effect is attached to something with a _lifetime_, runs with cleanup, and re-runs through the same autotracking as everything else.

**Modifiers** are effects scoped to a DOM element. They run when the element is rendered, re-run (after cleanup) when tracked state they consumed changes, and clean up when the element goes away:

```js {data-filename="app/modifiers/draw-chart.js"}
import { modifier } from 'ember-modifier';
import Chart from 'chart.js/auto';

export default modifier((element, [data]) => {
  let chart = new Chart(element, { type: 'bar', data });

  return () => chart.destroy();
});
```

```gjs
import drawChart from 'my-app/modifiers/draw-chart';

<template>
  <canvas {{drawChart @chartData}}></canvas>
</template>
```

This is "re-run when `@chartData` changes"—an effect—but bounded: it cannot run before there's an element, cannot leak after the element is gone, and declares in the template exactly where its impact lands. See [Template Lifecycle, DOM, and Modifiers](../../../components/template-lifecycle-dom-and-modifiers/).

**Destroyables** cover lifecycle-bound work with no element. Anything with an owner—components, services, helpers—can pair setup with guaranteed teardown via `registerDestructor` from [`@ember/destroyable`](https://api.emberjs.com/ember/release/modules/@ember%2Fdestroyable):

```js {data-filename="app/services/clock.js"}
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';

export default class ClockService extends Service {
  @tracked now = new Date();

  constructor(...args) {
    super(...args);

    let timer = setInterval(() => {
      this.now = new Date();
    }, 1000);

    registerDestructor(this, () => clearInterval(timer));
  }
}
```

Any getter, anywhere in the app, can now derive from `clock.now`—"seconds remaining," "is the store open," a formatted timestamp—and every one of them updates each second, while the actual side effect (one interval, one cleanup) stays in one place.

This setup-plus-cleanup-plus-reactive-state package is what Starbeam calls a _resource_, and its docs model the same example almost identically (a `Clock` resource whose `setInterval` is started in setup and cleared in cleanup). In the Ember ecosystem the [ember-resources](https://github.com/NullVoxPopuli/ember-resources) library offers resources as values you can use right in components and templates; a built-in equivalent is an active area of design. A service with a destructor, as above, is the no-dependencies version of the pattern.

## Inputs: Writing into the Graph from Outside

The inverse direction needs no special machinery at all. Code running outside the graph—event handlers, socket callbacks, timers, promise resolutions—simply writes to root state, and the graph takes it from there:

```js
this.socket.addEventListener('message', (event) => {
  this.lastMessage = JSON.parse(event.data); // a tracked property
});
```

Writes from the outside are always safe. The backtracking assertion only restricts writes _during_ a reactive computation (inside getters and templates); an event callback runs outside any computation, so it can write as much as it likes, and all the writes coalesce into a single re-render.

The clock service above is the full input pattern in miniature: an external process (the interval) feeds the graph through one tracked write, and cleanup is bound to a lifetime. Subscriptions, `ResizeObserver`s, `BroadcastChannel`s—they all take this shape: **subscribe with cleanup; on each notification, write root state; derive everything else.**

## Async: Tracking Stops at `await`

Tracking contexts are synchronous. The system records reads that happen _while_ a template expression or cached getter is computing—and a computation, in JavaScript, ends at the first `await`. Code after an `await` (or inside `setTimeout`, or a `.then()` callback) runs later, outside the computation that started it, so nothing it reads is consumed:

```js
// 🛑 The renderer cannot see through this
get userName() {
  return fetch(`/users/${this.userId}`).then((r) => r.json()); // a Promise, not a name
}
```

Derivations must be synchronous. The reactive way to handle async work follows from the input rule above: the _request_ is a side effect; its _progress_ is root state. Run the effect at a lifetime boundary, and write each phase of it into tracked properties:

```js {data-filename="app/components/profile.gjs"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

class Request {
  @tracked status = 'pending';
  @tracked value = null;
  @tracked error = null;

  get isPending() {
    return this.status === 'pending';
  }

  constructor(promise) {
    promise.then(
      (value) => {
        this.value = value;
        this.status = 'resolved';
      },
      (error) => {
        this.error = error;
        this.status = 'rejected';
      }
    );
  }
}

export default class Profile extends Component {
  user = new Request(
    fetch(`/users/${this.args.userId}`).then((response) => response.json())
  );

  <template>
    {{#if this.user.isPending}}
      Loading…
    {{else if this.user.error}}
      Something went wrong.
    {{else}}
      Hello, {{this.user.value.name}}!
    {{/if}}
  </template>
}
```

Once async state is _data_, it stops being a special case: "show a spinner while pending" is just another derivation, the same `{{#if}}` as anything else. This "reactive promise" shape—status, value, and error as reactive fields—is where the whole ecosystem has converged: Signalium builds it in as `ReactivePromise` (with `isPending`, `isResolved`, `value`, and friends), Solid's resources and Starbeam's resources wrap it in lifetime management, and in Ember it's available today via libraries like [ember-resources](https://github.com/NullVoxPopuli/ember-resources) and [WarpDrive](https://docs.warp-drive.io/)'s request state, or in a dozen lines of your own, as above.

Note one limitation of the example as written: the request is created in a field initializer, so it captures `userId` once and won't re-fetch if the argument changes. Re-running an effect when its reactive inputs change is exactly the job of the managed constructs from earlier—a modifier (if there's a sensible element) or a resource. That's the general rule of this chapter closing the loop: **when an effect needs to respond to the graph, give it a lifetime the framework manages; when the world needs to update the graph, write root state.**

## Choosing the Right Edge

| You want to…                                              | Reach for                                            |
| --------------------------------------------------------- | ---------------------------------------------------- |
| Update the page when state changes                         | A template expression—that's the renderer's job      |
| Compute a value from other values                          | A [getter or function](../derived-state/)            |
| Manipulate a DOM element when state changes                | A [modifier](../../../components/template-lifecycle-dom-and-modifiers/) |
| Start a process and clean it up with its owner             | `registerDestructor` (or a resource)                 |
| Feed external events into the app                          | Write tracked state from the callback                |
| Track an async operation                                   | Store its status/value/error as root state           |
| Run arbitrary code "whenever X changes"                    | Reconsider—it's almost always one of the above       |
