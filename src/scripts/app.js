import '../styles/main.css';

import './utility/polyfills.js';

import { $container, $bubbleSortWrapper, $selectSortWrapper, $insertSortWrapper, $mergeSortWrapper, $quickSortWrapper } from "./DOM/DOM-elements.js";
import { createNewElementNode } from "./utility/general-functions.js";
import DOM_OperationModule from './DOM/DOM-operations.js';

const arr = [6, 4, 2, 9, 1, 10, 7, 3, 8, 5];

function sortInit(parentNode) {
  arr.forEach(n => {
    const childNode = createNewElementNode('div', 'item', n, 'data-value', n);
    childNode.style.height = `${n * 20}px`;

    parentNode.appendChild(childNode);
  });
}

async function bubbleSort(parentNode) {
  let arr = Array.from(parentNode.children);
  for (let i = 0, n = arr.length; i < n; i += 1) {
    // 标记当前循环要编译的item范围
    markComparisonItem(parentNode).markMultipleItems(i, n - 1);
    await delay(800);

    for (let j = n - 1; j > i; j -= 1) {
      // 标记正在进行比较的item
      markComparisonItem(parentNode).markTwoItem(j - 1, j);

      await delay(500);
      statsDisplay(parentNode).comparisonAdd();

      if (getItemValue(arr, j - 1) > getItemValue(arr, j)) {
        // 进行交换，节点位置的交换
        swap(j - 1, j, parentNode);
        await delay(1200);

        // 使得arr为交换后的结果
        arr = Array.from(parentNode.children);

        statsDisplay(parentNode).swapAdd();

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

      // 进行交换，节点位置的交换
      swap(i , minIndex, parentNode);
      await delay(1200);

      // 使得arr为交换后的结果
      arr = Array.from(parentNode.children);

      statsDisplay(parentNode).swapAdd();
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

      // 标记即将要插入的item
      markComparisonItem(parentNode).markPurple(i);

      // 标记准备'交换'的两个部分，让人们知道是这两个元素准备发生'交换'，实际发生的是节点插入
      await delay(500);

      // 先累加，再交换
      statsDisplay(parentNode).swapAdd();

      // 由于j的循环是从大到小进行的，因此需要将moving array进行一次翻转，才符合实际的顺序情况
      indexAfterInsert = await insert(i, movingArray.reverse(), parentNode);

      await delay(500);

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

async function quickSort(parentNode, low = 0, high = parentNode.children.length - 1) {
  if (low < high) {
    let pivot = await partition(parentNode, low, high);

    await quickSort(parentNode, low, pivot - 1);
    await quickSort(parentNode, pivot + 1, high);
  } else {
    // 递归接近完成
    const $showcaseWrapper = DOM_OperationModule.findClosestAncestor(parentNode, '.showcase');
    enableResetButton($showcaseWrapper);
  }

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

      // 防止下标相等时，出现无用交换的等待
      if (low !== high) {
        statsDisplay(parentNode).swapAdd();
        markComparisonItem(parentNode).markTwoItem(low, high);

        swap(low, high, parentNode);
        await delay(1200);

        markComparisonItem(parentNode).removeTwoMark(high, low);

        arr = Array.from(parentNode.children);
      }

      while (low < high && getItemValue(arr, low) <= pivotValue) {
        statsDisplay(parentNode).comparisonAdd();

        markComparisonItem(parentNode).markTwoItem(low, pivotIndex);
        await delay(500);
        markComparisonItem(parentNode).removeTwoMark(low, pivotIndex);

        low += 1;
      }

      // 防止下标相等时，出现无用交换的等待
      if (low !== high) {
        statsDisplay(parentNode).swapAdd();
        markComparisonItem(parentNode).markTwoItem(low, high);

        swap(low, high, parentNode);
        await delay(1200);

        markComparisonItem(parentNode).removeTwoMark(high, low);

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

function delay(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function swap(firstIndex, lastIndex, parentNode) {
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
    duration: 1000,
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

  };

  animation2.onfinish = function () {
    // 将后面的节点插入到前面
    parentNode.insertBefore(arr[lastIndex], arr[firstIndex + 1]);
  }
}

function insert(index, movingArray, parentNode) {
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
      duration: 1000,
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

function reset(parentNode) {
  const arr = Array.from(parentNode.children);
  arr.forEach(child => {
    parentNode.removeChild(child);
  });
}

function statsDisplay(parentNode) {
  const $showcaseWrapper = DOM_OperationModule.findClosestAncestor(parentNode, '.showcase');
  const $numberOfComparison = DOM_OperationModule.query($showcaseWrapper, '.num-comparison');
  const $numberOfSwap = DOM_OperationModule.query($showcaseWrapper, '.num-swap');
  let comparisonCounter = parseInt($numberOfComparison.textContent);
  let swapCounter = parseInt($numberOfSwap.textContent);

  function reset() {
    $numberOfComparison.textContent = 0;
    $numberOfSwap.textContent = 0;
  }
  
  function comparisonAdd() {
    comparisonCounter += 1;
    $numberOfComparison.textContent = comparisonCounter;
  }
  
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
 * getItemValue  用于$el.dataset.value转化为数值
 *
 * @param arr
 * @param index
 * @return {number}
 */
function getItemValue(arr, index) {
  return parseInt(arr[index].dataset.value);
}

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

function playHandler($el) {
  const $showcaseWrapper = DOM_OperationModule.findClosestAncestor($el, '.showcase');
  const $sortingWrapper = DOM_OperationModule.query($showcaseWrapper, '.sorting-wrapper');
  const $resetButton = DOM_OperationModule.query($showcaseWrapper, '.reset-button');

  startSorting($sortingWrapper);

  // 在动画开始时，禁止点击start和reset按钮
  $el.setAttribute('disabled', 'true');
  $resetButton.setAttribute('disabled', 'true');

}

function resetHandler($el) {
  const $showcaseWrapper = DOM_OperationModule.findClosestAncestor($el, '.showcase');
  const $sortingWrapper = DOM_OperationModule.query($showcaseWrapper, '.sorting-wrapper');
  const $startButton = DOM_OperationModule.query($showcaseWrapper, '.start-button');

  reset($sortingWrapper);
  sortInit($sortingWrapper);

  // 重置后可点击start按钮
  $startButton.removeAttribute('disabled');
  $el.setAttribute('disabled', 'true');

  // 重置统计数据
  statsDisplay($sortingWrapper).reset();
}

function enableResetButton($showcaseWrapper) {
  const $resetButton = DOM_OperationModule.query($showcaseWrapper, '.reset-button');
  $resetButton.removeAttribute('disabled');
}

function appOnClick(e) {
  const $el = e.target;

  if($el.matches('.start-button')) {
    playHandler($el);
  }
  if($el.matches('.reset-button')) {
    resetHandler($el);
  }
}

function appInit() {
  sortInit($bubbleSortWrapper);
  sortInit($selectSortWrapper);
  sortInit($insertSortWrapper);
  sortInit($mergeSortWrapper);
  sortInit($quickSortWrapper);

  $container.addEventListener('click', appOnClick, false);
}


appInit();