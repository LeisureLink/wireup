# wireup

A bootstrap time, convention-based utility for wiring up modules into an app (nodejs).

# What

`wireup` introduces a simple, optional `wireup` step that applications can use to build a predictable startup process.

When a nodejs module is imported via node's `require` method, node goes through a process of loading the module. A synopsis of what happens when node _loads_ a module is that it reads the module from disk if the requested module doesn't match a module already loaded and cached. When the module is indeed read from disk, node places the module in a new function scope and invokes the module so that it may initialize its dependencies, perform startup logic, and export things other modules rely upon.

OK, that was a simple explanation. For most modules, nothing else is needed.

What nodejs does during a ```require``` can be thought of as a module's _self-initialization_, or better yet; _implicit-wireup_. What `wireup` provides is a means by which modules can specify an optional, _explicit-wireup_.

# How

There are three parts to using `wireup` effectively:

* Understand it, then,
* determine your strategy,
* wireup enable modules,
* and use wireup in your app.

## Understand it

`wireup` is a simple wrapper for nodejs' `require` function. For each module that you _wire up_, `wireup` looks for an exported function called "wireup" and if found, immediately calls it. Admittedly, this behavior on its own does little to improve on the _implicit-wireup_ that already happens when you `require` a module. The improvement comes in when you choose to _project_ arguments into the module's wireup function.

### Basics

You can project variables (such as a config object) into the modules' `#wireup` methods as they are imported into your app:

```javascript
// this ->                                     vvvvvv
var wireup = require('wireup').root(__dirname, config);

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

The [basic example](#basics) illustrates a simple but effective strategy which formalizes a convention for the app; each module's `#wireup` function will expect a single argument to be passed in -- the _config_ object.

You can make up a different strategy, thus formalizing the convention that makes sense for your app.

## Wireup Enable Modules

To wireup enable your module, simply export a **wireup** function:

```javascript
var util = require('util');

var _localConfig = {
  foo: 'setting one',
  bar: 'setting two'
};

// other module details elided...

module.exports.wireup = function wireup(config) {
  // when/if wireup is called, overlay our default config...
  _localConfig = util._extend(_localConfig, config);
};
```

## Use `wireup` in Your App

The [basic example](#basics) has already shown how to use `wireup` in your app. There is however a caveat; in order to enable some advanced usage, we differentiate between the app's _root_ module and the other modules.

### In your app's root module:

Your app's root module must call wireup's `#root` method to specify your app's root directory \[[more info](#how-modules-are-resolved)\].

```javascript
//...

var wireup = require('wireup').root(__dirname);

var lib = wireup('./lib');

//...
```

### In your app's other modules:

If other modules in your app import `wireup`, they should call wireup's `#dir' method to specify their directory \[[more info](#how-modules-are-resolved)\].

```javascript
//...

var wireup = require('wireup').dir(__dirname);

var subordinate = wireup('./subordinate');

//...
```
