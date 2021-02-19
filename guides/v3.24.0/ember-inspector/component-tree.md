The Components tab displays a collapsible representation of the views and components that are currently being rendered.  Selecting a component from the tree will open it in the [Object Inspector](../object-inspector/). 

<img src="/images/guides/ember-inspector/v4.3.4/component-tree-intro.png" width="680">

Components will be displayed as custom elements with angle brackets.

### Scrolling to a Component in the Browser

Clicking the 'markup tag' icon to the right of a component will scroll that component into view in the browser.

<img src="/images/guides/ember-inspector/v4.3.4/component-tree-scroll.png" width="333">

### Expanding and Collapsing Components

Components can have their children hidden and shown by clicking the caret just to the left of the component.

The two icons to the left of the search field will expand or collapse all components.

<img src="/images/guides/ember-inspector/component-tree-toolbar-expand.png" width="680">

### Filtering Components

By typing in the search field you can limit the components that are shown in the tree.

<img src="/images/guides/ember-inspector/v4.3.4/component-tree-filtering.png" width="680">

### Highlighting Templates

#### Hovering over the Component Tree

When you hover over the items in the Component Tree, the related component will be
highlighted in your app. For every highlighted component, you can see the
template name and its associated objects.

<img src="/images/guides/ember-inspector/v4.3.4/component-tree-hover.png" width="680">

#### Hovering over the app

If you want to highlight a component directly within your app, click on the icon to the left of the search bar. As your mouse passes over it, the related component will be
highlighted.

<img src="/images/guides/ember-inspector/component-tree-toolbar-inspect.png" width="500">


If you click on a highlighted template or component, the Inspector will select it. You can then
click on the backing objects to send them to the object inspector.

<img src="/images/guides/ember-inspector/v4.3.4/component-tree-inspect.png">

Click on the `X` button to deselect a template.

