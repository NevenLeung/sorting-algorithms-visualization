/**
 * @module Event Listener
 *
 * 事件监听绑定的模块
 *
 * @export { setUpEventListener }
 */

// -------------------- module start -------------------

import { $container } from "../DOM/DOM-elements.js";
import { appOnClick } from './even-handler.js'

function setUpEventListener() {
  $container.addEventListener('click', appOnClick, false);
}

export {
  setUpEventListener
}