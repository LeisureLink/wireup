# wireup

A bootstrap time, convention-based utility for wiring up modules into an app (nodejs).

# What

`wireup` introduces a simple, optional `wireup` step that applications can use to build a predictable startup process.

When a nodejs module is imported via node's `require` method, node goes through a process of loading the module. A synopsis of what happens when node _loads_ a module is that it reads the module from disk if the requested module doesn't match a module already loaded and cached. When the module is indeed read from disk, node places the module in a new function scope and invokes the module so that it may initialize its dependencies, perform startup logic, and export things other modules rely upon.

OK, that was a simple explanation. For most modules, nothing else is needed.

Nodejs' `require` can be thought of as a module's _self-initialization_, or better yet; _implicit-wireup_.

`wireup` provides is a means by which modules can specify an optional, _explicit-wireup_.

# How

There are four parts to using `wireup` effectively:

* [Understand it](#user-content-understand-it), then,
* [determine your strategy](#user-content-determine-your-strategy),
* [wireup enable modules](#user-content-wireup-enable-modules),
* and [use wireup in your app](#user-content-use-wireup-in-your-app).

## Understand it

`wireup` is a simple wrapper for nodejs' `require` function. For each module that you _wire up_, `wireup` looks for an exported function called "wireup" and if found, immediately calls it. Admittedly, this behavior on its own does little to improve on the _implicit-wireup_ that already happens. The improvement comes in when you choose to _inject_ arguments into the module's wireup function.

### Basics

You can inject variables (such as a config object) into the modules' `#wireup` method as the modules are imported into your app:

```javascript
// this ->                                     vvvvvv
var wireup = require('wireup').dir(__dirname, config);

// Notice we're using wireup to import the modules, not require:

var urmod = wireup('./ur-module');
var other = wireup('./other');

// gets injected here, ->                       vvvvvv
// ur-module::module.exports.wireup = function (config) { /* ... */ }

// and here ->                              vvvvvv
// other::module.exports.wireup = function (config) { /* ... */ }
```

There are more advanced uses documented later.

## Determining Your Strategy

We've mentioned that `wireup` is _convention-based_. In actuality, it is half of the convention, the second half is up to you. We definitely don't know as much about your app as you do, so feel free to make up a strategy that makes sense to your community of users.

The [basic example](#user-content-basics) illustrates a simple but effective strategy which formalizes a convention for the app; each module's `#wireup` function will expect a single argument to be passed in -- the _config_ object.

You can make up a different strategy, thus formalizing the convention that makes sense to you.

## Wireup Enable Modules

To wireup enable your module, simply export a **wireup** function:

```javascript
var util = require('util');

var _localConfig = {
  foo: 'setting one',
  bar: 'setting two'
};

// other module details elided...

module.exports.wireup = function (config) {
  // when/if wireup is called, overlay our default config...
  _localConfig = util._extend(_localConfig, config);
};
```

## Use `wireup` in Your App

The [basic example](#basics) has already shown how to use `wireup` in your app. There is however a caveat; in order to enable some advanced usage, we differentiate between the app's _root_ module and the other modules.

### In your app's root module:

Your app's root module, call wireup's `#dir` method to specify your app's root directory \[[more info](#how-modules-are-resolved)\].

```javascript
//...

var wireup = require('wireup').dir(__dirname);

var lib = wireup('./lib');

//...
```

### In your app's other modules:

Other modules _should not_ import `wireup`. If they need to be participate in the wireup process, they should export a function with the name `wireup` [as illustrated above](#user-content-wireup-enable-modules).

### Guidelines & Advice for Easy Wireup

Since `wireup` is able to inject arguments into a wired module's exported `#wireup` method, the process is simpler if you use a consistent signature for your module's exported `#wireup` methods.

If you use an IoC, your IoC container makes a great candidate to pass along the wireup chain. Another great candidate is a top-level config object, like an [`nconf`](https://github.com/flatiron/nconf) instance.

If at all possible, bind the wireup arguments in your application's entrypoint module. Since advanced binding appends wireup arguments but never removes previously bound arguments, we recommend using advanced binding only where absolutely necessary since it can make troubleshooting difficult when you've been away from your app for a while.

### Advanced Binding

More on this later; study the examples to see how to bind additional wireup arguments at module scope and at each call-site.

## [License (MIT)](https://github.com/LeisureLink/wireup/raw/master/LICENSE)
