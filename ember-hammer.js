/**
* ember-hammer
* @module ember-hammer
* @author Chris Wessels (https://github.com/chriswessels)
* @url https://github.com/chriswessels/ember-hammer
* @license MIT
*/
(function (window, Ember, Hammer, globalOptions, undefined) {
  var defaultOptions = {
    hammerOptions: null,
    ignoreEvents: ['touchmove', 'touchstart', 'touchend', 'touchcancel']
  };
  globalOptions = Ember.$.extend({}, defaultOptions, globalOptions || {});
  Ember.EventDispatcher.reopen({
    setup: function () {
      var events = this.get('events'),
          ignoreEvents = Ember.get(globalOptions, 'ignoreEvents');

      Ember.$.each(ignoreEvents, function (index, value) {
        events[value] = null;
        delete events[value];
      });
      this.set('events', events);

      return this._super(Array.prototype.slice.call(arguments));
    }
  });
  Ember.View.reopen({
    /**
    * This property is the public interface for defining gestural behaviour for a given view.
    * @example
    *     App.SomeView = Ember.View.extend({
    *       gestures: {
    *         swipeLeft: function (event) {
    *           // do something like send an event down the controller/route chain
    *           return false; // return `false` to stop bubbling
    *         }
    *       }
    *     });
    * @property gestures
    */
    gestures: null,
    /**
    * This property allows you to pass view-specific options to Hammer.js.
    * @example
    *     App.SomeView = Ember.View.extend({
    *       hammerOptions: {
    *         swipe_velocity: 0.5
    *       }
    *     });
    * @property hammerOptions
    */
    hammerOptions: null,
    /**
    * @property _hammerInstance
    * @type Hammer.Instance
    * @private
    * @default null
    */
    _hammerInstance: null,
    /**
    * This function will ensure that `_hammerInstance` is populated with an instance of Hammer for `this.get('element')`.
    * The instance is cached and is only set if `this.gestures` is truthy. This means an instance of Hammer will only
    * be created if gesture callbacks have been specified for the view in the `gestures` object.
    * @method _setupHammer
    * @private
    *
    * @param {object} options Options with which to initialize Hammer (optional: default is an empty object)
    */
    _setupHammer: function (options) {
      if (Ember.isNone(options)) {
        options = {};
      }
      if (this.get('gestures') && !this.get('_hammerInstance')) {
        this.set('_hammerInstance', Hammer(this.get('element'), options));
      }
    },
    /**
    * This function will ensure that `_hammerInstance` has been populated by calling `this._setupHammer`.
    * It then iterates over the keys in the `gestures` object and attaches a glue function to the relevant
    * event using `hammer_instance.on` that changes the callback context (`this`) to the View object
    * for each of the callbacks specified.
    * Gesture events will naturally bubble up the DOM tree, so if you want to cancel bubbling in your callback,
    * just return `false`.
    * The `event` argument passed into the callbacks you specify in the `gestures` object is provided by Hammer.
    * @method _setupGestures
    * @private
    */
    _setupGestures: function () {
      var gestures, events, hammer, self, hammerOptions;

      self = this;
      gestures = this.get('gestures');
      hammerOptions = Ember.$.extend({},
        Ember.get(globalOptions, 'hammerOptions') || {},
        this.get('hammerOptions') || {}
      );

      this._setupHammer(hammerOptions);

      if (gestures) {
        events = Object.keys(gestures);
        hammer = this.get('_hammerInstance');

        Ember.$.each(events, function (index, value) {
          hammer.on(value.toLowerCase(), function (event) {
            var output = self.gestures[value].apply(self, Array.prototype.slice.call(arguments));
            if (output === false) {
              if (typeof event.stopPropagation !== 'undefined') {
                event.stopPropagation();
              } else {
                event.srcEvent.stopPropagation();
              }
            }
            return output;
          });
        });
      }
    },
    /**
    * This will call `dispose` on the Hammer instance for the view and then nullify it.
    * @method _teardownGestures
    * @private
    */
    _teardownGestures: function () {
      var hammer = this.get('_hammerInstance');
      if (hammer && typeof hammer.dispose === "function") {
        hammer.dispose();
      }
      this.set('_hammerInstance', null);
    },
    /**
    * This function is attached to the `didInsertElement` view event that is fired.
    * It will call `this._setupGestures` to initialise gestural behaviour for the view upon insertion into the DOM.
    * @method _onDidInsertElement
    * @private
    */
    _onDidInsertElement: Ember.on('didInsertElement', function () {
      this._setupGestures();
      return this._super(Array.prototype.slice.call(arguments));
    }),
    /**
    * This function is attached to the `willDestroy` view event that is fired.
    * @method _onWillDestroy
    * @private
    */
    _onWillDestroy: Ember.on('willDestroy', function () {
      this._teardownGestures();
      return this._super(Array.prototype.slice.call(arguments));
    }),
    /**
    * This function is observes the `gestures` property on the view.
    * Under normal circumstances `gestures` will never change, so this observer
    * is never fired. It does however ensure that if the `gestures` object is
    * patched, gestural behaviour is updated.
    * @method _onWillDestroy
    * @private
    */
    _observesGestures: Ember.observer('gestures', function () {
      this._teardownGestures();
      this._setupGestures();
    })
  });
})(window, Ember, Hammer, (typeof emberHammerOptions === 'undefined' ? false : emberHammerOptions));
if (typeof emberHammerOptions !== 'undefined') {
  emberHammerOptions = null;
  delete emberHammerOptions;
}
