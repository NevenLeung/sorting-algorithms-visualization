/**
 * @module  DOM-elements
 *
 * 存放常用的元素节点的模块
 *
 * @export {$container, $bubbleSortWrapper, $selectSortWrapper, $insertSortWrapper, $mergeSortWrapper, $quickSortWrapper}
 *
 */

const $container = document.querySelector('.container');
const $bubbleSortWrapper = document.querySelector('.bubble-sort');
const $selectSortWrapper = document.querySelector('.select-sort');
const $insertSortWrapper = document.querySelector('.insert-sort');
const $mergeSortWrapper = document.querySelector('.merge-sort');
const $quickSortWrapper = document.querySelector('.quick-sort');

export {
  $container,
  $bubbleSortWrapper,
  $selectSortWrapper,
  $insertSortWrapper,
  $mergeSortWrapper,
  $quickSortWrapper
};