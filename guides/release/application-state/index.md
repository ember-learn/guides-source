Every root of state in an Ember application has a lifetime.
It is created at some point, and it _may_ be destroyed in the future.
When you decide where to keep a piece of state, you also decide how long it lives and who can reach it.

A state's lifetime is not dependent on framework-provided concepts, but on how the data is used.

In order of _most local_ to _most global_:

- template block
    - created: when rendered
    - cleanup: when unrendered
    - for example, within an `if` block, cleanup could happen when the `if` condition becomes false
- component
    - created: when rendered
    - cleanup: when unrendered
- application
    - created: usually on-demand / lazily
    - cleanup: when the application is cleaned up
- ES module
    - created: usually on module load
    - cleanup: must be manually cleaned up
- external
    - created: manually
    - cleanup: manually
    - persists between multiple applications, tabs, page loads

## Start With the Shortest Lifetime

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading" data-test-es-note-heading="">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          Most <strong>state</strong> should actually be <em>derived</em>. Having more roots of state than needed can lead to application bugs, synchronization issues, and a loss of the source of truth. For more information on this, checkout <a href="../in-depth-topics/reactivity">Reactivity</a>.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Keep bespoke roots of state as close as possible to the code that uses them.
Move a root of state to a longer lifetime only when something outside of that lifetime needs to read or change it (which may be common).

Some examples:

The open state of one row in a list has a template block lifetime. 
The text in a search box, or the selected rows in a table, has a component lifetime.
A signed-in user has an external lifetime, stored in a cookie/session/token.
A shopping cart, or an open WebSocket connection, has an application lifetime.
A page number or a filter that the user expects to survive a refresh is external state, because it lives in the URL.

All of these states can live in "external state", such as a session, cookie, localStorage, URL, etc - so that when users refresh the page (or their device reboots), their state can be as it was when they were last looking at the page. This strategy for managing state requires application-specific logic for serializing to/from these external stores of state. 

## Tools for Each Lifetime

For state with a template block lifetime, use the values that the block provides.
Block params from `{{#each}}` and `{{#let}}`, and any component rendered inside an `{{#if}}`, are created with the block and torn down with it.

For external state, use the [storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event) or [matchMedia change event](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event) (or other browser-spawned event) to have the browser call back in to your application so that updates can propagate.
For state with a component lifetime, use [tracked properties](../components/component-state-and-actions/) on the component.
When a component collects too many properties, move them into a [plain class](../application-state/state-in-plain-classes/) that the component creates -- this type of refactor has the added benefit of enabling easy unit testing.

For state with an application lifetime, create a [plain class tied to the application](../application-state/application-wide-state/).
Use a [Service](../application-state/services/) only for the small set of state that the application needs to boot.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading" data-test-es-note-heading="">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          A service should only be used for the <em>the minimally required</em> application state needed to boot the app.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

State at the top level of an ES module lives for as long as the page does, and can be dangerous to use in tests as it requires manual resetting between tests.
Every application instance on the page shares it, and so does every test in a test run.
Prefer an application lifetime, which gives you the same sharing with cleanup included.

External state lives outside of the application: the URL, `localStorage`, cookies, or a server.
The application reads it into a shorter lifetime when it is needed, and writes it back when it changes.
For the URL, use the [route model](../routing/specifying-a-routes-model/) and [query params](../routing/query-params/).
