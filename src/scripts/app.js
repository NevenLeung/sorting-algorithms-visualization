import '../styles/main.css';

import './polyfills.js';

import { bubbleSortWrapper } from "./dom-elements.js";
import { createNewElementNode } from "./general-methods.js";
import domOperationWrapper from './dom-operations.js';

const domOperationModule = domOperationWrapper();

// const arr = [3, 1, 5, 2, 4];
const arr = [5, 4, 3, 2, 1];

// for (let i = 0, n = arr.length, temp; i < n; i += 1) {
//   for (let j = n - 1; j > i; j -= 1) {
//     if (arr[j - 1] > arr[j]) {
//       temp = arr[j - 1];
//       arr[j - 1] = arr[j];
//       arr[j] = temp;
//     }
//   }
// }

function sortInit(parentNode) {
  arr.forEach(n => {
    const childNode = createNewElementNode('div', 'item', n, 'data-value', n);
    childNode.style.height = `${n * 20}px`;

    parentNode.appendChild(childNode);
  });
}

// bubble sort
async function bubbleSort(parentNode) {
  let comparisonCounter = 0;
  let swapCounter = 0;
  let arr = Array.from(parentNode.children);
  for (let i = 0, n = arr.length; i < n; i += 1) {
    for (let j = n - 1; j > i; j -= 1) {
      // todo 标记正在进行比较的item
      // await delay(500);

      if (parseInt(arr[j - 1].dataset.value) > parseInt(arr[j].dataset.value)) {
        swap(j - 1, j, parentNode);
        await delay(1200);

        arr = Array.from(parentNode.children);

        swapCounter += 1;
      }

      comparisonCounter += 1;
    }
  }

  console.log(`The number of comparison is ${comparisonCounter}.`);
  console.log(`The number of swapping is ${swapCounter}.`);

  const showcaseWrapper = domOperationModule.findClosestAncestor(parentNode, '.showcase');
  enableResetButton(showcaseWrapper);
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

  // 左右交换动画
  const animationKeyframesForFirstEl = [
    { transform: 'translateX(0px)' },
    { transform: `translateX(${diff_X}px)` }
  ];

  const animationKeyframesForLastEl = [
    { transform: 'translateX(0px)' },
    { transform: `translateX(${-diff_X}px)` }
  ];

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

  firstEl.classList.add('first-item');
  lastEl.classList.add('last-item');

  animation1.onfinish = function () {
    //  将前面的节点插入到后面
    if (arr[lastIndex] === parentNode.lastElementChild) {
      parentNode.appendChild(arr[firstIndex]);
    } else {
      parentNode.insertBefore(arr[firstIndex], arr[lastIndex + 1]);
    }

    firstEl.classList.remove('first-item');
  };

  animation2.onfinish = function () {
    // 将后面的节点插入到前面
    parentNode.insertBefore(arr[lastIndex], arr[firstIndex + 1]);

    lastEl.classList.remove('last-item');
  }
}

function reset(parentNode) {
  const arr = Array.from(parentNode.children);
  arr.forEach(child => {
    parentNode.removeChild(child);
  });
}

function playHandler(e) {
  const el = e.target;
  const showcaseWrapper = domOperationModule.findClosestAncestor(el, '.showcase');
  const sortingWrapper = domOperationModule.query(showcaseWrapper, '.sorting-wrapper');
  const resetButton = domOperationModule.query(showcaseWrapper, '.reset-button');

  // hardcoded
  bubbleSort(sortingWrapper);
  // 在动画开始时，禁止点击start和reset按钮
  el.setAttribute('disabled', 'true');
  resetButton.setAttribute('disabled', 'true');

}

function resetHandler(e) {
  const el = e.target;
  const showcaseWrapper = domOperationModule.findClosestAncestor(el, '.showcase');
  const sortingWrapper = domOperationModule.query(showcaseWrapper, '.sorting-wrapper');
  const startButton = domOperationModule.query(showcaseWrapper, '.start-button');

  reset(sortingWrapper);
  sortInit(sortingWrapper);

  // 重置后可点击start按钮
  startButton.removeAttribute('disabled');
  el.setAttribute('disabled', 'true');
}

function enableResetButton(showcaseWrapper) {
  const resetButton = domOperationModule.query(showcaseWrapper, '.reset-button');
  resetButton.removeAttribute('disabled');
}


const startSortingButton = document.querySelector('.start-button');
const resetSortingButton = document.querySelector('.reset-button');

startSortingButton.addEventListener('click', playHandler);
resetSortingButton.addEventListener('click', resetHandler);

sortInit(bubbleSortWrapper);