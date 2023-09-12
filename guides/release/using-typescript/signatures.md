**Note:** 🚧 This section is under construction! 🏗️ The content here may undergo significant revision in the months ahead!

To provide improved editor support, hooks for documentation tooling, and type checking for templates, Ember defines the idea of a _signature_.

## What is a signature?

The same way that functions have [function signatures][fn-sig] which define the arguments they take and the values they return, so do helpers, modifiers, and components in Glimmer templates. In Glimmer templates, we call these “invokables” because they are things you can _invoke_ in a template.

[fn-sig]: https://developer.mozilla.org/en-US/docs/Glossary/Signature/Function

Glimmer’s invokables have a shared set of potential API features:

- the arguments the invokable accepts (which may be positional or named)
- the values they return
- the element associated with the invokable
- the blocks they yield

The possible signature for an invokable is an interface which captures _all_ of these details, with `Arg`, `Return`, `Blocks`, and `Element` naming the various
aspects of the API.

```typescript
interface InvokableSignature {
  Args?: {
    Positional?: Array<unknown>;
    Named?: {
      [argName: string]: unknown;
    };
  };
  Return?: unknown;
  Blocks?: {
    [blockName: string]: {
      Params?: {
        Positional?: Array<unknown>;
      };
    };
  };
  Element?: Element | null;
}
```

A few things to note about these signatures:

1. In practice, while you _can_ write a full signature like this for any invokable, you never _need_ to. Different kinds of invokables care about different subsets of this set of features:

   - Helpers may have arguments and return values, but do not yield blocks and do not have an associated element.
   - Components may have arguments, blocks, and an associated element, but never return values.
   - Modifiers may have arguments and always have an associated element, but do not return values or have blocks.

   Accordingly, we supply simpler forms of signatures appropriate to each type of invokable.

2. Any given component, modifier, or helper may only use a subset of the items it _can_ use, so many signatures will be even simpler.

3. This signature can be defined in both TypeScript types and JSDoc annotations. The examples below will show each.

## Components

We can use this to provide both editor support for the component with [Glint][glint] and documentation using any tool which understands type annotations or JSDoc.

[glint]: https://github.com/typed-ember/glint

The normal form of a Glimmer component signature is:

```typescript
interface ComponentSignature {
  Args: {
    [argName: string]: unknown;
  };
  Blocks: {
    [blockName: string]: Array<unknown>;
  };
  Element: Element;
}
```

This shorter form handles all aspects of a Glimmer component: its arguments, any blocks it yields, and the element to which it will apply `...attributes`.

For example, consider the `AudioPlayer` described in the
[Communicating Between Elements in a Component][section] of the [Template Lifecycle, DOM, and Modifiers guide][guide].

[section]: https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/#toc_communicating-between-elements-in-a-component
[guide]: https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/

There, we defined component which accepted a `srcUrl` argument and used a `play-when` modifier to manage the behavior of the element:

```typescript {data-filename="app/components/audio-player.ts"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AudioPlayer extends Component {
  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

```handlebars {data-filename="app/components/audio-player.hbs"}
<audio src={{@srcURL}} {{play-when this.isPlaying}} />

<button type='button' {{on 'click' this.play}}>Play</button>
<button type='button' {{on 'click' this.pause}}>Pause</button>
```

What elements do we need to build a signature for this component?

- It takes a single argument, the `srcUrl` for the `audio` element.
- It does not use `...attributes`, so it does not need an `Element`.
- It does not yield any blocks, so it also does not need `Blocks`.

We can define a signature with those `Args` on it and apply it to the component definition by adding it as a type parameter to the `extends Component` clause:

```typescript {data-filename="app/components/audio-player.ts" data-diff="+5,+6,+7,+8,+9,+10,+11,-12,+13"}
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

interface AudioPlayerSignature {
  Args: {
    /** The url for the audio to be played */
    srcUrl: string;
  };
}

