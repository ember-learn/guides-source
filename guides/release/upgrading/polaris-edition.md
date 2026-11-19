Polaris is Ember's next edition.

## What is an edition?

Learn about Editions and upcoming major development of Ember in our [Editions page](https://emberjs.com/editions/).

## What is Ember Polaris?

Visit [the Polaris Edition page](https://emberjs.com/editions/octane/) to learn about the four pillars of Polaris:
- First-class TypeScript Support
- Template tag components
- Embroider build system
- Reactivity improvements

## How do I migrate to Polaris?

Even though Polaris is not released yet, you can already use the core concepts it brings to your application as long as it implements some pre-requisite.

Refer to the [Upgrade Guides' introduction][index] to get guidance about when to introduce these concepts in your global upgrade path.

### First-class TypeScript Support 

If your app relies on JavaScript and you want to start using TypeScript, we recommend you to be at least on a version of Ember that includes native types, so the TypeScript is lighter.

### Template tags components

This format requires Ember 3.28. The easiest way to start is to rely on [template-tag-codemod](https://github.com/embroider-build/embroider/tree/main/packages/template-tag-codemod). The documentation lists all the pre-requisites you need to implement before running the codemod.

### Embroider build system (with Vite)

 It requires Ember 3.28. You can ease the migration using [ember-vite-codemod](https://github.com/mainmatter/ember-vite-codemod).

### Reactivity improvements

See [`ember-resources`](https://github.com/NullVoxPopuli/ember-resources) repository for the list of pre-requisites and the documentation to improve your reactivity system with resources. 
