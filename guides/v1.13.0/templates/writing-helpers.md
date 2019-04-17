Helpers allow you to add additional functionality to your
templates beyond what is included out-of-the-box in Ember. Helpers are
most useful for transforming raw values from models and components into
a format more appropriate for your users.

For example, imagine we have an `Invoice` model that contains a
`totalDue` attribute, which represents the total amount due for that
invoice.  Because we do not want our company to go out of business due
to strange JavaScript rounding errors, [we store this value in cents
instead of a floating point dollar value][currency-stackoverflow].

[currency-stackoverflow]: http://stackoverflow.com/a/3730040

However, if we display dollar values to our users as "100¢" instead of
"$1.00", they may be very confused. We can write a helper to
format these values into the appropriate human-readable form.

Let's create a `format-currency` helper that takes an integer count of
cents and turns it into formatted dollars.

To use the `format-currency` helper, you call it using curly braces in
your template:

```handlebars
Your total is {{format-currency model.totalDue}}.
```

Let's now implement the helper. Helpers are just functions that take
one or more inputs and return a single output that should be put into
the HTML.

To add a new helper, create a file with the name of the helper you want
(e.g. `format-currency.js`) in your application's `helpers` directory.
You can also have Ember generate the file for you from the command line:

```bash
ember generate helper format-currency
```

That file should export a function wrapped with `Ember.Helper.helper()`:

```javascript {data-filename=app/helpers/format-currency.js}
import Ember from 'ember';

export default Ember.Helper.helper(function(params) {
  let value = params[0],
      dollars = Math.floor(value / 100),
      cents = value % 100,
      sign = '$';

  if (cents.toString().length === 1) { cents = '0' + cents; }
  return `${sign}${dollars}.${cents}`;
});
```

In this example, the function receives a dollar amount in cents as the first
parameter (`params[0]`). We then use regular JavaScript to turn the
count of cents into a formatted string, like `"$5.00"`.

Whenever you use your helper in a template, Ember will call this
function and insert whatever you return from the helper into the DOM.

So, for example, if we had a template like this where we pass a value in
cents:

```handlebars
Your total is {{format-currency 250}}.
```

Ember would replace the content inside the `{{ }}` with the formatted
amount:

```handlebars
Your total is $2.50.
```

Whenever the arguments you've passed to a helper change, whether they
come from a model or a component, Ember will automatically call your
helper again with the new values and keep the DOM up-to-date.

### Helper Names

Unlike components, helpers do not require a dash (`-`) character in
their name.

### Helper Arguments

You can pass one or more arguments to  which can be used
inside the function. In the above example, we passed the amount in cents
as the first and only argument.

To pass multiple arguments to a helper, add them as a space-separated
list after the helper name:

```handlebars
{{my-helper "hello" "world"}}
```

An array of these arguments is passed to the helper function:

```javascript {data-filename=app/helpers/my-helper.js}
import Ember from 'ember';

export default Ember.Helper.helper(function(params) {
  let arg1 = params[0];
  let arg2 = params[1];

  console.log(arg1); // => "hello"
  console.log(arg2); // => "world"
});
```

You can use JavaScript's destructuring assignment shorthand to clean up
the code. This example is equivalent to the above example (note the function signature):

```javascript {data-filename=app/helpers/my-helper.js}
import Ember from 'ember';

export default Ember.Helper.helper(function([arg1, arg2]) {
  console.log(arg1); // => "hello"
  console.log(arg2); // => "world"
});
```

### Named Arguments

Normal arguments are useful for passing data to be transformed into
helper functions. However, because the order in which you pass arguments
matters, it is usually best not to have helpers take more than one or
two of them.

That said, sometimes you may want to make behavior of helpers
configurable by the developers that call them from their templates. For
example, let's abandon our American-centric ways and update our
`format-currency` helper to take an optional configuration for which
currency symbol to display.

Helpers allow you to pass named arguments as a JavaScript
object that contains the name of the argument along with an associated
value.  The order in which named arguments are supplied does not affect
functionality.

In this example, we can pass a `sign` argument to our `format-currency`
helper:

```handlebars
{{format-currency 350 sign="£"}}
```

We'd like our helper to print pounds sterling rather than US dollars:

```handlebars
£3.50
```

The object containing named arguments is passed as the second argument
to the helper function.  Here is our example from above, updated to
support the optional `sign` option:

```javascript {data-filename=app/helpers/format-currency.js}
import Ember from 'ember';

export default Ember.Helper.helper(function(params, namedArgs) {
  let value = params[0],
      dollars = Math.floor(value / 100),
      cents = value % 100,
      sign = namedArgs.sign === undefined ? '$' : namedArgs.sign;

  if (cents.toString().length === 1) { cents = '0' + cents; }
  return `${sign}${dollars}.${cents}`;
});
```

You can pass as many named arguments as you'd like. They get added to the
`namedArgs` argument passed to the function:

```handlebars
{{my-helper option1="hello" option2="world" option3="goodbye cruel
world"}}
```

```javascript {data-filename=app/helpers/my-helper.js}
import Ember from 'ember';
export default Ember.Helper.helper(function(params, namedArgs) {
  console.log(namedArgs.option1); // => "hello"
  console.log(namedArgs.option2); // => "world"
  console.log(namedArgs.option3); // => "goodbye cruel world"
});
```

