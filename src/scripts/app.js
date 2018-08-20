import '../styles/normalize.css';
import '../styles/main.css';

import './utility/polyfills.js';

import { $bubbleSortWrapper, $selectSortWrapper, $insertSortWrapper, $mergeSortWrapper, $quickSortWrapper } from "./DOM/DOM-elements.js";
import { sortInit } from "./sorting/sorting-util.js";
import { setUpEventListener } from "./event/event-listener.js";

/**
 * appInit()
 *
 * 应用的初始化函数
 */
function appInit() {
  sortInit($bubbleSortWrapper);
  sortInit($selectSortWrapper);
  sortInit($insertSortWrapper);
  sortInit($mergeSortWrapper);
  sortInit($quickSortWrapper);

  setUpEventListener();
}


appInit();