import '../styles/main.css';

import './utility/polyfills.js';

import { $container, $bubbleSortWrapper, $selectSortWrapper, $insertSortWrapper, $mergeSortWrapper, $quickSortWrapper } from "./DOM/DOM-elements.js";
import { createNewElementNode } from "./utility/general-functions.js";
import DOM_OperationModule from './DOM/DOM-operations.js';

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

/**
 * delay(timeout)
 *
 * 在异步代码中使后续代码延迟执行的函数
 * -------------------------------
 * 用作在排序过程中使代码暂停执行
 * -------------------------------
 * @param {Number} timeout  暂停时长，单位ms
 * @return {Promise<undefined>}  一个延迟resolve的Promise
 */
function delay(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
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

  $container.addEventListener('click', appOnClick, false);
}


appInit();