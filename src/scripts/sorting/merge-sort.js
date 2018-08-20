/**
 * @module Merge Sort
 *
 * 归并排序的排序动画
 *
 * @export { mergeSort }
 */

// -------------------- module start -------------------

import DOM_OperationModule from "../DOM/DOM-operations.js";
import { delay } from "../utility/general-functions.js";
import { insert, markComparisonItem, statsDisplay, getItemValue, enableResetButton } from "./sorting-util.js";

/**
 * mergeSort(parentNode, smallArray = [])
 *
 * 归并排序的执行函数，内部异步执行相应的DOM节点排序动画。
 * ------------------------------------------------------------------------------------------------------------------
 * 该函数使用了递归。在传入merge()的参数中，递归调用了mergeSort()本身，而每一次mergerSort()的结果则是由两个return语句之一来决定。
 * ------------------------------------------------------------------------------------------------------------------
 * @param {Element} parentNode  一个符合.sorting-wrapper .merge-sort的元素，
 *                              后续用于更新arr，使得arr变量与发生节点操作后的实际DOM数组保持一致
 * @param {Array} smallArray  用于保存需要被不断拆分的数组，起始默认值为空数组。
 *
 * @return {Promise<*>}  有序的，从小到大排好序的DOM数组
 */
async function mergeSort(parentNode, smallArray = []) {
  let arr;

  if (smallArray.length === 0) {
    arr = Array.from(parentNode.children);
  } else {
    arr = smallArray;
  }

  const len = arr.length;

  if (len < 2) {
    return arr;
  }

  const mid = len / 2;
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  // 确保获得merge sort的resolve的结果，而不是一个pending的Promise
  const leftArray = await mergeSort(parentNode, left);
  const rightArray = await mergeSort(parentNode, right);

  return merge(parentNode, leftArray, rightArray);

  async function merge(parentNode, leftArray, rightArray) {
    let result;
    let mergeArray = [];
    let arr = Array.from(parentNode.children);
    let initArray = [].concat(leftArray, rightArray);
    let areaFirstIndex = arr.indexOf(initArray[0]);
    let areaLastIndex = arr.indexOf(initArray[initArray.length - 1]);

    // 标记merge的区域
    markComparisonItem(parentNode).markMultipleItems(areaFirstIndex, areaLastIndex);

    await delay(800);

    while (leftArray.length && rightArray.length) {
      let leftFirstIndex = arr.indexOf(leftArray[0]);
      // let leftLastIndex = arr.indexOf(leftArray[leftArray.length - 1]);
      let rightFirstIndex = arr.indexOf(rightArray[0]);

      let min, indexAfterInsert;

      markComparisonItem(parentNode).markTwoItem(leftFirstIndex, rightFirstIndex);
      statsDisplay(parentNode).comparisonAdd();

      await delay(800);
      markComparisonItem(parentNode).removeTwoMark(leftFirstIndex, rightFirstIndex);

      // 如果右侧的比较小，则插入到left[0]所在的位置
      if (getItemValue(leftArray, 0) <= getItemValue(rightArray, 0)) {
        // 如果左边的比较小，不需要移动，只需将item移除left array即可
        min = leftArray.shift();

      } else {
        min = rightArray.shift();

        markComparisonItem(parentNode).markPurple(rightFirstIndex);
        await delay(500);

        statsDisplay(parentNode).swapAdd();
        // 将item插入到合适的位置
        indexAfterInsert = await insert(rightFirstIndex, leftArray, parentNode);

        await delay(500);

        markComparisonItem(parentNode).removePurpleMark(indexAfterInsert);
      }

      // 保存每次循环中的最小的item
      mergeArray.push(min);

      arr = Array.from(parentNode.children);
    }

    // 移除merge区域的标记
    markComparisonItem(parentNode).removeMultipleMark(areaFirstIndex, areaLastIndex);

    await delay(500);

    // 为什么要用concat？
    // 这是因为假如有一个数组已经为空，循环就将结束，另一个数组可能还有item，
    // 需要将没有push到merge array的item也添加进来，最后将result作为merge()的结果返回
    result = await mergeArray.concat(leftArray, rightArray);

    if (result.length === 10) {
      // 排序完毕，恢复reset button
      const $showcaseWrapper = DOM_OperationModule.findClosestAncestor(parentNode, '.showcase');
      enableResetButton($showcaseWrapper);
    }

    return result;
  }
}

export default mergeSort;