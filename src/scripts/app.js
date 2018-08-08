import '../styles/main.css';

import './utility/polyfills.js';

import { $container, $bubbleSortWrapper, $selectSortWrapper } from "./DOM/DOM-elements.js";
import { createNewElementNode } from "./utility/general-functions.js";
import DOM_OperationModule from './DOM/DOM-operations.js';

const arr = [3, 1, 5, 2, 4];
// const arr = [5, 4, 3, 2, 1];

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
  // let comparisonCounter = 0;
  // let swapCounter = 0;
  let arr = Array.from(parentNode.children);
  for (let i = 0, n = arr.length; i < n; i += 1) {
    for (let j = n - 1; j > i; j -= 1) {
      // 标记正在进行比较的item
      markComparisonItem(j - 1, j, parentNode).mark();
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
        markComparisonItem(j, j - 1, parentNode).removeMark();
      } else {
        // 没有发生交换，按原来的顺序取消应该的样式
        markComparisonItem(j - 1, j, parentNode).removeMark();
      }

    }
  }

  // console.log(`The number of comparison is ${comparisonCounter}.`);
  // console.log(`The number of swapping is ${swapCounter}.`);

  const $showcaseWrapper = DOM_OperationModule.findClosestAncestor(parentNode, '.showcase');
  enableResetButton($showcaseWrapper);
}

async function selectSort(parentNode) {
  let arr = Array.from(parentNode.children);
  for (let i = 0, minIndex, n = arr.length; i < n - 1; i += 1) {
    minIndex = i;

    statsDisplay(parentNode).comparisonAdd();
    for (let j = i + 1; j <= n - 1; j += 1) {
      // 标记正在进行比较的item
      markComparisonItem(minIndex, j, parentNode).mark();
      await delay(500);

      markComparisonItem(minIndex, j, parentNode).removeMark();
      if (parseInt(arr[minIndex].dataset.value) > parseInt(arr[j].dataset.value)) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      markComparisonItem(i, minIndex, parentNode).mark();

      swap(i , minIndex, parentNode);
      await delay(1200);

      arr = Array.from(parentNode.children);

      statsDisplay(parentNode).swapAdd();

      // 发生了交换，则按交换后的顺序取消对应的样式
      markComparisonItem(minIndex, i, parentNode).removeMark();
    } else {
      // 没有发生交换，按原来的顺序取消应该的样式
      // markComparisonItem(i, minIndex, parentNode).removeMark();
    }
  }

  const $showcaseWrapper = DOM_OperationModule.findClosestAncestor(parentNode, '.showcase');
  enableResetButton($showcaseWrapper);
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

function markComparisonItem(index1, index2, parentNode) {
  const arr = Array.from(parentNode.children);

  const $firstEl = arr[index1];
  const $secondEl = arr[index2];

  function mark() {
    $firstEl.classList.add('first-item');
    $secondEl.classList.add('last-item');
  }
  
  function removeMark() {
    $firstEl.classList.remove('first-item');
    $secondEl.classList.remove('last-item');
  }

  return {
    mark,
    removeMark
  }
}

function startSorting($sortingWrapper) {
  if ($sortingWrapper.matches('.bubble-sort')) {
    bubbleSort($sortingWrapper);
  }
  if ($sortingWrapper.matches('.select-sort')) {
    selectSort($sortingWrapper);
  }
}

function playHandler($el) {
  const $showcaseWrapper = DOM_OperationModule.findClosestAncestor($el, '.showcase');
  const $sortingWrapper = DOM_OperationModule.query($showcaseWrapper, '.sorting-wrapper');
  const $resetButton = DOM_OperationModule.query($showcaseWrapper, '.reset-button');

  // hardcoded
  // bubbleSort($sortingWrapper);
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

  $container.addEventListener('click', appOnClick, false);
}


appInit();