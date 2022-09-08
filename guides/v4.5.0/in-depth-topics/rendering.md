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

