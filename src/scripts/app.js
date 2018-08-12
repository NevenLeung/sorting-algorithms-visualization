import '../styles/main.css';

import './utility/polyfills.js';

import { $container, $bubbleSortWrapper, $selectSortWrapper, $insertSortWrapper, $quickSortWrapper } from "./DOM/DOM-elements.js";
import { createNewElementNode } from "./utility/general-functions.js";
import DOM_OperationModule from './DOM/DOM-operations.js';

// const arr = [3, 1, 5, 2, 4];
// const arr = [5, 4, 3, 2, 1];
const arr = [4, 6, 2, 9, 1, 7, 10, 3, 5, 8];

// bubble sort

// for (let i = 0, n = arr.length, temp; i < n; i += 1) {
//   for (let j = n - 1; j > i; j -= 1) {
//     if (arr[j - 1] > arr[j]) {
//       temp = arr[j - 1];
//       arr[j - 1] = arr[j];
//       arr[j] = temp;
//     }
//   }
// }

// select sort

// for (let i = 0, n = arr.length; i < n - 1; i += 1) {
//   let min = i;
//   for (let j = i + 1; j <= n - 1; j += 1) {
//     if (arr[min] > arr[j]) {
//       min = j;
//     }
//   }
//   if (min !== i) {
//     let temp = arr[i];
//     arr[i] = arr[min];
//     arr[min] = temp;
//   }
// }

// insert sort

// for (let i = 1, n = arr.length; i <= n - 1; i += 1) {
//   if (arr[i - 1] > arr[i]) {
//     let insertItem = arr[i];
//     let j;
//
//     for (j = i - 1; j >= 0 && insertItem < arr[j] ; j -= 1) {
//       arr[j + 1] = arr[j];
//     }
//
//     arr[j + 1] = insertItem;
//   }
// }

// quick sort

// function partition(low, high, list) {
//
//   let pivotValue = list[low];
//   while (low < high) {
//     while (low < high && list[high] >= pivotValue) {
//       high -= 1;
//     }
//     swap(low, high, list);
//     while (low < high && list[low] <= pivotValue) {
//       low += 1;
//     }
//     swap(low, high, list);
//   }
//
//   function swap(i, j, list) {
//     [list[i], list[j]] = [list[j], list[i]];
//   }
//
//   return low;
//
// }
//
// function qSort(low, high, list) {
//   let pivot;
//   if (low < high) {
//     pivot = partition(low, high, list);
//     qSort(low, pivot - 1, list);
//     qSort(pivot + 1, high, list);
//   }
// }

// console.log(arr);

function sortInit(parentNode) {
  arr.forEach(n => {
    const childNode = createNewElementNode('div', 'item', n, 'data-value', n);
    childNode.style.height = `${n * 20}px`;

    parentNode.appendChild(childNode);
  });
}

// bubble sort
async function bubbleSort(parentNode) {
  let arr = Array.from(parentNode.children);
  for (let i = 0, n = arr.length; i < n; i += 1) {
    for (let j = n - 1; j > i; j -= 1) {
      // 标记正在进行比较的item
      markComparisonItem(parentNode).markTwoItem(j - 1, j);

      await delay(500);

      // comparisonCounter += 1;
      statsDisplay(parentNode).comparisonAdd();

      if (parseInt(arr[j - 1].dataset.value) > parseInt(arr[j].dataset.value)) {
        swap(j - 1, j, parentNode);
        await delay(1200);

        arr = Array.from(parentNode.children);

        // swapCounter += 1;
        statsDisplay(parentNode).swapAdd();

        // 发生了交换，则按交换后的顺序取消对应的样式
        markComparisonItem(parentNode).removeTwoMark(j, j - 1);

      } else {
        // 没有发生交换，按原来的顺序取消应该的样式
        markComparisonItem(parentNode).removeTwoMark(j - 1, j);
      }

    }
  }

  // 恢复reset button
  const $showcaseWrapper = DOM_OperationModule.findClosestAncestor(parentNode, '.showcase');
  enableResetButton($showcaseWrapper);
}

async function selectSort(parentNode) {
  let arr = Array.from(parentNode.children);
  for (let i = 0, minIndex, n = arr.length; i < n - 1; i += 1) {
    minIndex = i;

    for (let j = i + 1; j <= n - 1; j += 1) {
      statsDisplay(parentNode).comparisonAdd();

      // 标记正在进行比较的item
      markComparisonItem(parentNode).markTwoItem(minIndex, j);
      await delay(500);
      markComparisonItem(parentNode).removeTwoMark(minIndex, j);

      if (parseInt(arr[minIndex].dataset.value) > parseInt(arr[j].dataset.value)) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      markComparisonItem(parentNode).markTwoItem(i, minIndex);

      swap(i , minIndex, parentNode);
      await delay(1200);

      arr = Array.from(parentNode.children);

      statsDisplay(parentNode).swapAdd();

      // 发生了交换，则按交换后的顺序取消对应的样式
      markComparisonItem(parentNode).removeTwoMark(minIndex, i);
    }
  }

  const $showcaseWrapper = DOM_OperationModule.findClosestAncestor(parentNode, '.showcase');
  enableResetButton($showcaseWrapper);
}

