Ember gives you **the power to write tests and be productive from day one**. You can be confident that your app will be correct today and years from now. A question remains: _How_ should you write tests?

Since tests are a core part of the Ember framework and your development cycle, we will dedicate several sections to learning how to write tests.

In this section, we will cover why testing is important and how to run, debug and filter your tests.

## Why Do I Need Tests?

Writing tests is a necessary ingredient if you want to guarantee users and stakeholders that your app, whether small or large, will function as intended at any given time. The larger your app, the more costly and error-prone manual testing becomes.

Writing tests is also a fun activity, a nice change of pace from delivering features daily, and a way to help you refactor code and improve as a developer. Tests can also serve as a living documentation — a key element in onboarding new developers.

## How to Run Tests

You have a few options for running tests.

First, you can run the test suite by entering the command `npm test` in your terminal. This will run the suite just once using the test command that is specified in your `package.json` `scripts.test` entry.

Running a local development server (through `npm start`), you can visit the `/tests` URI. This will render the `tests/index.html` template. This will also auto-update as you are changing files in your app.

```bash
# Run all tests once
npm test
```

### How to Filter Tests

When you start your development server and navigate to `/tests` you will be presented with the QUnit interface. At the top of that page you will see a `Filter` input that you can use to run a smaller subset of your tests.

You can also click the `Rerun` link beside any of the tests listed in QUnit interface to just rerun that one test. This is especially useful if you are working on a single component and want to run the corresponding unit or integration tests while you develop that component.

## How to Debug Tests

When you are writing tests or application code, the execution of your tests may fail.

To find out the problem, you can add [`debugger`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/debugger) to your code to check the intermediate state. You can add this line to both test and application code.

Thanks to Ember's setup, you can also use [`pauseTest()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#pausetest) and [`resumeTest()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#resumetest) to debug your tests. `pauseTest` allows you to inspect the DOM easily, but can only be used in the test code.

Simply add `await pauseTest();` to your test code, then save. When the test reaches this line, it will pause, allowing you to inspect the state of your application. When you are done, type `resumeTest()` in the browser console to continue the test.

## Summary

Ember considers testing a first-class citizen. In addition, it provides various inbuilt functionalities to run, filter and debug tests.

In the next section, we will see what tools can help you with testing and how to get started with them.
