The template tag format is a powerful, new way to write components in Ember. It's a single-file format that combines the component's JavaScript and Glimmer template code. The `<template>` tag is used to keep a clear separation between the template language and the JavaScript around it.

Template tag components use the file extension `.gjs`. This abbreviation is short for "Glimmer JavaScript". The file extension `.gts` is also supported for TypeScript components.

This new format is the official future of Ember's component authoring story, and is stable and usable today. We expect it to become the recommended way of authoring all Ember apps in the near future, once we are satisfied that we have sufficiently polished up all the corners of the implementation.

## Writing template tag components

Just like with separate JavaScript and Glimmer template files, the template tag format has the concept of template-only components and class-based components. Let's take a closer look at how they compare between both component formats in the next section.

### Template-only components

The following template-only component was created in a previous section to extract an avatar layout into a reusable component.

```handlebars {data-filename="app/components/avatar.hbs"}
<aside>
  <div class="avatar" title={{@title}}>{{@initial}}</div>
</aside>
```

This layout can be turned into a template tag component by wrapping the code in a `<template>` tag and changing the file extension to `.gjs`.

```text {data-filename="app/components/avatar.gjs"}
<template>
  <aside>
    <div class="avatar" title={{@title}}>{{@initial}}</div>
  </aside>
</template>
```

The top-level template tag is exported as default component from the file. You *can* write this export explicitly, but it's not necessary. The following example is equivalent to the previous one.

```text {data-filename="app/components/avatar.gjs"}
export default <template>
  <aside>
    <div class="avatar" title={{@title}}>{{@initial}}</div>
  </aside>
</template>;
```

### Class-based components

A `<template>` tag can also be embedded inside a class definition of a component. This is useful when you need to add state or other logic to your component. Take for example the following "Avatar" component, where a default title is added when the `title` argument is not provided.

```text {data-filename="app/components/avatar.gjs"}
import Component from '@glimmer/component';

export default class Avatar extends Component {
  get titleWithDefault() {
    return this.args.title ?? 'No avatar title provided';
  }

  <template>
    <aside>
      <div class="avatar" title={{this.titleWithDefault}}>{{@initial}}</div>
    </aside>
  </template>
}
```

## Importing components, helpers, and modifiers

The template tag format uses strict template semantics. This means that you can only use components, helpers, and modifiers that are explicitly imported. This makes it easier to understand where things come from and what they do, as well as unlocks build optimizations.

### Importing invokables from the own app

When making use of the "Avatar" component as defined before in a different component file, it first needs to be imported. This is done using the `import` statement, just like you would import any other JavaScript module.

```text {data-filename="app/components/message.gjs"}
import Avatar from 'app/components/avatar';

<template>
  <Avatar
    @title={{@avatarTitle}}
    @initial={{@avatarInitial}}
  />
  <section>
    {{@message}}
  </section>
</template>
```

The example above demonstrates defining a "Message" template-only component. The import syntax for class-based components is the same.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        The components that are imported are not required to use the new template tag format. This is intentional, and very powerful, as it <strong>allows incremental adoption</strong> of the new format.
        <br><br>
        The only prerequisite is that the component is defined using the template-colocation structure instead of the separating the JavaScript and Glimmer template code into separate folders.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Importing helpers and modifiers from the own app also follows the same principle of using standard JavaScript import syntax. Instead of importing from `app/components`, the path to import from is `app/helpers` and `app/modifiers` respectively.

### Importing from addons

Just as with components, helpers, and modifiers from the own app, external invokables from addons also have to be imported. This is done using the same `import` statement, but with a path referencing the addon.

The structure of files within Ember addons is mostly standardized. This means that the path to import from can be derived from the addon's name. For example, an addon that is named `ember-foo` will have its components, helpers, and modifiers available as default import from `ember-foo/components/<component-name>`, `ember-foo/helpers/<helper-name>` and `ember-foo/modifiers/<modifier-name>` respectively.

Some addons may choose to re-export their invokables from the root index as named exports. (This is known as the barrel file pattern) Usually addons will document this usage in their README, which may look like `import { ComponentName } from 'ember-foo';`, if supported.

### Importing built-ins

The Ember built-in helpers, modifiers, and components are available for import from the following locations.

- `array` (`import { array } from '@ember/helper';`)
- `concat` (`import { concat } from '@ember/helper';`)
- `fn` (`import { fn } from '@ember/helper';`)
- `get` (`import { get } from '@ember/helper';`)
- `hash` (`import { hash } from '@ember/helper';`)
- `on` (`import { on } from '@ember/modifier';`)
- `Input` (`import { Input } from '@ember/component';`)
- `LinkTo` (`import { LinkTo } from '@ember/routing';`)
- `Textarea` (`import { Textarea } from '@ember/component';`)

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Feeling a bit lost with remembering all import paths?
        <br><br>
        Make sure to look at your editor setup to see if it can help you with auto-completion of import paths. See the <a href="#toc_editor-integrations">Editor Integrations</a> section for more information.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## New capabilities