You can use JavaScript's destructuring assignment shorthand in this case
as well to clean up the above code:

```javascript {data-filename=app/helpers/my-helper.js}
import Ember from 'ember';
export default Ember.Helper.helper(function(params, { option1, option2, option3 }) {
  console.log(option1); // => "hello"
  console.log(option2); // => "world"
  console.log(option3); // => "goodbye cruel world"
});
```

In sum, arguments are good for passing values:

```handlebars
{{format-date currentDate}}
```

Hashes are useful for configuring the behavior of a helper:

```handlebars
{{print-current-date format="YYYY MM DD"}}
```

You can have as many of both as you want, so long as the parameters come
first:

```handlebars
{{format-date-and-time date time format="YYYY MM DD h:mm" locale="en"}}
```

The above example contains two arguments:

* `date`
* `time`

And two named arguments:

* `format="YYY MM DD h:mm"`
* `locale="en"`

### Stateful Helpers

By default, helpers are _stateless_. They are passed inputs (parameters
and a hash), they perform an operation on those inputs, and return a
single output. They have no side-effects and don't save any information
that is used on subsequent runs of the function.

In some situations, however, you may need to write a helper that
interacts with the rest of your application. You can create stateful
helpers that have access to services in your application, and can
optionally save state as well.

To create a stateful helper, rather than returning a simple function,
you should return a subclass of `Ember.Helper`. Helper classes must
contain a `compute` method that behaves the same as the function passed
to `Ember.Helper.helper`.

In fact, we can refactor the above stateless helper into a stateful
helper just by making the function into a `compute` method on the class:

```javascript {data-filename=app/helpers/format-currency.js}
import Ember from 'ember';

export default Ember.Helper.extend({
  compute(params, hash) {
    let value = params[0],
        dollars = Math.floor(value / 100),
        cents = value % 100,
        sign = hash.sign === undefined ? '$' : hash.sign;

    if (cents.toString().length === 1) { cents = '0' + cents; }
    return `${sign}${dollars}.${cents}`;
  }
});
```

This is exactly equivalent to the example above. You can think of the
function version as a shorthand for the longer class form if it does not
require any state.

### Adding Services

Stateful helpers can access the services in your application. In order to
access a service, you must first inject it into the stateful helper.
Once added, you can call the service's methods or access its properties
from within the `compute()` method.

```javascript {data-filename=app/helpers/is-authenticated.js}
import Ember from 'ember';

export default Ember.Helper.extend({
  authentication: Ember.inject.service()
  compute() {
    let authentication = this.get('authentication');

    if (authentication.get('isAuthenticated')) {
      return "Welcome back, " + authentication.get('username');
    } else {
      return "Not logged in";
    }
  }
});
```

### Escaping HTML Content

To protect your application from cross-site scripting attacks (XSS),
Ember automatically escapes any value you return from a helper so that
the browser will not interpret it as HTML.

For example, here's a `make-bold` helper that returns a string containing HTML:

```javascript {data-filename=app/helpers/make-bold.js}
import Ember from 'ember';
export default Ember.Helper.helper(function(params) {
  return `<b>${params[0]}</b>`;
});
```

You can invoke it like this:

```handlebars
{{make-bold "Hello world"}}
```

Ember will escape the HTML tags, like this:

```handlebars
&lt;b&gt;Hello world&lt;/b&gt;
```

This shows the literal string `<b>Hello world</b>` to the user, rather
than the text in bold as you probably intended. We can tell Ember not to
escape the return value (that is, that it is _safe_) by using the
`htmlSafe` string utility:

```javascript {data-filename=app/helpers/make-bold.js}
import Ember from 'ember';
export default Ember.Helper.helper(function(params) {
  return Ember.String.htmlSafe(`<b>${params[0]}</b>`);
});
```

If you return a `SafeString` (a string that has been wrapped in a call
to `htmlSafe`), Ember knows that you have vouched on its behalf that it
contains no malicious HTML.

However, note that in the above code we may have just inadvertently
introduced an XSS vulnerability into our application! By blindly marking
the string as safe, a malicious user could get their own HTML into our
app, allowing them to do things like access sensitive customer data.

For example, imagine that we have a chat app  and use our `make-bold`
helper to welcome the new users into the channel:

```handlebars
Welcome back! {{make-bold model.firstName}} has joined the channel.
```

Now a malicious user simply needs to set their `firstName` to a string
containing HTML (like a `<script>` tag that sends private customer data
to their server, for example) and every user in that chat room has been
compromised.

In general, you should prefer using components if you are wrapping
content in HTML. However, if you really want to include a mix of HTML
and values from models in what you return from the helper, make sure you
escape anything that may have come from an untrusted user with the
`escapeExpression` utility:

```javascript {data-filename=app/helpers/make-bold.js}
import Ember from 'ember';
export default Ember.Helper.helper(function(params) {
  let value = Handlebars.Utils.escapeExpression(params[0]);
  return Ember.String.htmlSafe(`<b>${value}</b>`);
});
```

Now the value passed into the helper has its HTML escaped, but the trusted
`<b>` tags that we want to wrap the value in are _not_ escaped. A
malicious user setting their `firstName` to something containing HTML
would just see this:

```handlebars
Welcome back! <b>&lt;script
type="javascript"&gt;alert('pwned!');&lt;/script&gt;</b> has joined the channel.
```
