ember-hammer
============
ember-hammer is a neat interface for defining [Hammer.js](https://github.com/EightMedia/hammer.js) gestural behaviour in your [Ember.js](http://www.emberjs.com) Views. It is easy to use and lightweight.

Note: Hammer.js 2.x support is currently experimental.

##Example

    /* ES6 Modules Example */
    import Ember from 'ember';

    export default Ember.View.extend({
      hammerOptions: {
        swipe_velocity: 0.5
      },
      gestures: {
        swipeLeft: function (event) {
          // do something like send an event down the controller/route chain
          return false; // return `false` to stop bubbling
        }
      }
    });

    /* Globals Example */
    App.SomeView = Ember.View.extend({
      hammerOptions: {
        swipe_velocity: 0.5
      },
      gestures: {
        swipeLeft: function (event) {
          // do something like send an event down the controller/route chain
          return false; // return `false` to stop bubbling
        }
      }
    });

##Usage

###With ember-cli

In your ember-cli project directory, run the following:

    $ bower install --save hammerjs#1.1.3
    $ bower install --save ember-hammer

In your Brocfile.js, before `module.exports = app.toTree();`, add the following lines:

    app.import('vendor/hammerjs/hammer.js');
    app.import('vendor/ember-hammer/ember-hammer.js');

That should be it. You'll now be able to define a `gestures` object in your views.

###With globals

First, include the `ember-hammer.js` file into your asset delivery pipeline (ideally this should include minification, concatenation and gzipping). ember-hammer should be included prior to the code that initializes your Ember application (but before Ember.js itself), but after the inclusion of Hammer.js.

###Once included

Next, define a `gestures` object in any view that you'd like to enable gestural behaviour for. Inside this object, define any Hammer.js gestural event as a key, with the callback function as the value.

See example above.

###Passing options to Hammer.js

Optionally, you can define an `hammerOptions` object inside your view to specify any view-specific options that should be passed into Hammer.js.

If you'd like to set options for all instances of Hammer.js (applicable to all views), you can use `emberHammerOptions.hammerOptions`. More information below.

###Callbacks

The callback function is passed a single `event` argument, provided by Hammer.js. The `this` context of the callback will be set to the view object, so you can do anything you need to.

###Event bubbling

Gestural events bubble up the DOM tree, so if you'd like to catch an event and cancel bubbling, just return `false` from your callback.

###Ember.EventDispatcher

Assuming you'll be using ember-hammer (and therefore Hammer.js) to manage touch-based gestural behaviour in your application, there is no point in having Ember's EventDispatcher listen to touch events. By default, ember-hammer will prevent EventDispatcher from listening to the following touch events:

1. `touchstart`
1. `touchmove`
1. `touchstop`
1. `touchcancel`

This brings a significant performance benefit.

You can modify this behaviour by setting `emberHammerOptions.ignoreEvents` to an array of event names EventDispatcher shouldn't bind to.

** If you are using ember-hammer with ember-fastclick, you will need to disable this behaviour by setting `emberHammerOptions.ignoreEvents` to an empty array. ** E.g. `window.emberHammerOptions = { ignoreEvents: [] };`

###Setting emberHammerOptions (settings / global options)

You can set the global options for ember-hammer by defining an object called `emberHammerOptions` on the window object. It is important that the object is defined **before** `ember-hammer.js` is loaded. A suitable place might be in an inline script tag in the head section of your document.

Example:

    window.emberHammerOptions = { 
        ignoreEvents: ['touchmove', 'touchstart', 'touchend', 'touchcancel'],
        hammerOptions: {
            swipe_velocity: 0.5
        }
    };

`emberHammerOptions.hammerOptions` will be passed into every instance of Hammer.js. You can override these options and set additional ones for a specific `Ember.View` by setting the `hammerOptions` key inside the view object.

##License

Please see the `LICENSE` file for more information.
