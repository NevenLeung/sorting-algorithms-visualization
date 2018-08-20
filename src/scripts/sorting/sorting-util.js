/**
 * @module Sorting Util
 *
 * 排序函数会用到的一些功能集合
 *
 * @export { sortInit, clear, swap, insert, statsDisplay, markComparisonItem, getItemValue, enableResetButton }
 */

// -------------------- module start -------------------

import {createNewElementNode} from "../utility/general-functions.js";
import DOM_OperationModule from "../DOM/DOM-operations.js";

const arr = [6, 4, 2, 9, 1, 10, 7, 3, 8, 5];

/**
 * sortInit(parentNode)
 *
 * 根据数组元素的数组的相对大小，创建相应高度的柱子，依次添加到parentNode，作为它的子节点。用于应用初始化与点击排序结果重置按钮。
 *
 * @param {Element} parentNode  一个符合.sorting-wrapper的元素
 */
function sortInit(parentNode) {
  arr.forEach(n => {
    const childNode = createNewElementNode('div', 'item', n, 'data-value', n);
    childNode.style.height = `${n * 20}px`;

    parentNode.appendChild(childNode);
  });
}

/**
 * reset(parentNode)
 *
 * 清空.sort-wrapper的所有子元素
 *
 * @param {Element} parentNode
 */
function clear(parentNode) {
  const arr = Array.from(parentNode.children);
  arr.forEach(child => {
    parentNode.removeChild(child);
  });
}

/**
 * swap(firstIndex, lastIndex, parentNode, animationDuration = 1000)
 *
 * DOM节点的交换动画函数
 * -----------------------------------------------------------------------------------
 * 两个index的前后关系没有要求，函数内部有相应的逻辑判断，但为了代码更易读，最好还是遵循节点前后顺序
 * -----------------------------------------------------------------------------------
 * @param {Number} firstIndex  发生交换的节点在当前数组中的下标值
 * @param {Number} lastIndex  发生交换的节点在当前数组中的下标值
 * @param {Element}  parentNode  一个符合.sorting-wrapper的元素，交换操作以此元素为父节点
 * @param {Number} animationDuration  交换动画持续时间，默认值为1000ms。
 *                           相近节点的交换，动画会显得比较慢，而距离较远的节点的交换动画会执行得很快，需要把握好这个平衡点。
 *
 * @return {Promise<undefined>}  无意义的resolve结果，主要是为了告知交换动画执行完毕
 */
function swap(firstIndex, lastIndex, parentNode, animationDuration = 1000) {
  return new Promise(function (resolve) {
    const arr = Array.from(parentNode.children);

    const firstEl = arr[firstIndex];
    const lastEl = arr[lastIndex];

    // 节点位置
    const firstLeft = firstEl.offsetLeft;
    const lastLeft = lastEl.offsetLeft;

    const diff_X = Math.abs(firstLeft - lastLeft);

    let animationKeyframesForFirstEl, animationKeyframesForLastEl;

    // 左右交换动画

    // 根据节点的位置相对关系，来设定移动的方向
    if (firstLeft < lastLeft) {
      animationKeyframesForFirstEl = [
        { transform: 'translateX(0px)' },
        { transform: `translateX(${diff_X}px)` }
      ];

      animationKeyframesForLastEl = [
        { transform: 'translateX(0px)' },
        { transform: `translateX(${-diff_X}px)` }
      ];
    } else {
      animationKeyframesForFirstEl = [
        { transform: 'translateX(0px)' },
        { transform: `translateX(${-diff_X}px)` }
      ];

      animationKeyframesForLastEl = [
        { transform: 'translateX(0px)' },
        { transform: `translateX(${diff_X}px)` }
      ];
    }

    const animationOption = {
      duration: animationDuration,
    };

    const animation1 = firstEl.animate(
      animationKeyframesForFirstEl,
      animationOption
    );

    const animation2 = lastEl.animate(
      animationKeyframesForLastEl,
      animationOption
    );

    animation1.onfinish = function () {
      //  将前面的节点插入到后面
      if (arr[lastIndex] === parentNode.lastElementChild) {
        parentNode.appendChild(arr[firstIndex]);
      } else {
        parentNode.insertBefore(arr[firstIndex], arr[lastIndex + 1]);
      }

      resolve('Swapping is finished.');
    };

    animation2.onfinish = function () {
      // 将后面的节点插入到前面
      parentNode.insertBefore(arr[lastIndex], arr[firstIndex + 1]);
    }
  });
}

