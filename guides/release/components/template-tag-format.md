The template tag component format allows defining a component's template using a `<template>` tag block. This block is a first-class participant in JavaScript and TypeScript with strict mode template semantics. For this new format, the extensions `.gjs` and `.gts` are used respectively.

Template tag components address a number of pain points when defining a template as a separate file, and provide a number of new capabilities:

- Accessing local JavaScript values requires no backing class, enabling much easier use of existing JavaScript ecosystem tools.
- Authoring more than one component in a single file, where colocation makes sense.
- Creating locally-scoped helpers, modifiers, and other JavaScript functionality *just works*.

## Installation

To use template tag components, you must install the [ember-template-imports](https://github.com/ember-template-imports/ember-template-imports) addon:

```bash
npm add --save-dev ember-template-imports
```

For integration with tools like Prettier and Glint, and information on version compatibility, refer to the addon's readme.

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
