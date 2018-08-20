/**
 * @module Event Handlers
 *
 * 事件处理的模块
 *
 * @export { appOnClick }
 */

// -------------------- module start -------------------

import DOM_OperationModule from "../DOM/DOM-operations.js";
import { sortInit, clear, statsDisplay } from "../sorting/sorting-util.js";

import bubbleSort from '../sorting/bubble-sort.js';
import selectSort from '../sorting/select-sort.js';
import insertSort from '../sorting/insert-sort.js';
import mergeSort from '../sorting/merge-sort.js';
import quickSort from '../sorting/quick-sort.js';


/**
 * startSorting($sortingWrapper)
 *
 * 各种排序动画的启动函数
 *
 * @param {Element} $sortingWrapper  相应的.sorting-wrapper的元素
 */
function startSorting($sortingWrapper) {
  if ($sortingWrapper.matches('.bubble-sort')) {
    bubbleSort($sortingWrapper);
  }
  if ($sortingWrapper.matches('.select-sort')) {
    selectSort($sortingWrapper);
  }
  if ($sortingWrapper.matches('.insert-sort')) {
    insertSort($sortingWrapper);
  }
  if ($sortingWrapper.matches('.merge-sort')) {
    mergeSort($sortingWrapper);
  }
  if ($sortingWrapper.matches('.quick-sort')) {
    quickSort($sortingWrapper);
  }
}

/**
 * playHandler($el)
 *
 * 点击start按钮的处理函数
 *
 * @param {Element} $el  .start-button元素节点
 */
function playHandler($el) {
  const $showcaseWrapper = DOM_OperationModule.findClosestAncestor($el, '.showcase');
  const $sortingWrapper = DOM_OperationModule.query($showcaseWrapper, '.sorting-wrapper');
  const $resetButton = DOM_OperationModule.query($showcaseWrapper, '.reset-button');

  startSorting($sortingWrapper);

  // 在动画开始时，禁止点击start和reset按钮
  $el.setAttribute('disabled', 'true');
  $resetButton.setAttribute('disabled', 'true');

}

/**
 * resetHandler($el)
 *
 * 点击reset按钮的处理函数
 *
 * @param {Element} $el  .reset-button元素节点
 */
function resetHandler($el) {
  const $showcaseWrapper = DOM_OperationModule.findClosestAncestor($el, '.showcase');
  const $sortingWrapper = DOM_OperationModule.query($showcaseWrapper, '.sorting-wrapper');
  const $startButton = DOM_OperationModule.query($showcaseWrapper, '.start-button');

  // 清空$sortingWrapper中的所有item
  clear($sortingWrapper);
  // 重新生成并渲染未排序的item
  sortInit($sortingWrapper);

  // 重置后可点击start按钮
  $startButton.removeAttribute('disabled');
  $el.setAttribute('disabled', 'true');

  // 重置统计数据
  statsDisplay($sortingWrapper).reset();
}

/**
 * appOnClick(e)
 *
 * 通过事件委托处理start与reset按钮的点击
 *
 * @param e event object
 */
function appOnClick(e) {
  const $el = e.target;

  if($el.matches('.start-button')) {
    playHandler($el);
  }
  if($el.matches('.reset-button')) {
    resetHandler($el);
  }
}

export {
  appOnClick
};