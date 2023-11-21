The template tag component format allows defining a component's template using a `<template>` tag block. This block is a first-class participant in JavaScript and TypeScript with strict mode template semantics. For this new format, the extensions `.gjs` and `.gts` are used respectively.

Template tag components address a number of pain points when defining a template as a separate file, and provide a number of new capabilities:

- Accessing local JavaScript values requires no backing class, enabling much easier use of existing JavaScript ecosystem tools.
- Authoring more than one component in a single file, where colocation makes sense.
- Creating locally-scoped helpers, modifiers, and other JavaScript functionality *just works*.

## Installation

To use template tag components, install the [ember-template-imports](https://github.com/ember-template-imports/ember-template-imports) addon:

```bash
npm add --save-dev ember-template-imports
```

For integration with tools like Prettier and Glint, and information on version compatibility, refer to the addon's readme.

## Editor Integrations

To get syntax highlighting inside embedded templates and support for the GJS file extension, you may need to configure your editor.

### Visual Studio Code

The [Ember.js extension pack](https://marketplace.visualstudio.com/items?itemName=EmberTooling.emberjs) bundles everything you need to get started. More specifically, the [vscode-glimmer-syntax](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-glimmer-syntax) extension will add support for `glimmer-js` and `glimmer-ts` languages.

### Neovim

Here's an [example Neovim Config](https://github.com/NullVoxPopuli/dotfiles/blob/main/home/.config/nvim/lua/plugins/syntax.lua#L52) with support for good highlighting of embedded templates in JS and TS, using:

- [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)
- [tree-sitter-glimmer](https://github.com/alexlafroscia/tree-sitter-glimmer)

### Other editors

For other editors, you may be able to get support using one of these other syntax definitions:

- [TextMate](https://github.com/IgnaceMaes/glimmer-textmate-grammar)
- [TreeSitter](https://github.com/alexlafroscia/tree-sitter-glimmer)

## Using Template Tags and `.gjs`/`.gts` Files

The new `<template>` tag format is available in `.gjs` and `.gts` files. These file extensions represent a new file format "GlimmerJS" and "GlimmerTS", which are supersets of standard JavaScript and TypeScript respectively. In this syntax, templates are defined in JavaScript files directly.

This example defines a template-only component, which is the default export of hello.gjs:

```text {data-filename="app/components/hello.gjs"}
<template>
  <span>Hello, {{@name}}!</span>
</template>
```

You would be able to use this component in another component like so:

```text {data-filename="app/components/world.gjs"}
import Hello from 'example-app/components/hello';

<template>
  <Hello @name="world" />
</template>
```
You can also export the component explicitly:

```text {data-filename="components/hello.gjs"}
export default <template>
  <span>Hello, {{@name}}!</span>
</template>;
```

Omitting the `export default` is just syntactic sugar. In addition, you can
define template-only components and assign them to variables, allowing you to
export components with named exports:

```text {data-filename="components/hello.gjs"}
export const First = <template>First</template>;

export const Second = <template>Second</template>;

export const Third = <template>Third</template>;
```

This also allows you to create components that are only used locally, in the
same file:

```text {data-filename="components/custom-select.gjs"}
const Option = <template>
  <option selected={{@selected}} value={{@value}}>
    {{or @title @value}}
  </option>
</template>;

export const CustomSelect = <template>
  <select>
    {{#each @options as |opt|}}
      <Option
        @value={{opt.value}}
        @selected={{eq opt @selectedOption}}
      />
    {{/each}}
  </select>
</template>;
```

Helpers and modifiers can also be defined in the same file as your components,
making them very flexible:

```text {data-filename="components/list.gjs"}
import { modifier } from 'ember-modifier';

const plusOne = (num) => num + 1;

const setScrollPosition = modifier((element, [position]) => {
  element.scrollTop = position
});

<template>
  <div class="scroll-container" {{setScrollPosition @scrollPos}}>
    {{#each @items as |item index|}}
      Item #{{plusOne index}}: {{item}}
    {{/each}}
  </div>
</template>
```

Finally, to associate a template with a class-based component, you can use the
template syntax directly in the class body:

```text {data-filename="components/hello.gjs"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

export default class Hello extends Component {
  @tracked count = 0;

  increment = () => {
    this.count += 1;
  };

  decrement = () => {
    this.count -= 1;
  };

  <template>
    <button {{on "click" this.increment}}>+</button>
    Count: {{this.count}}
    <button {{on "click" this.decrement}}>&minus;</button>
  </template>
}
```

Template tag components can also be used for writing tests. In fact, this aligned syntax between app code and test code is one of the big advantages of the new authoring format.

Just like in app code, the template tag has access to the outer scope. This means you can reference variables directly in your tests:

```text {data-filename="tests/integration/components/hello-test.gjs"}
import Hello from 'example-app/components/hello';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

module('Integration | Component | hello', function (hooks) {
  setupRenderingTest(hooks);

  test('renders name argument', async function (assert) {
    const name = 'world';
    await render(<template><Hello @name={{name}} /></template>);
    assert.dom('[data-test-id="some-selector"]').hasText(name);
  });
});
```
