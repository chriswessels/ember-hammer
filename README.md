ember-hammer
============
ember-hammer is a neat interface for defining [Hammer.js](https://github.com/EightMedia/hammer.js) gestural behaviour in your [Ember.js](http://www.emberjs.com) Views.

##Usage

First, include the `ember-hammer.js` file into your asset delivery pipeline (ideally this should include minification, concatenation and gzipping).

Next, define a `gestures` object in any view that you'd like to enable gestural behaviour for. Inside this object, define any Hammer.js gestural event as a key, with the callback function as the value.

Optionally, you can define an `options` object inside the `gestures` object to specify any Hammer.js options that you wish to adjust from their defaults.

The callback function is passed a single `event` argument, provided by Hammer.js. The `this` context of the callback will be set to the view object, so you can do anything you need to.

Gestural events bubble up the DOM tree, so if you'd like to catch an event and cancel bubbling, just return `false` from your callback.

##Example

    App.SomeView = Ember.View.extend({
      gestures: {
        options: {
          swipe_velocity: 0.5
        },

        swipeLeft: function (event) {
          // do something like send an event down the controller/route chain
          return false; // return `false` to stop bubbling
        }
      }
    });

##License

Please see the `LICENSE` file for more information.
