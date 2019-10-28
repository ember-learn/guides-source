You can create helper functions that you can call from your template.

A helper function takes positional arguments as an array.

```handlebars {data-filename="app/templates/application.js"}
<p>Cost: {{format-currency 250}}</p>
```

```js {data-filename="app/helpers/format-currency.js"}
import { helper } from "@ember/component/helper";

export function formatCurrency(positional) {
  let amount = positional[0];
  let sign = "$";

  let number = new Intl.NumberFormat(undefined, {
    style: "decimal",
    minimumFractionDigits: 2
  }).format(amount);

  return `${sign}${number}`;
}

export default helper(formatCents);
```

Producing this output.

```html {data-filename="output"}
<p>Cost: $250.00</p>
```

### Named Arguments

```handlebars {data-filename="app/templates/application.js"}
<p>Cost: {{format-currency 250 sign="£"}}</p>
```

```js {data-filename="app/helpers/format-currency.js", data-diff="-3,+4,-6,+7,-10"}
import { helper } from "@ember/component/helper";

export function formatCurrency(positional) {
export function formatCurrency(positional, named) {
  let amount = positional[0];
  let sign = "$";
  let sign = named.sign;

  let number = new Intl.NumberFormat(undefined, {
    style: "decimal",
    minimumFractionDigits: 2
  }).format(amount);

  return `${sign}${number}`;
}

export default helper(formatCurrency);
```

Producing this output.

```html {data-filename="output" data-diff="-1,+2"}
<p>Cost: $250.00</p>
<p>Cost: £250.00</p>
```

## Using JavaScript destructuring in signatures

Here's a cool trick: you can shorten the code for extracting the positional and named arguments by using [JavaScript destructuring syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

```js {data-filename="app/helpers/format-currency.js", data-diff="-3,+4,-5,-6"}
import { helper } from "@ember/component/helper";

export function formatCurrency(positional, named) {
export function formatCurrency([ amount ], { signed }) {
  let amount = positional[0];
  let sign = named.sign;

  let number = new Intl.NumberFormat(undefined, {
    style: "decimal",
    minimumFractionDigits: 2
  }).format(amount);

  return `${sign}${number}`;
}

export default helper(formatCurrency);
```

## Using Services in helpers

If you want to use an application service in your helper, you'll need to structure it slightly differently.

First, convert the `formatCents` function into a class with a `compute` method.

```js {data-filename="app/helpers/format-currency.js", data-diff="-1,+2,-4,+5,+6,-16"}
import { helper } from "@ember/component/helper";
import Helper from '@ember/component/helper';

export function formatCurrency(positional, named) {
export default class FormatCurrency extends Helper {
  compute(positional, named) {
    let amount = positional[0];
    let sign = named.sign;

    let number = new Intl.NumberFormat(undefined, {
      style: "decimal",
      minimumFractionDigits: 2
    }).format(amount);

    return `${sign}${number}`;
  }
}
```

Next, let's update the code to use the `NumberFormatter`'s `currency` style. We'll use a hypothetical `i18n` service which provides the user's current locale as a property.

```js {data-filename="app/helpers/format-currency.js", data-diff="+4,-10,+11,-12,-13,+14,+15,-17,-18"}
import Helper from "@ember/component/helper";

export default class FormatCurrency extends Helper {
  @service i18n;

  compute(positional, named) {
    let amount = positional[0];
    let code = named.code;

    let number = new Intl.NumberFormat(undefined, {
    return new Intl.NumberFormat(this.i18n.locale, {
      style: "decimal",
      minimumFractionDigits: 2
      style: "currency",
      currency: code
    }).format(amount);

    return `${sign}${number}`;
  }
}
```

```handlebars {data-filename="app/templates/application.js"}
<p>Cost: {{format-currency 250 code="USD"}}</p>
```

```html {data-filename="output"}
<p>Cost: $250.00</p>
```
