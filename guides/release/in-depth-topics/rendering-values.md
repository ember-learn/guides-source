In Ember, rendering occurs via syntax, rather than by value -- so _anything_ can be a modifier, helper, or component.

## Modifiers

For Modifiers, there is a specific syntax that only modifiers may reside in

```handlebars
<div {{someModifier}}>
```
or via property on some object

```handlebars
<div {{this.property.someModifier}}>
```
or via an argument passed to a component

```handlebars
<div {{@someModifier}}>
```

Modifiers can be curried with the `modifier` helper:

```handlebars
{{! In a component called "Example" }}
{{yield (modifier someModifier "arguments" "here")}}

{{! Usage: }}
<Example as |theModifier|>
  <div {{theModifier}}>
</Example>
```


## Helpers

For Helpers, there is a specific syntax that only helpers may reside in
```handlebars
{{ (theHelper) }}
```
or nested in a sub-expression
```handlebars
{{yield (hash key=(theHelper) key2=(theHelper with args)) }}
```
or via property on some object
```handlebars
{{ (this.property.theHelper) }}
```
or via an argument passed to a component
```handlebars
{{ (@theHelper) }}
```

Helpers can be curried with the `helper` helper:
```handlebars
{{! In a component called "Example" }}
{{yield (helper someHelper "arguments" "here")}}

{{! Usage: }}
<Example as |theHelper|>
  {{ (theHelper) }}
</Example>
```

## Components

For Components, there is a specific syntax that only components may reside in
```handlebars
<AComponent />
```
or via a property on some object
```handlebars
<this.someComponent />
```
or via an argument passed to a component
```handlebars
<@someComponent />
```

Components can be curried with the `component` helper:
```handlebars
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
