You don't need to define a class all at once. You can reopen a class and
define new properties using the
[`reopen()`](https://api.emberjs.com/ember/3.2/functions/@ember%2Fobject/reopen)
method.

```javascript
Person.reopen({
  isPerson: true
});

Person.create().get('isPerson'); // true
```

When using `reopen()`, you can also override existing methods and
call `this._super`.


```javascript
Person.reopen({
  // override `say` to add an ! at the end
  say(thing) {
    this._super(thing + '!');
  }
});
```

`reopen()` is used to add instance methods and properties that are shared
across all instances of a class. It does not add
methods and properties to a particular instance of a class as in vanilla JavaScript (without using prototype).

But when you need to add static methods or static properties to the class itself
you can use [`reopenClass()`](https://api.emberjs.com/ember/3.2/functions/@ember%2Fobject/reopenClass).

```javascript
// add static property to class
Person.reopenClass({
  isPerson: false
});
// override property of existing and future Person instances
Person.reopen({
  isPerson: true
});

Person.isPerson; // false - because it is static property created by `reopenClass`
Person.create().get('isPerson'); // true
```

<!-- eof - needed for pages that end in a code block  -->