export default class AudioPlayer extends Component {
export default class AudioPlayer extends Component<AudioPlayerSignature> {
  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

Now, let’s expand on this example to give callers the ability ability to apply attributes to the audio element with an `Element`:

```typescript {data-filename="app/components/audio-player.ts" data-diff="+10"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface AudioPlayerSignature {
  Args: {
    /** The url for the audio to be played */
    srcUrl: string;
  };
  Element: HTMLAudioElement;
}

export default class AudioPlayer extends Component<AudioPlayerSignature> {
  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

```handlebars {data-filename="app/components/audio-player.hbs" data-diff="-1,+2"}
<audio src={{@srcURL}} {{play-when this.isPlaying}} />
<audio ...attributes src={{@srcURL}} {{play-when this.isPlaying}} />

<button type='button' {{on 'click' this.play}}>Play</button>
<button type='button' {{on 'click' this.pause}}>Pause</button>
```

We can also let the user provide a fallback for the case where the audio element does not load, using the default block. We have to name the default block explicitly in the new `Blocks` type we add to our signature. Since blocks yield out a list of items, we can use a [tuple type][tuple] to represent them. In this case, we will just yield out the same URL we loaded, to let the caller use it for the fallback.

[tuple]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types

```typescript {data-filename="app/components/audio-player.ts" data-diff="+10,+11,+12"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface AudioPlayerSignature {
  Args: {
    /** The url for the audio to be played */
    srcUrl: string;
  };
  Blocks: {
    default: [srcUrl: string];
  };
  Element: HTMLAudioElement;
}

export default class AudioPlayer extends Component<AudioPlayerSignature> {
  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

```handlebars {data-filename="app/components/audio-player.hbs" data-diff="-1,+2,+3,+4"}
<audio ...attributes src={{@srcURL}} {{play-when this.isPlaying}} />
<audio ...attributes src={{@srcURL}} {{play-when this.isPlaying}}>
  {{yield @srcUrl}}
</audio>

<button type='button' {{on 'click' this.play}}>Play</button>
<button type='button' {{on 'click' this.pause}}>Pause</button>
```

Let’s go one step further and switch to supporting for two [named blocks][nb]: a `title` block for a caption for the audio element, and an `audio` block for the audio fallback where we previously used a `default` block.

```handlebars {data-filename="app/components/audio-player.hbs" data-diff="+1,+2,+3,+4,+5,-7,+8"}
<figure>
  {{#if (has-block 'title')}}
    <figcaption>{{yield to='title'}}</figcaption>
  {{/if}}

  <audio ...attributes src={{@srcUrl}} {{play-when this.isPlaying}}>
    {{yield @srcUrl}}
    {{yield @srcUrl to='audio'}}
  </audio>
</figure>

<button type='button' {{on 'click' this.play}}>Play</button>
<button type='button' {{on 'click' this.pause}}>Pause</button>
```

To represent this, we will update the `default` block to be named `audio` instead and add the `title` block. We do not yield anything to the `title` block, so we use an empty tuple, `[]`, to represent it.

[nb]: https://guides.emberjs.com/release/components/block-content/

```typescript {data-filename="app/components/audio-player.ts" data-diff="-11,+12,+13"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface AudioPlayerSignature {
  Args: {
    /** The url for the audio to be played */
    srcUrl: string;
  };
  Blocks: {
    default: [srcUrl: string];
    audio: [srcUrl: string];
    title: [];
  };
  Element: HTMLAudioElement;
}

export default class AudioPlayer extends Component<AudioPlayerSignature> {
  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

### JavaScript

When working in JavaScript, we can provide the exact same information using JSDoc comments. Here is how our final component definition would look if it were written in JavaScript rather than TypeScript, and using comments for this documentation information:

```js {data-filename="app/components/audio-player.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

/**
 * @typedef AudioPlayerSignature
 * @property {AudioPlayerArgs} Args
 * @property {AudioPlayerBlocks} Blocks
 * @property {HTMLAudioElement} Element
 */

/**
 * @typedef AudioPlayerArgs
 * @property {string} src
 */

/**
 * @typedef AudioPlayerBlocks
 * @property {[srcUrl: string]} audio
 * @property {[]} title
 */

/**
 * @extends Component<AudioPlayerSignature>
 */
export default class AudioPlayer extends Component {
  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

## Modifiers

The signature for a modifier consists of any named or positional arguments along with the kind of element it can be applied to. The arguments are optional, but the element is required.

```typescript
interface ModifierSignature {
  Args?: {
    Positional?: Array<unknown>;
    Named?: {
      [argName: string]: unknown;
    };
  };
  Element: Element;
}
```

### Function-based modifiers

Function-based modifiers do not require writing out a signature manually. Instead, you can—and should!—write the types directly on the function which defines them.

Using our `play-when` modifier example used with the `AudioPlayer` above, we might define the modifier like this:

- In TypeScript:

  ```typescript {data-filename="app/modifiers/play-when.ts"}
  import { modifier } from 'ember-modifier';

  export default modifier(function playWhen(
    element: HTMLAudioElement,
    positional: [shouldPlay: boolean]
  ): void {
    let [shouldPlay] = positional;
    if (shouldPlay) {
      element.play();
    } else {
      element.pause();
    }
  });
  ```

- With JSDoc:

  ```js {data-filename="app/modifiers/play-when.js"}
  import { modifier } from 'ember-modifier';

  export default modifier(
    /**
     * @param {HTMLAudioElement} element
     * @param {[shouldPlay: boolean]} positional
     */
    (element, positional): void => {
      let [shouldPlay] = positional;
      if (shouldPlay) {
        element.play();
      } else {
        element.pause();
      }
    }
  );
  ```

For the sake of backward compatibility and completeness, using a signature explicitly as a type parameter to `modifier()` is also supported. In that case, we could write the modifier like this:

```typescript {data-filename="app/modifiers/play-when.ts"}
import { modifier } from 'ember-modifier';

interface Signature {
  Args: {
    Positional: [shouldPlay: boolean];
  };
  Element: HTMLAudioElement;
}

export default modifier<Signature>((element, positional) => {
  let [shouldPlay] = positional;
  if (shouldPlay) {
    element.play();
  } else {
    element.pause();
  }
});
```

### Class-based modifiers

Signatures are more useful for class-based modifiers, where they are the only way to provide the type information for Glint. For example, when using `IntersectionObserver`s, you might want to improve your app’s performance by `.observe()`-ing multiple elements in the same `IntersectionObserver`, all coordinated by a service.

Given an `IntersectionObserverManager` service with an `observe` method, we might provide a signature defining `onEnter` and `onExit` callbacks and an `options` object to specify the `IntersectionObserver` options. Then we would supply the signature on the class definition with a type parameter to the super class. With all the pieces put together, we would have this:

```typescript {data-filename="app/modifiers/did-intersect.ts"}
import Modifier from 'ember-modifier';
import { service } from '@ember/service';
import type IntersectionObserverManager from '../services/intersection-observer-manager';

interface DidIntersectSignature {
  Args: {
    Named: {
      onEnter: (entry: IntersectionObserverEntry) => void;
      onExit: (entry: IntersectionObserverEntry) => void;
      options: IntersectionObserverInit;
    };
  };
  Element: Element;
}

export default class DidIntersect extends Modifier<DidIntersectSignature> {
  @service declare manager: IntersectionObserverManager;

  modify(el: Element, _: [], named: DidIntersectSignature['Args']['Named']) {
    let { onEnter, onExit, options } = named;
    this.manager.observe(el, options, { onEnter, onExit });
  }
}
```

Notice that we can just skip the positional arguments entirely in this case, and give them a name like `_` to indicate we are doing nothing with it. If we had positional arguments, we would supply them like normal.

## Helpers

The signature for a helper includes its named and/or positional arguments and its return type:

```typescript
interface HelperSignature {
  Args?: {
    Positional?: Array<unknown>;
    Named?: {
      [argName: string]: unknown;
    };
  };
  Return?: unknown;
}
```

### Function-based helpers

You never have to write a signature when working with function-based helpers—whether using a standalone function as a helper or using the legacy `helper()` definition. Instead, you can write a function definition as usual, providing types and documentation for its arguments and return types the way you would any other function. Tools like Glint and documentation generators can synthesize all the information required from those definitions, and in general work _better_ with normal function definitions than with signatures for function-based helpers.

For example, you might define a `parseInt` helper like this using a normal function:

- In TypeScript:

  ```typescript {data-filename="app/helpers/parse-int.ts"}
  /**
   * @param value - the value to parse
   * @param options - how to parse the value
   */
  function parseInt(value: string, options: { radix?: number }): number {
    let radix = options?.radix ?? 10;
    return Number.parseInt(value, radix);
  }
  ```

- With JSDoc:

  ```js {data-filename="app/helpers/parse-int.js"}
  /**
   * @param {string} value - the value to parse
   * @param {{ radix?: number }} named - how to parse the value
   * @returns {number}
   */
  export default function parseInt(value, named) {
    let radix = named?.radix ?? 10;
    return Number.parseInt(value, radix);
  }
  ```

Using `helper()`, you would define it very similarly:

- In TypeScript:

  ```typescript {data-filename="app/helpers/parse-int.ts"}
  import { helper } from '@ember/component/helper';

  export default helper(function parseInt(
    positional: [string],
    named: { radix?: number }
  ): number {
    let value = positional[0];
    let radix = named.radix ?? 10;
    return Number.parseInt(value, radix);
  });
  ```

- With JSDoc:

  ```typescript {data-filename="app/helpers/parse-int.js"}
  import { helper } from '@ember/component/helper';

  export default helper(
    /**
     * @param {string} value - the value to parse
     * @param {{ radix?: number }} named - how to parse the value
     * @returns {number}
     */
    function parseInt(positional, named): number {
      let value = positional[0];
      let radix = named.radix ?? 10;
      return Number.parseInt(value, radix);
    }
  );
  ```

For completeness and backwards-compatibility, helpers defined with `helper()` do accept signatures as a type parameter as well. The `parseInt` helper might look like this if using an explicit signature:

```typescript {data-filename="app/helpers/parse-int.ts"}
import { helper } from '@ember/component/helper';

interface ParseIntSignature {
  Args: {
    Positional: [
      /** The value to parse */
      string
    ];
    Named: {
      /** The radix to use when parsing the value */
      radix?: number;
    };
  };
  Return: number;
}

export default helper<ParseIntSignature>(function parseInt(positional, named) {
  let value = positional[0];
  let radix = named.radix ?? 10;
  return Number.parseInt(value, radix);
});
```

However, you _cannot_ provide a signature for the `helper()` definition form with JSDoc. This is an additional reason to avoid signatures with function-based helpers, and to prefer using normal function declarations and definitions.

### Class-based helpers

Signatures are more useful for class-based helpers, where they are the only way to provide the type information for Glint.

Consider here a helper for formatting strings, which uses an injected `locale` service. (This kind of service injection is one of the main reasons to use a class-based helper.) Assume that the `locale` service has a `format` method which accepts a string to format and an optional locale override.

Our helper will accept the same arguments, so we will use it like this:

```handlebars
{{format 'some-string'}}
{{format 'some-string' localeOverride='en-GB'}}
```

```typescript
import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import type LocaleService from '../services/locale';

interface FormatSignature {
  Args: {
    Positional: [string];
    Named: {
      locale?: string;
    };
  };
  Return: string;
}

export default class Format extends Helper<FormatSignature> {
  @service declare locale: LocaleService;

  compute(positional: [string], named: { locale?: string }): string {
    let [value] = positional;
    return this.locale.format(value, { override: named.locale });
  }
}
```

Here, the arguments and return type for `compute` match the types in `Args` in `FormatSignature`.

You might be wondering: Given that we already have a signature, can TypeScript infer the types for the method from the signature, like it can for the `helper()` form?

```typescript
export default class Format extends Helper<FormatSignature> {
  @service declare locale: LocaleService;

  compute(positional, named): string {
    let [value] = positional;
    return this.locale.format(value, { override: named.locale });
  }
}
```

Unfortunately, TypeScript does not infer the types for class methods like this. As a result, we have to write out the full types for the method, and have to keep these definitions in sync manually.

From a type checking perspective, these types must be _compatible_ with the types in the signature, though they do not have to be identical. Glint will type check that any types you write to make sure they are compatible. The rule for “compatibility” here is that your function signature types must be more general (“wider” in TypeScript terms) than the corresponding parts of the signature type.

For example, we could define the type of the positional arguments in the method body as `Array<unknown>` instead of `[string]`, while keeping the original signature’s `Positional: [string]`:

```typescript
  compute(positional: Array<unknown>, named: { locale?: string }): string {
    // ...
  }
```

Because the signature set on the class, callers would still have to pass a single string argument, but we would need to change the behavior of the body to [narrow the type][narrowing] for the first item in the array.

[narrowing]: http://www.typescriptlang.org/docs/handbook/2/narrowing.html

Accordingly, the best practice is to keep the types matching.

## Advanced signature techniques

We can also define signatures in more complicated ways, using TypeScript features like generics and union types, to [make illegal states unrepresentable][illegal]. For example, a list component might need to yield back out instances of the same type it provides, and provide the appropriate element target based on a `type` argument.

[illegal]: https://v5.chriskrycho.com/journal/making-illegal-states-unrepresentable-in-ts/

Here is how that might look, using a class-backed component rather than a template-only component, since the only places TypeScript allows us to name new generic types are on functions and classes:

```typescript
import Component from '@glimmer/component';

interface OrderedList<T> {
  Args: {
    items: Array<T>;
    type: 'ordered';
  };
  Blocks: {
    default: [item: T];
  };
  Element: HTMLOListElement;
}

interface UnorderedList<T> {
  Args: {
    items: Array<T>;
    type: 'unordered';
  };
  Blocks: {
    default: [item: T];
  };
  Element: HTMLUListElement;
}

type ListSignature<T> = OrderedList<T> | UnorderedList<T>;

export default class List<T> extends Component<ListSignature<T>> {
  <template>
    {{#if (isOrdered @type)}}
      <ol ...attributes>
        {{#each @items as |item|}}
          <li>{{yield item}}</li>
        {{/each}}
      </ol>
    {{else}}
      <ul ...attributes>
        {{#each @items as |item|}}
          <li>{{yield item}}</li>
        {{/each}}
      </ul>
    {{/if}}
  </template>
}

function isOrdered(type: 'ordered' | 'unordered'): type is 'ordered' {
  return type === 'ordered';
}
```

When this component is invoked, the `@type` argument will determine what kinds of modifiers are legal to apply to it. For example, if you defined a modifier `reverse` which required an `HTMLOListElement`, this invocation would be rejected:

```handlebars
<List @items={{array 1 2 3}} @type='unordered' {{reverse}} as |item|>
  The item is
  {{item}}.
</List>
```

## Classic Ember components

Many of the some considerations apply to classic Ember components. However, there are several additional considerations:

- Classic components support both named and positional arguments, so the signature for an Ember component must specify which kind of arguments something is when using both together. If you supply `Args` as an object shape the same way you would for a Glimmer component, those will be treated as

- Classic components' arguments are merged with the properties on the class, rather than being supplied separately. As a result, they require more boilerplate to incorporate: we must use [interface merging][merge] to represent that the arguments and the properties of the class are the same. This also means that there is no support for type-powered completion with JSDoc for classic Ember components, because TypeScript does not support interface merging with JSDoc.

- The `Element` for a classic Ember component should be the same as [the `tagName`][tagName] for the component—but this is not type checked by Glint.

[merge]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
[tagName]: https://api.emberjs.com/ember/5.2/classes/Component#43-property

If the `AudioPlayer` component shown above were a classic component, we would define its signature and backing class like this:

```typescript
import Component from '@ember/component';

import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface AudioPlayerArgs {
  /** The url for the audio to be played */
  srcUrl: string;
}

interface AudioPlayerSignature {
  Args: AudioPlayerArgs;
  Blocks: {
    default: [srcUrl: string];
    audio: [srcUrl: string];
    title: [];
  };
  Element: HTMLAudioElement;
}

export default interface AudioPlayer extends AudioPlayerArgs {}
export default class AudioPlayer extends Component<AudioPlayerSignature> {
  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

In general, while we do support classic Ember components for the sake of backwards compatibility and migration, we strongly recommend that you move to Glimmer components.
