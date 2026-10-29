This page lists common typescript patterns you might need to know about on one page.
Use the "On this page" sidebar to jump to a topic, or search the page with <kbd>Ctrl</kbd>+<kbd>F</kbd> (<kbd>⌘</kbd>+<kbd>F</kbd> on a Mac) for the thing that you want.


## TypeScript

### `Signature`

In a `.gts` file, a signature describes the parts of a component that the caller uses.

- `Args`: the arguments. Add `?` to an optional argument.
- `Blocks`: the blocks, and the types of the block parameters of each block.
- `Element`: the element that receives `...attributes`.

```gts
interface ToggleSignature {
  Element: HTMLDivElement;
  Args: {
    label: string;
    initial?: boolean;
  };
  Blocks: {
    default: [isOn: boolean, toggle: () => void];
  };
}
```

### `Component<Signature>`

Give the signature to [`Component`](https://api.emberjs.com/ember/release/modules/@glimmer%2Fcomponent) as a type argument.
Then TypeScript checks [`this.args`](https://api.emberjs.com/ember/release/modules/@glimmer%2Fcomponent), the `@arguments` in the template, and the values that you [`yield`](https://api.emberjs.com/ember/release/functions/Keywords/yield).

```gts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export class Toggle extends Component<ToggleSignature> {
  @tracked isOn = this.args.initial ?? false;

  toggle = () => {
    this.isOn = !this.isOn;
  };

  <template>
    <div ...attributes>
      {{@label}}
      {{yield this.isOn this.toggle}}
    </div>
  </template>
}
```

### `TOC<Signature>`

A template-only component has no class.
Give it a type with [`TOC`](https://api.emberjs.com/ember/release/modules/@ember%2Fcomponent%2Ftemplate-only) from `@ember/component/template-only`.

```gts
import type { TOC } from '@ember/component/template-only';

interface BadgeSignature {
  Element: HTMLSpanElement;
  Args: {
    label: string;
  };
}

export const Badge: TOC<BadgeSignature> = <template>
  <span class="badge" ...attributes>{{@label}}</span>
</template>;
```

### `satisfies TOC<Signature>`

You can also put the type after the template, with [`satisfies`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator).

```gts
import type { TOC } from '@ember/component/template-only';

export const Badge = <template>
  <span class="badge" ...attributes>{{@label}}</span>
</template> satisfies TOC<BadgeSignature>;
```

### `modifier<Signature>`

A modifier signature has the element, and the positional and named arguments.

```gts
import { modifier } from 'ember-modifier';

interface ScrollToSignature {
  Element: HTMLElement;
  Args: {
    Positional: [position: number];
  };
}

export const scrollTo = modifier<ScrollToSignature>((element, [position]) => {
  element.scrollTop = position;
});
```

### Helpers: typed functions

A helper is a function, so you give it types as you do for all functions.
Named arguments are in one object, which is the last parameter.

```gts
const greet = (name: string, { greeting }: { greeting: string }) =>
  `${greeting}, ${name}!`;

<template>
  {{greet @name greeting="Hello"}}
</template>
```

### `WithBoundArgs`

When a component yields a component with [`(component)`](https://api.emberjs.com/ember/release/functions/Keywords/component), use `WithBoundArgs` from `@glint/template` for the type.
The second type argument lists the arguments that are already set, so the caller does not have to pass them.

```gts
import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import { Tab } from './tab';

interface TabsSignature {
  Args: {
    initial: string;
  };
  Blocks: {
    default: [{ Tab: WithBoundArgs<typeof Tab, 'active' | 'onSelect'> }];
  };
}

export class Tabs extends Component<TabsSignature> {
  // ...
}
```

Learn more: [TypeScript: Invokables](../../typescript/core-concepts/invokables/).
