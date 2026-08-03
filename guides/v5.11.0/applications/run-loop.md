**Note:**
* _For basic Ember app development scenarios, you don't need to understand the run loop or use it directly. All common paths are paved nicely for you and don't require working with the run loop._
* _However, the run loop will be helpful to understand the internals of Ember and to assist in customized performance tuning by manually batching costly work._

Ember's internals and most of the code you will write in your applications takes place in a run loop.
The run loop is used to batch, and order (or reorder) work in a way that is most effective and efficient.

It does so by scheduling work on specific queues.
These queues have a priority, and are processed to completion in priority order.

The most common case for using the run loop is integrating with a non-Ember API
that includes some sort of asynchronous callback.
For example:

- DOM update and event callbacks
- `setTimeout` and `setInterval` callbacks
- `postMessage` and `messageChannel` event handlers
- fetch or ajax callbacks
- WebSocket callbacks

## Why is the run loop useful?

Very often, batching similar work has benefits.
Web browsers do something quite similar by batching changes to the DOM.

Consider the following HTML snippet:

```html
<div id="foo"></div>
<div id="bar"></div>
<div id="baz"></div>
```

and executing the following code:

```javascript
foo.style.height = '500px' // write
foo.offsetHeight // read (recalculate style, layout, expensive!)

bar.style.height = '400px' // write
bar.offsetHeight // read (recalculate style, layout, expensive!)

baz.style.height = '200px' // write
baz.offsetHeight // read (recalculate style, layout, expensive!)
```

In this example, the sequence of code forced the browser to recalculate style, and relayout after each step.
However, if we were able to batch similar jobs together,
the browser would have only needed to recalculate the style and layout once.

```javascript
foo.style.height = '500px' // write
bar.style.height = '400px' // write
baz.style.height = '200px' // write

foo.offsetHeight // read (recalculate style, layout, expensive!)
bar.offsetHeight // read (fast since style and layout are already known)
baz.offsetHeight // read (fast since style and layout are already known)
```

Interestingly, this pattern holds true for many other types of work.
Essentially, batching similar work allows for better pipelining, and further optimization.

Let's look at a similar example that is optimized in Ember, starting with an `Image` class:

```javascript
import { tracked } from '@glimmer/tracking';

class Image {
  @tracked width;
  @tracked height;

  constructor({ width, height }) {
    this.width = width ?? null;
    this.height = height ?? null;
  }

  get aspectRatio() {
    return this.width / this.height;
  }
}
```

and a template to display its attributes:

```handlebars
{{this.width}}
{{this.aspectRatio}}
```

If we execute the following code without the run loop:

```javascript
let profilePhoto = new Image({ width: 250, height: 500 });
profilePhoto.width = 300;
// profilePhoto.width and profilePhoto.aspectRatio are updated

profilePhoto.height = 300;
// profilePhoto.height and profilePhoto.aspectRatio are updated
```

We see that the browser will rerender the template twice.

However, if we have the run loop in the above code,
the browser will only rerender the template once the attributes have all been set.

```javascript
let profilePhoto = new Image({ width: 250, height: 500 });
profilePhoto.width = 600;
profilePhoto.height = 600;
profilePhoto.width = 300;
profilePhoto.height = 300;
```

In the above example with the run loop, since the user's attributes end up at the same values as before execution,
the template will not even rerender!

It is of course possible to optimize these scenarios on a case-by-case basis,
but getting them for free is much nicer.
Using the run loop, we can apply these classes of optimizations not only for each scenario, but holistically app-wide.

## How does the Run Loop work in Ember?

As mentioned earlier, we schedule work (in the form of function invocations) on queues,
and these queues are processed to completion in priority order.

What are the queues, and what is their priority order?

1. `actions`
2. `routerTransitions`
3. `render`
4. `afterRender`
5. `destroy`

Here, in this list, the "actions" queue has a higher priority than the "render" or "destroy" queue.

## What happens in these queues?

