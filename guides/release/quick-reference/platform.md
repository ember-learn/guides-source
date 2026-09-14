In [RFC #1070](https://github.com/emberjs/rfcs/pull/1070), we defined a set of criteria to allow many of the platform native utilities to be used directly within the `<template>...</template>` region of components.

<details><summary>That criteria may be viewed here</summary>

  Criteria for inclusion in this list:
 
  Any of:
    - begins with an uppercase letter
    - guaranteed to never be added to glimmer as a keyword (e.g.: globalThis)

  And:
    - must not need new to invoke
    - must not require lifetime management (e.g.: setTimeout)
    - must not be a single-word lower-case API, because of potential collision with future new HTML elements
    - if the API is a function, the return value should not be a promise
    - must be one one of these lists:
       - https://tc39.es/ecma262/#sec-global-object
       - https://tc39.es/ecma262/#sec-function-properties-of-the-global-object
       - https://html.spec.whatwg.org/multipage/nav-history-apis.html#window
       - https://html.spec.whatwg.org/multipage/indices.html#all-interfaces
       - https://html.spec.whatwg.org/multipage/webappapis.html

</details>

## TC39

### `globalThis`
### `Atomics`
### `JSON`
### `Math`
### `Reflect`

### `isNaN`
### `isFinite`
### `parseInt`
### `parseFloat`
### `decodeURI`
### `decodeURIComponent`
### `encodeURI`
### `encodeURIComponent`

### `Array`
### `BigInt`
### `Boolean`
### `Date`
### `Number`
### `Object`
### `String`

### `Infinity`
### `NaN`

## WHATWG

### `localStorage`
### `sessionStorage`
### `URL`

### `postMessage`
### `structuredClone`

### `isSecureContext`
