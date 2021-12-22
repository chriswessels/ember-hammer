import { modifier } from 'ember-modifier';
import Hammer from 'hammerjs';

export default modifier(function onGesture(
  element,
  [eventName, callback, ...params] /*, named*/
) {
  const hammertime = new Hammer(element, {});
  hammertime.on(eventName, function (ev) {
    callback();
  });

  return () => {};
});
