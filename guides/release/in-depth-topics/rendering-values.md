In Ember, rendering occurs via syntax, rather than by value -- so _anything_ can be a modifier, helper, or component.

## Modifiers

For Modifiers, there is a specific syntax that only modifiers may reside in

```gjs
<template>
  <div {{someModifier}}>
</template>
```
or via property on some object

```gjs
<template>
  <div {{this.property.someModifier}}>
</template>
```
or via an argument passed to a component

```gjs
<template>
  <div {{@someModifier}}>
</template>
```

Modifiers can be curried with the `modifier` helper keyword:

```gjs
<template>
  {{! In a component called "Example" }}
  {{yield (modifier someModifier "arguments" "here")}}
</template>
```

```gjs
<template>
  {{! Usage: }}
  <Example as |theModifier|>
    <div {{theModifier}}>
  </Example>
</template>
```


## Helpers

For Helpers, there is a specific syntax that only helpers may reside in
```gjs
<template>
  {{ (theHelper) }}
</template>
```
or nested in a sub-expression
```gjs
import { hash } from '@ember/helper';

<template>
  {{yield (hash key=(theHelper) key2=(theHelper with args)) }}
</template>
```
or via property on some object
```gjs
<template>
  {{ (this.property.theHelper) }}
</template>
```
or via an argument passed to a component
```gjs
<template>
  {{ (@theHelper) }}
</template>
```

Helpers can be curried with the `helper` helper keyword:
```gjs
<template>
  {{! In a component called "Example" }}
  {{yield (helper someHelper "arguments" "here")}}
</template>
```

```gjs
<template>
  {{! Usage: }}
  <Example as |theHelper|>
    {{ (theHelper) }}
  </Example>
</template>
```

## Components

For Components, there is a specific syntax that only components may reside in
```gjs
<template>
  <AComponent />
</template>
```
or via a property on some object
```gjs
<template>
  <this.someComponent />
</template>
```
or via an argument passed to a component
```gjs
<template>
  <@someComponent />
</template>
```

Components can be curried with the `component` helper keyword:
```gjs
<template>
  {{!
  In a component called "Example".
  Note that components may only receive named arguments
  }}
  {{yield (component someComponent foo="arguments" bar="here")}}
</template>
```

```gjs
<template>
  {{! Usage: }}
  <Example as |theComponent|>
    <theComponent />
  </Example>
</template>
```
<!-- eof - needed for pages that end in a code block  -->