async function insertSort(parentNode) {
  let arr = Array.from(parentNode.children);

  for (let i = 1, n = arr.length; i <= n - 1; i += 1) {
    if (getItemValue(arr, i - 1) > getItemValue(arr, i)) {
      // let insertItem = arr[i];
      let movingArray = [];
      let j, indexAfterInsert;

      markComparisonItem(parentNode).markTwoItem(i - 1, i);
      await delay(500);
      markComparisonItem(parentNode).removeTwoMark(i - 1, i);

      // 下标为i的item为插入的对象
      for (j = i - 1; j >= 0 && getItemValue(arr, j) > getItemValue(arr, i) ; j -= 1) {
        // arr[j + 1] = arr[j];
        statsDisplay(parentNode).comparisonAdd();

        markComparisonItem(parentNode).markTwoItem(j, i);

        movingArray.push(arr[j]);
        await delay(500);

        markComparisonItem(parentNode).removeTwoMark(j, i)
      }

      await delay(500);

      // arr[j + 1] = insertItem;
      markComparisonItem(parentNode).markOneItem(i);
      // 这里的j， i-1，分别为上面循环中moving array的起始与结束item的下标
      markComparisonItem(parentNode).markMultipleItems(j + 1, i - 1);

      // 由于j的循环是从大到小进行的，因此需要将moving array进行一次翻转，才符合实际的顺序情况
      indexAfterInsert = await insert(i, movingArray.reverse(), parentNode);
      statsDisplay(parentNode).swapAdd();

      await delay(500);

      arr = Array.from(parentNode.children);

      markComparisonItem(parentNode).removeOneMark(indexAfterInsert);

      // 要视移动的方向来决定，其他item的下标
      if (i > indexAfterInsert) {
        markComparisonItem(parentNode).removeMultipleMark(j + 1, i);
      } else {
        markComparisonItem(parentNode).removeMultipleMark(j - 1, i - 2);
      }
    }
  }

  // 恢复reset button
  const $showcaseWrapper = DOM_OperationModule.findClosestAncestor(parentNode, '.showcase');
  enableResetButton($showcaseWrapper);
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
    let list = Array.from(parentNode.children);

    let initLow = low;
    let initHigh = high;

    let pivotIndex = low;
    let pivotValue = parseInt(list[low].dataset.value);

    // 标识之前比较的区域，标识pivot
    markComparisonItem(parentNode).markMultipleItems(initLow, initHigh);

    while (low < high) {
      while (high > low && parseInt(list[high].dataset.value) >= pivotValue) {
        statsDisplay(parentNode).comparisonAdd();

        // 标记正在进行比较的item
        markComparisonItem(parentNode).markTwoItem(pivotIndex, high);
        await delay(500);
        markComparisonItem(parentNode).removeTwoMark(pivotIndex, high);

        high -= 1;
      }

      // 防止出现下标相等时，无用交换的等待
      if (low !== high) {
        statsDisplay(parentNode).swapAdd();

        markComparisonItem(parentNode).markTwoItem(low, high);

        swap(low, high, parentNode);
        await delay(1200);

        markComparisonItem(parentNode).removeTwoMark(high, low);

        list = Array.from(parentNode.children);
      }

      while (low < high && parseInt(list[low].dataset.value) <= pivotValue) {
        statsDisplay(parentNode).comparisonAdd();

        markComparisonItem(parentNode).markTwoItem(low, pivotIndex);
        await delay(500);
        markComparisonItem(parentNode).removeTwoMark(low, pivotIndex);

        low += 1;
      }

      // 防止出现下标相等时，无用交换的等待
      if (low !== high) {
        statsDisplay(parentNode).swapAdd();

        markComparisonItem(parentNode).markTwoItem(low, high);

        swap(low, high, parentNode);
        await delay(1200);

        markComparisonItem(parentNode).removeTwoMark(high, low);

        list = Array.from(parentNode.children);
      }
    }

    markComparisonItem(parentNode).markPivotItem(low);

    await delay(1500);

    markComparisonItem(parentNode).removeMultipleMark(initLow, initHigh);
    markComparisonItem(parentNode).removePivotMark(low);

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

  function markOneItem(index) {
    const $item = arr[index];
    $item.classList.add('last-item');
  }

  function removeOneMark(index) {
    const $item = arr[index];
    $item.classList.remove('last-item');
  }

  function markPivotItem(index) {
    const $item = arr[index];
    $item.classList.add('pivot-item');
  }

  function removePivotMark(index) {
    const $item = arr[index];
    $item.classList.remove('pivot-item');
  }

  function markTwoItem(index1, index2) {
    const $firstEl = arr[index1];
    const $secondEl = arr[index2];

    $firstEl.classList.add('first-item');
    $secondEl.classList.add('last-item');
  }
  
  function removeTwoMark(index1, index2) {
    const $firstEl = arr[index1];
    const $secondEl = arr[index2];

    $firstEl.classList.remove('first-item');
    $secondEl.classList.remove('last-item');
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
    markOneItem,
    markPivotItem,
    markTwoItem,
    markMultipleItems,
    removeOneMark,
    removePivotMark,
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
  sortInit($quickSortWrapper);

  $container.addEventListener('click', appOnClick, false);
}


appInit();