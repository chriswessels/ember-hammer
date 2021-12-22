ember-hammer
==============================================================================

ember-hammer is a neat interface for defining [Hammer.js](https://hammerjs.github.io/) gestural behaviour in your [Ember.js](http://www.emberjs.com) app. It is easy to use and lightweight.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.20 or above
* Ember CLI v3.20 or above
* Node.js v12 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-hammer
```


Usage
------------------------------------------------------------------------------

```hbs
<div class="box" {{on-gesture "swipe" this.onSwipe}}></div>

<style>
  .box {
    width: 100px;
    height: 100px;
    background: red;
  }
</style>
```


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
