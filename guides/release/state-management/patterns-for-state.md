If you've read through the guides up until this point, you now know about:

- **Templating**, how to render something in the browser using Handlebars, and
  how to embed logic into templates using _helpers_ and _modifiers_.
- **Components**, which allow you to extend HTML, separate concerns, and
  pull-out repetitive parts of templates.
- **Routes and Controllers**, and how you set up different pages in your
  application, and navigate between them.
- **Services**, which are classes that can be provided (via _injection_) to any
  of your components or other classes, and can be used to share and store data
  in your app.
- **Tracked Properties**, and how to mark properties as trackable so Ember knows
  to rerender them when they are updated.
- **Actions**, and how they can be used to hook up the UI to Components and
  Controllers and make your app interactive.

However, it might not be clear how all these pieces fit together in a full
application. Where should you _put_ everything? And how should things be
organized in your application?

This all comes down to _state_, and how best to organize it. Every application
has different requirements, and there are many different patterns for state
management that suit different needs. In this guide, we'll talk about state in
Ember applications in general, and touch on some different patterns for how you
can setup your state.

## Where State Lives

In Ember, there are 3 primary types of state:

- **Component state**. When a component is rendered, a new _instance_ of the
  component's class is created (unless it's a template-only component). This
  instance exists as long as the component is rendered. When the component is
  removed, it's instance is torndown, and all the values on the instance are
  cleaned up (via JavaScript's built-in [garbage collection][1]).

- **Controller state**. When a route is rendered, its controller is created and
  used to back the template for that route, like we discussed in the previous
  section on Routing. Unlike components, controllers continue to exist for the
  remainder of the application's lifecycle. This means we must be mindful of
  their state, especially when routing back to them over time.

- **Service state**. Services, like controllers, exist from the first time they
  are used, until the application exits. Services are where Ember applications
  store state that should last for a long time in the application, like data
  loaded from the server, or created and saved locally.

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management#Garbage_collection

In the section on components, we showed how Ember applications can be visualized
as a tree of controllers and components:

```
TODO: Diagram of components/controllers
```

A piece of state can exist on any one of the components or controllers in this
tree, and be passed down to the children of that component or controller via
component arguments:

```
TODO: Diagram showing state being passed down several nodes
```

Note that just because some state exists on a parent doesn't mean it exists on
the child - it has to be passed down explicitly. Otherwise, we would come
dangerously close to having effectively _global_ state for everything, which
would not be ideal.

Controllers exist for the lifetime of a program, so even when we've changed
pages and navigated away, destroying the components in that tree, any state that
exists on the controller will stay there, and be used next time that page is
rendered.

```
TODO: Diagram showing multiple controllers, only one with a subtree, maybe a
transition between the two somehow, and state living on the controller.
```

Services also exist for the lifetime of a program, and can be injected into the
any component or controller. State that is stored on a service is effectively
available _anywhere_, which is a very powerful tool:

```
TODO: Diagram showing a service, separate from the component tree, containing
state which is consumed by several components
```

Services can be used to centralize your state in one location, but if not used
carefully and with solid conventions they can become messy quickly.

## How State Flows

If we're mapping the flow of state in an Ember application, we can start by
looking at how it flows down the component tree on first render:

```
TODO: Diagram showing several components and a service. Pieces of state should
start in several places, one in the service, one in the root component, one in
an arbitrary middle node, and then arrows should chart their path to rendered
DOM
```

Every piece of state starts in some component, controller, or service, and is
passed downward into either another component, or the template, and finally the
rendered HTML.

Where things get interesting is when state _changes_, and how state flows after
a change. In Ember applications, state can change in three main ways:

- **Actions**, which are events that occur in a component or controller, and
  travel through the component tree. All UI interactions start as actions, but
  other types of events can trigger actions as well.
- **Data loading**, like in a Route's model hook.
- **Background events**, or any kind of state update coming from a service. Some
  applications don't have many or any background events, but some do (e.g.
  Websockets that are pushing information from the server)

### Actions

As we discussed in the section on [Actions](../../templates/actions/), they are methods on a component or
controller that can be used to update its state. Actions are passed down with
the rest of a component's data when Ember renders:

```
TODO: Diagram showing the same Data Down as above, but with actions highlighted
```

Eventually, the action is triggered in some child component or template. It then
_flows_ upward to the component it originated from, and modifies some state
there:

```
TODO: Diagram showing the flow back upwards from the action
```

Ember then rerenders any parts of that component that changed, including child
components. Data flows _back_ downward in this way, toward the children of the
modified component:

```
TODO: Diagram showing the data flowing downward during rerender
```

