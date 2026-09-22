This guide is designed to help you get up and running with TypeScript in an Ember app.

This is _not_ an introduction to TypeScript _or_ Ember. Throughout this guide, we'll link back to [the TypeScript docs][typescript-docs] and to other sections of [the Ember Guides][ember-guides] when there are specific concepts that we will not explain here but which are important for understanding what we're covering!

Not sure where to get started? Here's an overview of the content within:

- If you're totally new to using TypeScript with Ember, start with [Core Concepts: TypeScript and Ember][core-concepts].
- To create a new Ember app or addon with TypeScript, check out [Getting Started with TypeScript][getting-started] and [Building Addons in TypeScript][addons].
- If you're looking to convert an existing Ember app to TypeScript, check out [Converting an Existing Ember App to TypeScript][converting-an-app].
- If you're working with legacy (pre-Octane) Ember and TypeScript together, you should read [TypeScript and Ember Classic][legacy].
- Not ready to switch to TypeScript? You can get many of TypeScript's benefits by [adding types with JSDoc comments][types-with-jsdoc]. We'll talk a bit about this over in the [Signatures][] section.
- Looking for type-checking in Ember templates? Check out [Glint][].

## Why TypeScript?

What is TypeScript, and why should you adopt it?

> TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
>
> — [typescriptlang.org][typescript]

TypeScript lets you build _ambitious web applications_ with confidence—so it's a perfect fit for Ember apps!

- Get rid of `undefined is not a function` and `null is not an object` once and for all.
- Enjoy API docs… that are always up-to-date.
- Experience better developer productivity through top-notch editor support, including incredible autocomplete, guided refactoring, automatic imports, and more.

<!-- Internal links -->

[addons]: ./application-development/addons/
[converting-an-app]: ./application-development/converting-an-app
[core-concepts]: ./core-concepts
[ember-guides]: ..
[getting-started]: ./getting-started
[legacy]: ./additional-resources/legacy
[signatures]: ./core-concepts/invokables/#toc_signature-basics

<!-- External links -->

[glint]: https://typed-ember.gitbook.io/glint/
[types-with-jsdoc]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
[typescript]: http://www.typescriptlang.org
[typescript-docs]: https://www.typescriptlang.org/docs/
