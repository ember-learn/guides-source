[Root state](../root-state/) and [derived state](../derived-state/) form a graph of values with no side effects.
This guide covers how data enters the graph, how results leave it, and which Ember tool does each job.

- Inputs write to root state. Event handlers, response callbacks, subscription messages, and timers are inputs.
- Outputs read the graph and act on the world. The renderer is the main output.

Everything between an input and an output is a derivation, and derivations have no side effects.

## Rendering Is the Effect

Some reactive systems provide an _effect_ primitive.
An effect is a function that runs again whenever a reactive value it read changes.
(though some effects in other frameworks have different timings, some even run synchronously after an "output" calculation, which may cause further "output" calculations).
Ember does not provide an effect primitive because the renderer does this job.

A template is a set of effects.
Each `{{expression}}` and each attribute binding tells the renderer to update one part of the DOM when the values it reads change.
The renderer batches these updates, schedules them before the browser paints, and updates only the DOM whose inputs changed.

## Why There Is No Effect Primitive

A general effect primitive has four problems:

- An effect runs on every change to its inputs, whether or not anything needs the result. The rest of the system is lazy (an ideal performance-related trait), and effects undo that.
- When one change triggers several effects, the order they run in is not specified. Code that depends on that order has a bug.
- Effects that write state fall out of sync. An effect that copies X into Y leaves Y stale until the effect runs, and Y can disagree with X. If the write triggers another effect, the effects cascade or loop. Derive Y from X with a getter instead, as described in [Derived State](../derived-state/). The backtracking assertion reports a write during a derivation as an error.
- Derived values belong in getters. DOM manipulation belongs in a modifier. Processes such as subscriptions belong to an owner, with cleanup. Ember provides a tool for each, described below.

## Managed Effects: Attached to a Lifetime

When your code must act on the world, use a tool that ties the work to a lifetime.
The work starts when the lifetime starts, cleans up when it ends, and runs again through autotracking like everything else.

A modifier is an effect scoped to a DOM element - these should be used sparingly, and avoid _setting_ tracked state.
It runs when the element renders.
It cleans up and runs again when tracked state it consumed changes.
It cleans up when the element is removed:

```js {data-filename=app/modifiers/draw-chart.js}
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

The modifier runs again when `@chartData` changes.
It cannot run before the element exists, and it cannot leak after the element is gone.
The template shows where its effect lands.
[Template Lifecycle, DOM, and Modifiers](../../../components/template-lifecycle-dom-and-modifiers/) covers modifiers in detail.

A destroyable covers work with no element.
Any object with an owner, such as a component, a service, or a helper, can register cleanup with `registerDestructor` from [`@ember/destroyable`](https://api.emberjs.com/ember/release/modules/@ember%2Fdestroyable):

```js {data-filename=app/services/clock.js}
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

Any getter in the application can now derive from `clock.now`.
Seconds remaining, whether a store is open, and a formatted timestamp all update each second.
The interval and its cleanup live in one place.

Setup, cleanup, and reactive state together are called a _resource_.
The [ember-resources](https://github.com/NullVoxPopuli/ember-resources) library provides resources as values for components and templates.
A service with a destructor, as above, is the same pattern with no dependencies.

## Inputs: Writing into the Graph from Outside

Code that runs outside the graph writes to root state.
Event handlers, socket callbacks, timers, and promise callbacks all work this way:

```js
this.socket.addEventListener('message', (event) => {
  // lastMessage is a tracked property
  this.lastMessage = JSON.parse(event.data); 
});
```

A write from outside the graph is always allowed.
The backtracking assertion restricts writes only during a reactive computation, that is, inside a getter or a template.
An event callback is not a computation, so it can write as many properties as it needs to.
The writes are batched into one rerender.

The clock service above shows the full input pattern.
An external process, the interval, writes to one tracked property, and cleanup is bound to a lifetime.
Subscriptions, `ResizeObserver`s, and `BroadcastChannel`s follow the same steps.

## Async: Tracking Stops at `await`


<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
            Some argue that auto-tracking _should_ work within async, and any behavior that relies on using `await` to detach from a tracking frame is actually a bug. There are experients around this using <a href="https://github.com/tc39/proposal-async-context">AsyncContext</a>, but so far, they are just experiments. 
        </p>
        <p>
          So while, today, auto-tracking stops at an <code>await</code>, it may not in the future. If you find yourself reaching for <code>await</code> to fix "problems", consider if a different approach can work.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Tracking today is synchronous.
The system records reads that happen while a template expression or a cached getter computes.
A computation ends at the first `await`.
Code after an `await`, inside `setTimeout`, or in a `.then()` callback runs later, outside the computation that started it.
Reads in that code are not consumed:

```js
// The renderer cannot see through this
get userName() {
  return fetch(`/users/${this.userId}`).then((r) => r.json()); // a Promise, not a name
}
```

A derivation must return its value synchronously.
To handle async work, treat the request as an input.
The request is a side effect, and its progress is root state.
Start the request at a lifetime boundary, and write each phase into tracked properties:

```gjs {data-filename=app/components/profile.gjs}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

class RequestState {
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
  user = new RequestState(
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

The async state is now data.
The loading message is a derivation like any other, an `{{#if}}` on a tracked property.
The class above holds status, value, and error as reactive fields.
Libraries such as [reactiveweb](https://github.com/universal-ember/reactiveweb) and the request state in [WarpDrive](https://docs.warp-drive.io/) provide this as a utility (`getRequestState` / `getPromiseState`) that covers more use cases, and better suited to general use.

The above example has a problem, however -- the request is created in a field initializer, so it reads `userId` once and does not fetch again when the argument changes.
[Deferring Consumption](../derived-state/#toc_deferring-consumption) describes this snapshot problem.
To run an effect again when its inputs change, use one of the managed tools above: a modifier when an element is involved, or a resource otherwise.
When an effect must respond to the graph, give it a lifetime that the framework manages.
When the world must update the graph, write root state.

