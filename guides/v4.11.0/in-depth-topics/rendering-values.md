In Ember, rendering occurs via syntax, rather than by value -- so _anything_ can be a modifier, helper, or component.

## Modifiers

For Modifiers, there is a specific syntax that only modifiers may reside in
```hbs
<div {{someModifier}}>
```
or via property on some object
```hbs
<div {{this.property.someModifier}}>
```
or via an argument passed to a component
```hbs
<div {{@someModifier}}>
```

Modifiers can be curried with the `modifier` helper:
```hbs
{{! In a component called "Example" }}
{{yield (modifier someModifier "arguments" "here")}}

{{! Usage: }}
<Example as |theModifier|>
  <div {{theModifier}}>
</Example>
```


## Helpers

For Helpers, there is a specific syntax that only helpers may reside in
```hbs
{{ (theHelper) }}
```
or nested in a sub-expression
```hbs
{{yield (hash key=(theHelper) key2=(theHelper with args)) }}
```
or via property on some object
```hbs
{{ (this.property.theHelper) }}
```
or via an argument passed to a component
```hbs
{{ (@theHelper) }}
```

Helpers can be curried with the `helper` helper:
```hbs
{{! In a component called "Example" }}
{{yield (helper someHelper "arguments" "here")}}

{{! Usage: }}
<Example as |theHelper|>
  {{ (theHelper) }}
</Example>
```

## Components

For Components, there is a specific syntax that only components may reside in
```hbs
<AComponent />
```
or via a property on some object
```hbs
<this.someComponent />
```
or via an argument passed to a component
```hbs
<@someComponent />
```

Components can be curried with the `component` helper:
```hbs
{{!
  In a component called "Example".
  Note that components may only receive named arguments
}}
{{yield (component someComponent foo="arguments" bar="here")}}

{{! Usage: }}
<Example as |theComponent|>
  <theComponent />
</Example>
```
