The template tag format is the default way to write components in Ember. It's a single-file format that combines the component's JavaScript and Glimmer template code. The `<template>` tag is used to keep a clear separation between the template language and the JavaScript around it.

Template tag components use the file extension `.gjs`. This abbreviation is short for "Glimmer JavaScript". The file extension `.gts` is also supported for TypeScript components.

Template Tag became the default component authoring format [starting at Ember 6.8](https://rfcs.emberjs.com/id/0779-first-class-component-templates/).

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
       Before the creation of Template Tag, components were authored as paired JS and HBS files. The HBS in these files has some different behaviors than modern Template Tag. The <a href="https://rfcs.emberjs.com/id/0496-handlebars-strict-mode/">Strict Handlebars RFC</a> explains what changed between HBS and GJS.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Template Tag Syntax

When you use the `.gjs` (or `.gts`) file extension, you're adding one extra syntax feature to JavaScript (or TypeScript): the `<template>` tag.

`<template>` can be used in two different positions: as expressions and inside class bodies.

### Template-tags as Expressions

When you use a `<template>` tag as an expression, you're defining a template-only component:

```gjs
const Greeting = <template>Hello World</template>
```

And if you put a `<template>` tag expression by itself in module scope:


```gjs
<template>Hello World</template>
```

That is shorthand for also saying `export default`:

```gjs
export default <template>Hello World</template>
```
### Template-tags in Classes

A `<template>` tag can also be embedded inside a class body:

```gjs
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

This associates the template with the class. When the resulting `Avatar`
component is invoked, it's the `<template>` that will be rendered, with `this`
bound to an instance of the `Avatar` class.

## Accessing JavaScript Scope

`<template>` tags have access to the surrounding JavaScript scope. For example:

```gjs
const value = 2;

function square(number) {
  return number * number;
}

<template>
  The square of {{value}} equals {{square value}}
</template>
```

This will render to `The square of 2 equals 4`.

### Multiple components per file

Because we have `<template>` tag expressions and access to local scope, you can
define multiple components in a single JavaScript module and let them call each
other:

```gjs
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

## Importing components, helpers, and modifiers

In Ember templates, **“invokables”** are things you can *invoke* in a template. These include [components](./introducing-components/), [helpers](./helper-functions/), and [modifiers](./template-lifecycle-dom-and-modifiers/). In the template tag format, most invokables need to be in JavaScript scope. Therefore your module must either define them or import them.

### Built-in invokables

A small number of commonly-used invokables are always available, without needing to import them. This includes [on](https://api.emberjs.com/ember/7.1.0/functions/Keywords/on) for event handling, boolean logic helpers like [and](https://api.emberjs.com/ember/7.1.0/functions/Keywords/and), comparisons like [eq](https://api.emberjs.com/ember/7.1.0/functions/Keywords/eq), and others. See the full list on the [Ember Helpers API Docs](https://api.emberjs.com/ember/7.1.0/modules/@ember%2Fhelper).

Built-in invokables have lower precedence than your local JavaScript scope, so that future built-ins will never break your existing code.


## Low-level, Pure-JavaScript format

All of template-tag format has an equivalent pure-JS representation.

The template-only-component case converts like this:

```gjs
// ----- GJS Syntax ------------------------
import { pageTitle } from "ember-page-title";

const LandingPage = <template>
  {{pageTitle "Welcome"}}
  <h1>Welcome</h1>
</template>;

// ------ Equivalent JS Syntax -------------
import { pageTitle } from "ember-page-title";
import { template } from '@ember/template-compiler';

const LandingPage = template(`{{pageTitle "Welcome"}}
<h1>Welcome</h1>`, {
  scope: () => ({ pageTitle })
})
```

And the class-based-component case converts likes this:


```gjs
// ------ GJS Syntax ---------------
import { pageTitle } from "ember-page-title";

class LandingPage extends Component {
  <template>
    {{pageTitle "Welcome"}}
    <h1>Welcome</h1>
  </template>
}

// ------ Equivalent JS Syntax -------------
import { pageTitle } from "ember-page-title";
import { template } from '@ember/template-compiler';

class LandingPage extends Component {
  static {
    template(`{{pageTitle "Welcome"}}
<h1>Welcome</h1>`, {
      component: this,
      scope: () => ({ pageTitle })
    });
  }
}
```

Just like the `<template></template>` syntax, `template()` from `@ember/template-compiler` can be build-time optimized, so you're not allowed to use any syntax other than string literals for the first argument. For example:

```js
import { template } from '@ember/template-compiler';

// This is OK because the first argument to template() is a string literal:
const LandingPage = template(`{{pageTitle "Welcome"}}
<h1>Welcome</h1>`, {
  scope: () => ({ pageTitle })
})

// This is a build error because the first argument is not a string literal:
const LandingPage = template(buildTemplate(), {
  scope: () => ({ pageTitle })
})

function buildTemplate() {
  return `{{pageTitle "Welcome"}}
<h1>Welcome</h1>`;
}
```

If you want to relax this restriction, you can opt-in to runtime template compilation instead. This is more expensive at runtime and pulls additional template-compilation code into your app. But it's appropriate for dynamic environments like interactive development tools:

```js
// Notice the different import path here:
import { template } from '@ember/template-compiler/runtime';

// This is now OK because no static build-time analysis will 
// be performed, and you can use arbitrary code to produce a 
// string value at runtime.
const LandingPage = template(buildTemplate(), {
  scope: () => ({ pageTitle })
})

function buildTemplate() {
  return `{{pageTitle "Welcome"}}
<h1>Welcome</h1>`;
}
```

### Scope Arguments

The `<template>` syntax in GJS is able to "see" outer JavaScript scope (like the value of `pageTitle` in the examples above). When we convert the template to a JavaScript string, that's no longer possible, so we need to add either the `scope` or `eval` arguments. The examples above use `scope`, which is best when you know precisely which values from JavaScript scope are needed inside the template. For more dynamic situations, you can alternatively pass `eval`:

```js
import { template } from '@ember/template-compiler/runtime';

template(someArbitraryTemplateString(), {
  eval() {
    return eval(arguments[0]);
  }
})
```

The above example is the *only* way you should implement the `eval` callback. It uses `arguments` instead of an explicitly-named function parameter because otherwise that parameter could shadow the value that the template compiler is trying to retrieve from an outer scope.

## Testing

`<template>` tag expressions make it easy to write component tests. See [Testing Components](../../testing/testing-components/) for details.

```gjs
  test('renders name argument', async function (assert) {
    const initial = 'Zoey';
    await render(
      <template>
        <Avatar @title="Picture of Zoey" @initial={{initial}} />
      </template>
    );
    assert.dom().hasText(initial);
  });
});
```

## Integration with external tooling

These tools have minimum versions to support Template Tag:

- [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint): Versions 5.8.0 and up.
- [eslint-plugin-ember](https://github.com/ember-cli/eslint-plugin-ember): Versions 11.6.0 and up.
- [Prettier](https://github.com/prettier/prettier): Versions 3.1.0 and up. This requires installing the [prettier-plugin-ember-template-tag](https://github.com/gitKrystan/prettier-plugin-ember-template-tag).
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

- [TextMate](https://github.com/lifeart/vsc-ember-syntax/tree/master/syntaxes)
- [TreeSitter](https://github.com/alexlafroscia/tree-sitter-glimmer)

