/**
 * @module Select Sort
 *
 * 选择排序的排序动画
 *
 * @export { selectSort }
 */

// -------------------- module start -------------------

import DOM_OperationModule from "../DOM/DOM-operations.js";
import { delay } from "../utility/general-functions.js";
import { swap, markComparisonItem, statsDisplay, getItemValue, enableResetButton } from "./sorting-util.js";

/**
 * selectSort(parentNode)
 *
 * 选择排序的执行函数，内部异步执行相应的DOM节点排序动画
 *
 * @param {Element} parentNode  一个符合.sorting-wrapper .select-sort的元素
 *
 */
async function selectSort(parentNode) {
  let arr = Array.from(parentNode.children);
  for (let i = 0, minIndex, n = arr.length; i < n - 1; i += 1) {
    minIndex = i;

    // 标记当前循环要编译的item范围
    markComparisonItem(parentNode).markMultipleItems(i, n - 1);
    await delay(800);

    for (let j = i + 1; j <= n - 1; j += 1) {
      statsDisplay(parentNode).comparisonAdd();

      // 标记正在进行比较的item
      markComparisonItem(parentNode).markTwoItem(minIndex, j);
      await delay(500);
      markComparisonItem(parentNode).removeTwoMark(minIndex, j);

      if (getItemValue(arr, minIndex) > getItemValue(arr, j)) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      markComparisonItem(parentNode).markTwoItem(i, minIndex);
      // 标记准备交换的两个item，让人们知道是这两个元素准备发生交换
      await delay(500);

      statsDisplay(parentNode).swapAdd();
      // 进行交换，节点位置的交换
      await swap(i , minIndex, parentNode);

      // swap之后的500ms的暂停
      // 一是为了在交换动画完成后，停一下再取消标记颜色
      // 二是为了让arr尽可能地获取到节点位置交换后的DOM数组
      await delay(500);
      // 更新arr，使得arr变量与发生节点操作后的实际DOM数组保持一致
      arr = Array.from(parentNode.children);

      // 发生了交换，则按交换后的顺序取消对应的样式
      markComparisonItem(parentNode).removeTwoMark(minIndex, i);
    }

    await delay(500);
    markComparisonItem(parentNode).removeMultipleMark(i, n - 1);
    await delay(500);
  }

  const $showcaseWrapper = DOM_OperationModule.findClosestAncestor(parentNode, '.showcase');
  enableResetButton($showcaseWrapper);
}

export default selectSort;