* The `actions` queue is the general work queue and will typically contain scheduled tasks e.g. promises.
* The `routerTransitions` queue contains transition jobs in the router.
* The `render` queue contains jobs meant for rendering, these will typically update the DOM.
* The `afterRender` queue contains jobs meant to be run after all previously scheduled render tasks are complete.
This is often good for 3rd-party DOM manipulation libraries,
that should only be run after an entire tree of DOM has been updated.
* The `destroy` queue contains jobs to finish the teardown of objects other jobs have scheduled to destroy.

## In what order are jobs executed on the queues?
The algorithm works this way:

1. Let the highest priority queue with pending jobs be: `CURRENT_QUEUE`,
if there are no queues with pending jobs the run loop is complete
2. Let a new temporary queue be defined as `WORK_QUEUE`
3. Move jobs from `CURRENT_QUEUE` into `WORK_QUEUE`
4. Process all the jobs sequentially in `WORK_QUEUE`
5. Return to Step 1

## An example of the internals

Rather than writing the higher level app code that internally invokes the various run loop scheduling functions,
we have stripped away the covers, and shown the raw run-loop interactions.

Working with this API directly is not common in most Ember apps,
but understanding this example will help you to understand the run-loops algorithm,
which will make you a better Ember developer.

<iframe src="https://s3.amazonaws.com/emberjs.com/run-loop-guide/index.html" width="678" height="410" style="border:1px solid rgb(170, 170, 170);margin-bottom:1.5em;"></iframe>

## How do I tell Ember to start a run loop?

You should begin a run loop when the callback fires.

The `Ember.run` method can be used to create a run loop.
In this example, `Ember.run` is used to handle an online
event (browser gains internet access) and run some Ember code.

```javascript
window.addEventListener('online', () => {
  Ember.run(() => {  // begin loop
    // Code that results in jobs being scheduled goes here
  }); // end loop, jobs are flushed and executed
});
```



## What happens if I forget to start a run loop in an async handler?

As mentioned above, you should wrap any non-Ember async callbacks in `Ember.run`.
If you don't, Ember will try to approximate a beginning and end for you.
Consider the following callback:

```javascript
window.addEventListener('online', () => {
  console.log('Doing things...');

  Ember.run.schedule('actions', () => {
    // Do more things
  });
});
```

The run loop API calls that _schedule_ work, i.e. [`run.schedule`](https://api.emberjs.com/ember/5.11.0/classes/@ember%2Frunloop/methods/schedule?anchor=schedule),
[`run.scheduleOnce`](https://api.emberjs.com/ember/5.11.0/classes/@ember%2Frunloop/methods/scheduleOnce?anchor=scheduleOnce),
[`run.once`](https://api.emberjs.com/ember/5.11.0/classes/@ember%2Frunloop/methods/once?anchor=once) have the property that they will approximate a run loop for you if one does not already exist.
These automatically created run loops we call _autoruns_.

Here is some pseudocode to describe what happens using the example above:

```javascript
window.addEventListener('online', () => {
  // 1. autoruns do not change the execution of arbitrary code in a callback.
  //    This code is still run when this callback is executed and will not be
  //    scheduled on an autorun.
  console.log('Doing things...');

  Ember.run.schedule('actions', () => {
    // 2. schedule notices that there is no currently available run loop so it
    //    creates one. It schedules it to close and flush queues on the next
    //    turn of the JS event loop.
    if (! Ember.run.hasOpenRunLoop()) {
      Ember.run.begin();
      nextTick(() => {
        Ember.run.end()
      }, 0);
    }

    // 3. There is now a run loop available so schedule adds its item to the
    //    given queue
    Ember.run.schedule('actions', () => {
      // Do more things
    });

  });

  // 4. This schedule sees the autorun created by schedule above as an available
  //    run loop and adds its item to the given queue.
  Ember.run.schedule('afterRender', () => {
    // Do yet more things
  });
});
```

## Where can I find more information?

Check out the [Ember.run](https://api.emberjs.com/ember/5.11.0/classes/@ember%2Frunloop) API documentation,
as well as the [Backburner library](https://github.com/ebryn/backburner.js/) that powers the run loop.