In the examples above, functionality that was already available before was covered using the template tag format. The template tag format, however, unlocks a number of new capabilities that were not possible before.

### Locally-scoped values

The template tag format follows JavaScript module syntax. Any value that isn't exported is only available locally within the file. This is useful for defining helper functions that are only used within the component, or for defining constants that are used multiple times within the template.

In the following example, a "Square" component is defined that calculates the square of a number. The `value` constant is defined locally, and the `square` helper function is only available within the component.

```text {data-filename="app/components/square.gjs"}
const value = 2;

const square = (number) => {
  return number * number;
};

<template>
  The square of {{value}} equals {{square value}}
</template>
```

This will render to `The square of 2 equals 4`.

### Multiple components per file

The template tag format allows defining multiple components within a single file. This is useful for defining components that are closely related to each other, but are not used in other parts of the app.

The following example defines a "CustomSelect" component that renders a `<select>` element with a list of options. The locally-defined "Option" component is used to render each option in the list.

```text {data-filename="app/components/custom-select.gjs"}
const Option = <template>
  <option selected={{@selected}} value={{@value}}>
    {{@value}}
  </option>
</template>;

const CustomSelect = <template>
  <select>
    {{#each @options as |opt|}}
      <Option
        @value={{opt.value}}
        @selected={{eq opt @selectedOption}}
      />
    {{/each}}
  </select>
</template>;

export default CustomSelect;
```

This can be a powerful refactoring technique to break up large components into smaller ones. (where it makes sense!)

## Testing

Historically, Ember's integration tests have been written using the `hbs` tagged template literal. This is no longer necessary with the template tag format. Instead, use the `<template>` tag to define a template to render.

The following example showcases how the "Avatar" component can be tested using the template tag format.

```text {data-filename="tests/integration/components/avatar-test.gjs"}
import Avatar from 'app/components/avatar';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

module('Integration | Component | avatar', function (hooks) {
  setupRenderingTest(hooks);

  test('renders name argument', async function (assert) {
    const initial = 'Zoey';
    await render(
      <template>
        <Avatar @title={{"Picture of Zoey"}} @initial={{initial}} />
      </template>
    );
    assert.dom().hasText(initial);
  });
});
```

Notice how the same semantics now apply to tests as well: local values in scope can be referenced directly, and invokables from the own app or addons need to be imported.

## Installation

Install the [ember-template-imports](https://github.com/ember-template-imports/ember-template-imports) addon to start using template tag components. This addon provides all the build tooling required to support the new component authoring format.

```bash
npm add --save-dev ember-template-imports
```

### Integration with external tooling

You may need to upgrade dependency versions or install additional plugins to have proper integration with external tools. The following commonly-used tools are supported:

- [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint): Versions 5.8.0 and up.
- [eslint-plugin-ember](https://github.com/ember-cli/eslint-plugin-ember): Versions 11.6.0 and up.
- [Prettier](https://github.com/prettier/prettier): Versions 3.0.0 and up. This requires installing the [prettier-plugin-ember-template-tag](https://github.com/gitKrystan/prettier-plugin-ember-template-tag).
- [Glint](https://github.com/typed-ember/glint): Requires installing the [environment-ember-template-imports](https://github.com/typed-ember/glint/tree/main/packages/environment-ember-template-imports) plugin.

## Editor Integrations

You may need to configure your editor to get syntax highlighting inside embedded templates and support for the `.gjs` and `.gts` file extension.

### Visual Studio Code

The [Ember.js extension pack](https://marketplace.visualstudio.com/items?itemName=EmberTooling.emberjs) bundles everything you need to get started. More specifically, the [vscode-glimmer-syntax](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-glimmer-syntax) extension will add support for `glimmer-js` and `glimmer-ts` languages and provide syntax highlighting. The [ember-language-server](https://github.com/lifeart/ember-language-server) extension provides automatic import completions and other useful features.

### Neovim

Here's an [example Neovim Config](https://github.com/NullVoxPopuli/dotfiles/blob/main/home/.config/nvim/lua/plugins/syntax.lua#L52) with support for good highlighting of embedded templates in JS and TS, using:

- [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)
- [tree-sitter-glimmer](https://github.com/alexlafroscia/tree-sitter-glimmer)

### Other editors

For other editors, you may be able to get support using one of these other syntax definitions:

- [TextMate](https://github.com/IgnaceMaes/glimmer-textmate-grammar)
- [TreeSitter](https://github.com/alexlafroscia/tree-sitter-glimmer)