/**
 * insert(index, movingArray, parentNode, animationDuration = 1000)
 *
 * DOM节点的插入动画函数
 * ---------------------------------------------------------------------------------------------------------
 * 在插入操作发生时，插入节点与其他被动移动节点的移动距离是不一样的，同时也要考虑移动方向的因素，函数内部都做了相应的判断
 * ---------------------------------------------------------------------------------------------------------
 * @param index  待插入节点在当前数组中的下标值，该节点的移动距离则是整个moving array所有元素的的宽度之和
 * @param movingArray  将其他需要被动移动的节点添加到moving array中，moving array的移动距离只有一个节点的宽度
 * @param parentNode  一个符合.sorting-wrapper的元素，插入操作以此元素为父节点
 * @param animationDuration  交换动画持续时间，默认值为1000ms。
 *                           相近节点的交换，动画会显得比较慢，而距离较远的节点的交换动画会执行得很快，需要把握好这个平衡点。
 *
 * @return {Promise<any>}  返回插入节点插入到相应位置后的下标值
 */
function insert(index, movingArray, parentNode, animationDuration = 1000) {
  return new Promise(function (resolve) {
    let arr = Array.from(parentNode.children);

    const $insertItem = arr[index];
    const $firstItem = movingArray[0];
    const $lastItem = movingArray[movingArray.length - 1];

    const insertLeft = $insertItem.offsetLeft;
    const firstLeft = $firstItem.offsetLeft;
    const lastLeft = $lastItem.offsetLeft;

    const diff_X1 = Math.abs(insertLeft - firstLeft);
    const diff_X2 = Math.abs(insertLeft - lastLeft);

    let animationKeyframesOfInsertItem;
    let animationKeyframesOfMovingArray;

    if (insertLeft < firstLeft) {
      // insert item在moving array的左边
      animationKeyframesOfInsertItem = [
        { transform: 'translateX(0px)' },
        { transform: `translateX(${diff_X2}px)` }
      ];

      animationKeyframesOfMovingArray = [
        { transform: 'translateX(0px)' },
        { transform: `translateX(${-diff_X1}px)` }
      ];
    } else {
      // insert item在moving array的右边
      animationKeyframesOfInsertItem = [
        { transform: 'translateX(0px)' },
        { transform: `translateX(${-diff_X1}px)` }
      ];

      animationKeyframesOfMovingArray = [
        { transform: 'translateX(0px)' },
        { transform: `translateX(${diff_X2}px)` }
      ];
    }

    const animationOption = {
      duration: animationDuration,
    };

    movingArray.forEach(($item) => {
      $item.animate(
        animationKeyframesOfMovingArray,
        animationOption
      );
    });

    const animation1 = $insertItem.animate(
      animationKeyframesOfInsertItem,
      animationOption
    );

    animation1.onfinish = function () {
      if (insertLeft < firstLeft) {
        parentNode.insertBefore($insertItem, arr[arr.indexOf($lastItem) + 1]);
      } else {
        parentNode.insertBefore($insertItem, $firstItem);
      }

      // 返回插入后的index
      arr = Array.from(parentNode.children);

      resolve(arr.indexOf($insertItem));
    };
  });
}

/**
 * statsDisplay(parentNode)
 *
 * 在排序过程中，负责更新DOM中比较、交换或插入的操作次数的数值
 * ------------------------------------------------------
 * 内部有三个函数
 * reset() - 将统计次数重置为0
 * comparisonAdd() - 比较操作的统计数值 +1
 * swapAdd() - 交行（或插入）操作的统计数值 +1
 *-------------------------------------------------------
 * @param {Element} parentNode  一个符合.sorting-wrapper的元素
 *
 * @return {Object} 返回次数统计相关的方法
 * {
    reset,
    comparisonAdd,
    swapAdd
  }
 */
function statsDisplay(parentNode) {
  const $columnWrapper = DOM_OperationModule.findClosestAncestor(parentNode, '.col');
  const $numberOfComparison = DOM_OperationModule.query($columnWrapper, '.num-comparison');
  const $numberOfSwap = DOM_OperationModule.query($columnWrapper, '.num-swap');
  let comparisonCounter = parseInt($numberOfComparison.textContent);
  let swapCounter = parseInt($numberOfSwap.textContent);

  function reset() {
    $numberOfComparison.textContent = 0;
    $numberOfSwap.textContent = 0;
  }

  // 获取相应排序动画的比较次数的统计数值，在此数值上 +1
  function comparisonAdd() {
    comparisonCounter += 1;
    $numberOfComparison.textContent = comparisonCounter;
  }

  // 获取相应排序动画的交换（或插入）次数的统计数值，在此数值上 +1
  function swapAdd() {
    swapCounter += 1;
    $numberOfSwap.textContent = swapCounter;
  }

  return {
    reset,
    comparisonAdd,
    swapAdd
  };
}