This is what is meant by the "Data-Down, Actions-Up" flow that Ember users
sometimes talk about, and that has been mentioned elsewhere in the guides. Data
starts in some root location, flows downward to child components, and actions
flow back upward to mutate the data where it is "owned". We can create flow
charts for most Ember apps that show the various cycles of state in it:

```
TODO: Diagram showing a more complex app (less detailed) with many DDAU cycles
visible in it.
```

We'll discuss what data/state ownership means more below. It's also important to
note that actions can flow _outward_ to services, mutating service state:

```
TODO: Diagram showing an action flowing toward a service, and the service
flowing back into several components.
```

This can be done directly, by updating some state in the service, or by updating
some state owned by the service that is shared, such as a tracked object, or a
data model.

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ProfileComponent extends Component {
  @service store;
  @service preferences;

  @action
  updateName(name) {
    let user = this.store.peekRecord('user', this.args.userId);

    // This user model is owned by the store, so the action
    // is updating data it locally, but it'll affect everywhere
    // else as well.
    user.set('name', newName);
  }

  @action
  updateLanguage(newLanguage) {
    // Assuming preferredLanguage is a tracked property, updating
    // it here will update everywhere it is injected and used.
    this.preferences.preferredLanguage = newLanguage;
  }
}
```

Likewise, tracked objects that are passed down from parent components to child
components can also be mutated directly, and will cause anywhere they are used
to rerender.

### Data Loading & Background Events

Whenever we load data, it's like we're scheduling an action to occur later and
update some state in the current component or route:

```
TODO: Diagram showing a cycle within a single route/component
```

Once the data loads, it updates the state, and data flows downward like normal

Background events are similar to data loading. Something is scheduled to happen
in the background, like a `setTimeout` or `setInterval`, a callback scheduled in
the [runloop][2], or connection is opened to something that communicates
directly with the app, like a websocket or a web worker. When these events occur
and update state, they trigger a rerender just like data loading.

[2]:

Background events and data fetching can both trigger actions as well when they
occur in components, in which case they may interact with other components in
the copmonent tree:

```
TODO: Diagram showing a cycle within a single route/component, triggering a
DDAU cycle
```

## State Ownership

Now that your familiar with all the various ways state can change and flow
within an Ember application, let's talk about how you should setup your state.
Generally, spreading state throughout your application without any organization
is a bad idea. It leads to lots of complicated data flows that can interact
poorly, lead to bugs, and cause issues with performance.

One way to think about state organization is in terms of _ownership_. That is,
on a separation of concerns level, which class or object _owns_ a particular
piece of state. For example:

- The Router owns the state of the URL and the current page in an Ember app
- Controllers own the state of anything local to a given page
- In Ember Data, the Store service owns all of the instances of the data models.
- In a Session service, such as the one provided by [ember-simple-auth][3], the
  service owns the state of whether or not the user is logged in, and their
  session data.

[3]: https://github.com/simplabs/ember-simple-auth#the-session-service

In general, having well defined ownership of state is crucial to building an
Ember application, and thinking about the ownership of a particular piece of
state can help to figure out where and how the state should be updated over
time.

### Common Ownership Patterns

- **Presentational and Container Components** provide a way to separate concerns
  locally. _Presentational_ components are _stateless_, they receive state from
  their parents only, and if they trigger actions, they are actions that were
  passed down to them. _Container_ components are components that own state or
  load data, possibly from a data store or service.

  ```
  TODO: Diagram showing a container component that owns some state passing it
  down to several children, and their action cycles mutating it.
  ```

* **Object-Oriented** services like [Ember Data][4] or [Apollo][5] (used in
  Ember with [ember-apollo-client][6]) allow you to load and query data as
  objects, and mutate them where you see fit:

  ```
  TODO: Diagram showing state being loaded by the store, flowing down to
  components, and then individual components updating state on the models. Also,
  faded out, but other data cycles in the app to demonstrate that these aren't
  "all-in" solutions.
  ```

  In these solutions, each object owns its own state to degree, with the central
  store being the canonical list of _all_ objects and coordinating their
  interactions, asynchronous effects (loading, saving, deleting, etc), and
  so-on.

* **Centralized** data-stores like [Redux][7] (used in Ember with
  [ember-redux][8]) seek to capture _all_ application state in a single place, the
  centralized store, which owns all state:

  ```
  TODO: Diagram showing actions all flowing to the Redux store/service, and data
  flowing out of it.
  ```

  These solutions streamline data ownership by forcing it all to follow the same
  patterns universally, and ensure that all mutations to that data occur in the
  same place, where the data lives.
