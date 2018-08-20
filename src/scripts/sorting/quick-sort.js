/**
 * @module Quick Sort
 *
 * 快速排序的排序动画
 *
 * @export { quickSort }
 */

// -------------------- module start -------------------

import DOM_OperationModule from "../DOM/DOM-operations.js";
import { delay } from "../utility/general-functions.js";
import { swap, markComparisonItem, statsDisplay, getItemValue, enableResetButton } from "./sorting-util.js";

/**
 * quickSort(parentNode, low = 0, high = parentNode.children.length - 1)
 *
 * 快速排序的执行函数，内部异步执行相应的DOM节点排序动画
 * ---------------------------------------------------------------------------------------------------------------------
 * 该函数使用了递归，进行排序的是partition()，quickSort()通过partition()找到pivot，不断地将数组越拆越小，直到每一部分数组都是有序的
 * ---------------------------------------------------------------------------------------------------------------------
 * @param {Element}  parentNode  一个符合.sorting-wrapper .quick-sort的元素
 * @param {Number} low  数组的起始下标，初始默认值为0
 * @param {Number} high  数组的结束下标，初始默认值为数组的最后一个
 */
async function quickSort(parentNode, low = 0, high = parentNode.children.length - 1) {
  if (low < high) {
    let pivot = await partition(parentNode, low, high);

    await quickSort(parentNode, low, pivot - 1);
    await quickSort(parentNode, pivot + 1, high);
  } else {
    // 递归接近完成，quickSort的递归到头
    const $showcaseWrapper = DOM_OperationModule.findClosestAncestor(parentNode, '.showcase');
    enableResetButton($showcaseWrapper);
  }

  // 选择一个数值作为 pivot（枢轴），经过一些步骤，使得位于 pivot 左侧的所有数值都小于 pivot，而位于 pivot 右侧的所有数值都大于 pivot
  async function partition(parentNode, low, high) {
    let arr = Array.from(parentNode.children);

    let initLow = low;
    let initHigh = high;

    let pivotIndex = low;
    let pivotValue = getItemValue(arr, low);

    // 标识之前比较的区域，标识pivot
    markComparisonItem(parentNode).markMultipleItems(initLow, initHigh);
    await delay(800);

    while (low < high) {
      while (high > low && getItemValue(arr, high) >= pivotValue) {
        statsDisplay(parentNode).comparisonAdd();

        // 标记正在进行比较的item
        markComparisonItem(parentNode).markTwoItem(pivotIndex, high);
        await delay(500);
        markComparisonItem(parentNode).removeTwoMark(pivotIndex, high);

        high -= 1;
      }
      statsDisplay(parentNode).comparisonAdd();

      // 防止下标相等时，出现无用交换的等待
      if (low !== high) {
        statsDisplay(parentNode).swapAdd();
        markComparisonItem(parentNode).markTwoItem(low, high);

        await delay(500);
        await swap(low, high, parentNode);

        // swap之后的500ms的暂停
        // 一是为了在交换动画完成后，停一下再取消标记颜色
        // 二是为了让arr尽可能地获取到节点位置交换后的DOM数组
        await delay(500);
        markComparisonItem(parentNode).removeTwoMark(high, low);

        await delay(500);
        arr = Array.from(parentNode.children);
      }

      while (low < high && getItemValue(arr, low) <= pivotValue) {
        statsDisplay(parentNode).comparisonAdd();

        // 因为一开始pivotIndex = low，所以item只能表现出一种颜色
        markComparisonItem(parentNode).markTwoItem(pivotIndex, low);
        await delay(500);
        markComparisonItem(parentNode).removeTwoMark(pivotIndex, low);

        low += 1;
      }
      statsDisplay(parentNode).comparisonAdd();

      // 防止下标相等时，出现无用交换的等待
      if (low !== high) {
        statsDisplay(parentNode).swapAdd();
        markComparisonItem(parentNode).markTwoItem(low, high);

        await delay(500);
        await swap(low, high, parentNode);

        await delay(500);
        markComparisonItem(parentNode).removeTwoMark(high, low);

        await delay(500);
        arr = Array.from(parentNode.children);
      }
    }

    // 显示排序后pivot的位置，以及之前排序的范围
    markComparisonItem(parentNode).markPurple(low);
    await delay(1500);

    markComparisonItem(parentNode).removeMultipleMark(initLow, initHigh);
    markComparisonItem(parentNode).removePurpleMark(low);

    await delay(500);

    return low;
  }
}

export default quickSort;