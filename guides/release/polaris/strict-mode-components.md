ember-template-imports
==============================================================================

This addon provides the build tooling required to support Ember's next-gen component authoring format:

```js
import { on } from '@ember/modifier';
import FancyButton from './fancy-button';

function greet() {
  alert("AHOY!")
}

<template>
  <p>Hello, {{@name}}!</p>
  <FancyButton @label="Say hello!" {{on "click" greet}} />
</template>
```

This design uses `<template>` to allow us to author JavaScript or TypeScript in
the same file as templates, while keeping a clear separation between the
template language and the JavaScript around it.

This "next-gen" format is [the official future][rfc-0779] of Ember's authoring
story, and is stable and usable today. (It is already being used in some of the
largest Ember apps in the world!) We expect it to become the recommended way of
authoring *all* Ember apps in the near future, once we are satisfied that we
have sufficiently polished up all the corners of the implementation.

[rfc-0779]: https://rfcs.emberjs.com/id/0779-first-class-component-templates


## Installation and setup

Install this package and [the supporting Prettier plugin][prettier-plugin]:

[prettier-plugin]: https://github.com/gitKrystan/prettier-plugin-ember-template-tag

- pnpm:

  ```sh
  pnpm add --save-dev ember-template-imports prettier-plugin-ember-template-tag
  ```

- Yarn:

  ```sh
  yarn add --dev ember-template-imports prettier-plugin-ember-template-tag
  ```

- npm:

  ```sh
  npm add --save-dev ember-template-imports prettier-plugin-ember-template-tag
  ```

Then configure the Prettier plugin following [the instructions from its
README][prettier-plugin]. Additionally, make sure you are using at least v5.8.0
of [ember-template-lint][etl] and v11.6.0 of [eslint-plugin-ember][epe], so your
linting tools will work correctly.

[etl]: https://github.com/ember-template-lint/ember-template-lint
[epe]: https://github.com/ember-cli/eslint-plugin-ember

Additionally, if you are using TypeScript, you will also want to set up
[Glint][glint], following [its setup instructions][glint-setup]. (Make sure you
include `@glint/environment-ember-template-imports`!)

[glint]: https://typed-ember.gitbook.io/glint
[glint-setup]: https://typed-ember.gitbook.io/glint/environments/ember/installation


## Compatibility

* Ember.js v3.27 or above
* Ember CLI v3.27 or above
* `ember-cli-htmlbars` 6.3.0 or above
* Node.js v12 or above


## Editor Integrations

To get syntax highlighting inside embedded templates and support for the GJS
file extension, you may need to configure your editor.

### Visual Studio Code

The [Ember.js extension pack](https://marketplace.visualstudio.com/items?itemName=EmberTooling.emberjs) bundles everything you need to get started.


### Neovim

[Example Neovim Config](https://github.com/NullVoxPopuli/dotfiles/blob/main/home/.config/nvim/lua/plugins/syntax.lua#L52) with support for good highlighting of embedded templates in JS and TS, using:

- https://github.com/nvim-treesitter/nvim-treesitter
- https://github.com/alexlafroscia/tree-sitter-glimmer

Additionally, when using the eslint-lsp, you'll need to tell ESLint to activate when `javascript.glimmer` and `typescript.glimmer` files are loaded. [Example](https://github.com/NullVoxPopuli/dotfiles/blob/main/home/.config/nvim/lua/plugin-config/lsp/init.lua#L147).

<details><summary>Configure ESLint for gjs + gts and fix-on-save</summary>

```lua
local lsp = require('lspconfig')
  
-- ✂️ 

local eslint = lsp['eslint']
  
eslint.setup({
  filetypes = { 
    "javascript", "typescript", 
    "typescript.glimmer", "javascript.glimmer", 
    "json", 
    "markdown" 
  },
  on_attach = function(client, bufnr)
    vim.api.nvim_create_autocmd("BufWritePre", {
      buffer = bufnr,
      command = "EslintFixAll",
    })
  end,
})
```
  
</details>


### Other editors

For other editors, you may be able to get support using one of these other syntax definitions:

- [TextMate](https://github.com/IgnaceMaes/glimmer-textmate-grammar)
- [TreeSitter](https://github.com/alexlafroscia/tree-sitter-glimmer)


## Using Template Tags and `.gjs`/`.gts` Files

The new `<template>` tag format is available in `.gjs` and `.gts` files. These
file extensions represent a new file format "GlimmerJS" and "GlimmerTS", which
are supersets of standard JavaScript and TypeScript respectively. In this
syntax, templates are defined in JavaScript files directly.

This example defines a template-only component, which is the default export of
`hello.gjs`:

```js
// components/hello.gjs
<template>
  <span>Hello, {{@name}}!</span>
</template>
```

You would be able to use this component in another component like so:

```js
// components/hello-world.gjs
import Hello from './hello';

<template>
  <Hello @name="world" />
</template>
```

You can also export the component explicitly:

```js
// components/hello.gjs
export default <template>
  <span>Hello, {{@name}}!</span>
</template>;
```

Omitting the `export default` is just syntactic sugar. In addition, you can
define template-only components and assign them to variables, allowing you to
export components with named exports:

```js
export const First = <template>First</template>;

export const Second = <template>Second</template>;

export const Third = <template>Third</template>;
```

This also allows you to create components that are only used locally, in the
same file:

```js
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

```js
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

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

// components/hello.gjs
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

```js
// tests/integration/components/hello-test.gjs
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

## Reference: built-in helpers, modifiers, components

As implemented as part of the [Strict Mode Templates RFC][rfc-496], the built in
helpers, modifiers and components are available for import:

* `array` (`import { array } from '@ember/helper';`)
* `concat` (`import { concat } from '@ember/helper';`)
* `fn` (`import { fn } from '@ember/helper';`)
* `get` (`import { get } from '@ember/helper';`)
* `hash` (`import { hash } from '@ember/helper';`)
* `on` (`import { on } from '@ember/modifier';`)
* `Input` (`import { Input } from '@ember/component';`)
* `LinkTo` (`import { LinkTo } from '@ember/routing';`)
* `Textarea` (`import { Textarea } from '@ember/component';`)

[rfc-496]: https://github.com/emberjs/rfcs/pull/496


## History

Like Glimmer components, the primitive APIs for supporting imports were built
before we decided on a final format for their high level usage in [RFC
0779][rfc-0779]. There were a number of different ideas for how we can integrate
imports with templates, and the idea behind this addon was that it could be a
test bed for them all. This allowed us to share common tooling between
solutions, and work together as a community as we explored the design space.

The main alternative explored in a previous version was template literals,
similar to the existing `hbs` helper in tests:

```js
import { hbs } from 'ember-template-imports';
import MyComponent from './my-component';

export default hbs`
  <MyComponent/>
`;
```

For the previous version of this addon, see [this repository][first-repo]. And
huge thanks to @patricklx for his contributions here!

[first-repo]: https://github.com/patricklx/ember-template-imports

As of [RFC 0779][rfc-0779], we decided on `<template>` over `hbs`; see the RFC for the full rationale. ~~The `hbs` format is still technically supported by this repo for transition purposes for the early adopters who helped us get here, but will be removed at some point in the near future!~~ `hbs` has been removed -- if you rely on this feature, please use `ember-template-imports @ < v4`, until migrated to `<template>`