/**
 * markComparisonItem(parentNode)
 *
 * 为排序算法动画中的item的标记颜色
 * --------------------------------------------------------------------------------------------
 * - 颜色标记与相应取消颜色标记的函数一对一对的，不同的颜色标记函数的需要传入的参数可能会有所不同
 * - markGreen(), markBlue(), markPurple(), markAreaItem()都是标记单个item的，其余两个从函数命名中可以看出标记的数量
 *
 * 标记颜色说明：
 * - 绿色：表示当前循环作为基准进行比较的item
 * - 蓝色：表示当前循环中遍历到的另一个比较的item。
 *   (通常，绿色的item变动较少，蓝色item的一直都在变化。只要有比较过程出现，就会出现绿色与蓝色的标记)
 *
 * - 紫色：
 *   - 在快速排序中，表示pivot。
 *   - 在插入类的排序中，表示发生插入操作的item。
 * - 浅肉色：
 *   - 表示每一次内部循环中，将要遍历的范围（目的是为了表明当前一次内部循环中，要发生比较与交换（或插入）操作的区域）
 * --------------------------------------------------------------------------------------------
 * @param {Element} parentNode  一个符合.sorting-wrapper的元素
 *
 * @return {Object} 返回颜色标记相关的方法
 * {
    markGreen,
    markBlue,
    markPurple,
    markAreaItem,
    markTwoItem,
    markMultipleItems,
    removeGreenMark,
    removeBlueMark,
    removePurpleMark,
    removeAreaItemMark,
    removeTwoMark,
    removeMultipleMark
  }
 */
function markComparisonItem(parentNode) {
  const arr = Array.from(parentNode.children);

  function markGreen(index) {
    const $item = arr[index];
    $item.classList.add('green-item');
  }

  function removeGreenMark(index) {
    const $item = arr[index];
    $item.classList.remove('green-item');
  }

  function markBlue(index) {
    const $item = arr[index];
    $item.classList.add('blue-item');
  }

  function removeBlueMark(index) {
    const $item = arr[index];
    $item.classList.remove('blue-item');
  }

  function markPurple(index) {
    const $item = arr[index];
    $item.classList.add('purple-item');
  }

  function removePurpleMark(index) {
    const $item = arr[index];
    $item.classList.remove('purple-item');
  }

  function markAreaItem(index) {
    const $item = arr[index];
    $item.classList.add('other-item');
  }

  function removeAreaItemMark(index) {
    const $item = arr[index];
    $item.classList.remove('other-item');
  }

  function markTwoItem(index1, index2) {
    const $firstEl = arr[index1];
    const $secondEl = arr[index2];

    $firstEl.classList.add('green-item');
    $secondEl.classList.add('blue-item');
  }

  function removeTwoMark(index1, index2) {
    const $firstEl = arr[index1];
    const $secondEl = arr[index2];

    $firstEl.classList.remove('green-item');
    $secondEl.classList.remove('blue-item');
  }

  function markMultipleItems(startIndex, endIndex) {
    const $items = arr.slice(startIndex, endIndex + 1);

    $items.forEach(($item) => {
      $item.classList.add('other-item');
    });
  }

  function removeMultipleMark(startIndex, endIndex) {
    const items = arr.slice(startIndex, endIndex + 1);

    items.forEach((item) => {
      item.classList.remove('other-item');
    });
  }

  return {
    markGreen,
    markBlue,
    markPurple,
    markAreaItem,
    markTwoItem,
    markMultipleItems,
    removeGreenMark,
    removeBlueMark,
    removePurpleMark,
    removeAreaItemMark,
    removeTwoMark,
    removeMultipleMark
  }
}

/**
 * getItemValue
 *
 * 用于将$el.dataset.value转化为数值
 *
 * @param {Array} arr  item所在的数组
 * @param {Number} index  item的下标索引
 *
 * @return {Number}  item节点的data-value数值
 */
function getItemValue(arr, index) {
  return parseInt(arr[index].dataset.value);
}

/**
 * enableResetButton($showcaseWrapper)
 *
 * 重新启用reset按钮
 *
 * @param {Element} $showcaseWrapper  .showcase元素节点
 */
function enableResetButton($showcaseWrapper) {
  const $resetButton = DOM_OperationModule.query($showcaseWrapper, '.reset-button');
  $resetButton.removeAttribute('disabled');
}

export {
  sortInit,
  clear,
  swap,
  insert,
  statsDisplay,
  markComparisonItem,
  getItemValue,
  enableResetButton
}