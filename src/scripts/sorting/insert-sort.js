/**
 * @module Insert Sort
 *
 * 插入排序的排序动画
 *
 * @export { insertSort }
 */

// -------------------- module start -------------------

import DOM_OperationModule from "../DOM/DOM-operations.js";
import { delay } from "../utility/general-functions.js";
import { insert, markComparisonItem, statsDisplay, getItemValue, enableResetButton } from "./sorting-util.js";

/**
 * insertSort(parentNode)
 *
 * 插入排序的执行函数，内部异步执行相应的DOM节点排序动画
 *
 * @param {Element} parentNode  一个符合.sorting-wrapper .insert-sort的元素
 */
async function insertSort(parentNode) {
  let arr = Array.from(parentNode.children);

  for (let i = 1, n = arr.length; i <= n - 1; i += 1) {
    markComparisonItem(parentNode).markTwoItem(i - 1, i);
    statsDisplay(parentNode).comparisonAdd();

    await delay(800);
    markComparisonItem(parentNode).removeTwoMark(i - 1, i);

    await delay(500);

    if (getItemValue(arr, i - 1) > getItemValue(arr, i)) {
      let movingArray = [];
      let j, indexAfterInsert;

      // 下标为i的item为插入的对象
      for (j = i - 1; j >= 0 && getItemValue(arr, j) > getItemValue(arr, i) ; j -= 1) {
        // arr[j + 1] = arr[j];
        statsDisplay(parentNode).comparisonAdd();

        // 这里将标记的下标进行了交换，主要是让变化的下标使用蓝色
        markComparisonItem(parentNode).markTwoItem(j, i);
        await delay(500);
        markComparisonItem(parentNode).removeTwoMark(j, i);

        // 使用movingArray将之后要移动的item保存起来
        movingArray.push(arr[j]);

        // 标记即将因节点插入而改变位置的item
        markComparisonItem(parentNode).markAreaItem(j);
      }
      // 算上跳出循环的那一次比较
      statsDisplay(parentNode).comparisonAdd();

      // 标记即将要插入的item
      markComparisonItem(parentNode).markPurple(i);

      // 标记准备'交换'的两个部分，让人们知道是这两个元素准备发生'交换'，实际发生的是节点插入
      await delay(500);

      // 先累加，再交换
      statsDisplay(parentNode).swapAdd();

      // 由于j的循环是从大到小进行的，因此需要将moving array进行一次翻转，才符合实际的顺序情况
      indexAfterInsert = await insert(i, movingArray.reverse(), parentNode);

      await delay(500);

      // 更新arr，使得arr变量与发生节点操作后的实际DOM数组保持一致
      arr = Array.from(parentNode.children);

      markComparisonItem(parentNode).removePurpleMark(indexAfterInsert);

      // 要视移动的方向来决定，其他item的下标
      if (i > indexAfterInsert) {
        markComparisonItem(parentNode).removeMultipleMark(j + 1, i);
      } else {
        markComparisonItem(parentNode).removeMultipleMark(j - 1, i - 2);
      }

      await delay(500);
    }
  }

  // 恢复reset button
  const $showcaseWrapper = DOM_OperationModule.findClosestAncestor(parentNode, '.showcase');
  enableResetButton($showcaseWrapper);
}

export default insertSort;