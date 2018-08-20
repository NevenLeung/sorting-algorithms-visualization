/**
 * @module Bubble Sort
 *
 * 冒泡排序的排序动画
 *
 * @export { bubbleSort }
 */

// -------------------- module start -------------------

import DOM_OperationModule from "../DOM/DOM-operations.js";
import { delay } from "../utility/general-functions.js";
import { swap, markComparisonItem, statsDisplay, getItemValue, enableResetButton } from "./sorting-util.js";

/**
 * bubbleSort(parentNode)
 *
 * 冒泡排序的执行函数，内部异步执行相应的DOM节点排序动画
 *
 * @param {Element} parentNode  一个符合.sorting-wrapper .bubble-sort的元素
 */
async function bubbleSort(parentNode) {
  let arr = Array.from(parentNode.children);
  for (let i = 0, n = arr.length; i < n; i += 1) {
    // 标记当前循环要编译的item范围
    markComparisonItem(parentNode).markMultipleItems(i, n - 1);
    await delay(800);

    for (let j = n - 1; j > i; j -= 1) {
      statsDisplay(parentNode).comparisonAdd();
      // 标记正在进行比较的item
      markComparisonItem(parentNode).markTwoItem(j - 1, j);
      await delay(500);

      if (getItemValue(arr, j - 1) > getItemValue(arr, j)) {
        statsDisplay(parentNode).swapAdd();
        // 进行交换，节点位置的交换
        await swap(j - 1, j, parentNode);

        // swap之后的500ms的暂停
        // 一是为了在交换动画完成后，停一下再取消标记颜色
        // 二是为了让arr尽可能地获取到节点位置交换后的DOM数组
        await delay(500);
        // 更新arr，使得arr变量与发生节点操作后的实际DOM数组保持一致
        arr = Array.from(parentNode.children);

        // 发生了交换，则按交换后的顺序取消对应的样式
        markComparisonItem(parentNode).removeTwoMark(j, j - 1);
      } else {
        // 没有发生交换，按原来的顺序取消应该的样式
        markComparisonItem(parentNode).removeTwoMark(j - 1, j);
      }
    }

    await delay(500);

    markComparisonItem(parentNode).removeMultipleMark(i, n - 1);
    await delay(500);
  }

  // 恢复reset button
  const $showcaseWrapper = DOM_OperationModule.findClosestAncestor(parentNode, '.showcase');
  enableResetButton($showcaseWrapper);
}

export default bubbleSort;