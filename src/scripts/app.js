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

// merge sort

// bug
// function mergeSort(arr, n = arr.length) {
//   let seg, start;
//   let a = arr;
//   let b = [];
//
//   for (seg = 1; seg < n; seg += seg) {
//     for (start = 0; start < n; start += seg + seg) {
//       let low = start;
//       let mid = Math.min(start + seg, n);
//       let high = Math.min(start + seg + seg, n);
//
//       let k = low;
//       let start1 = low, end1 = mid;
//       let start2 = mid, end2 = high;
//       let temp;
//
//       while (start1 < end1 && start2 < end2) {
//         b[k++] = a[start1] < a[start2]? a[start1++]: a[start2++];
//       }
//
//       while (start1 < end1) {
//         b[k++] = a[start1++];
//       }
//
//       while (start2 < end2) {
//         b[k++] = a[start2++];
//       }
//
//       // swap the value
//       // [a, b] = [b, a];
//       temp = a;
//       a = b;
//       b = temp;
//     }
//
//     if (a !== arr) {
//       for (let i = 0; i < n; i++) {
//         b[i] = a[i];
//       }
//       b = a;
//     }
//   }
// }

// bug
// function mergeSort(arr, n = arr.length - 1) {
//   merge(arr, undefined, 0, n);
//
//   function merge(arr = [], reg = [], start, end) {
//     if (start >= end) {
//       return;
//     }
//
//     let len = end - start;
//     let mid = (len / 2) + start;
//     let start1 = start, end1 = end;
//     let start2 = mid + 1, end2 = end;
//
//     merge(arr, reg, start1, end1);
//     merge(arr, reg, start2, end2);
//
//     let k = start;
//
//     while (start1 < end1 && start2 < end2) {
//       reg[k++] = arr[start1] < arr[start2]? arr[start1++]: arr[start2++];
//     }
//
//     while (start1 < end1) {
//       reg[k++] = arr[start1++];
//     }
//
//     while (start2 < end2) {
//       reg[k++] = arr[start2++];
//     }
//
//     for (k = start; k <= end; k++) {
//       arr[k] = reg[k];
//     }
//   }
// }

// function mergeSort(arr) {
//   const len = arr.length;
//   if (len < 2) return arr;
//   const mid = parseInt(len / 2);
//   const left = arr.slice(0, mid);
//   const right = arr.slice(mid);
//
//   return merge(mergeSort(left), mergeSort(right));
//
//   function merge(left, right) {
//     let final = [];
//     while (left.length && right.length) {
//       let item = left[0] <= right[0]? left.shift(): right.shift();
//       final.push(item);
//     }
//
//     return final.concat(left.concat(right));
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
    await delay(800);
    markComparisonItem(parentNode).removeTwoMark(i - 1, i);

    statsDisplay(parentNode).comparisonAdd();
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

      // 由于j的循环是从大到小进行的，因此需要将moving array进行一次翻转，才符合实际的顺序情况
      indexAfterInsert = await insert(i, movingArray.reverse(), parentNode);
      statsDisplay(parentNode).swapAdd();

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