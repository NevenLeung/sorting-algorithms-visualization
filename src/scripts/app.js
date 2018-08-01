const arr = [3, 1, 5, 2, 4];

// bubble sort

for (let i = 0, n = arr.length, temp; i < n; i += 1) {
  for (let j = i + 1; j < n; j += 1) {
    if (arr[i] > arr[j]) {
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
}

console.log(arr);

const $list = document.getElementsByClassName('list')[0];
const button = document.querySelector('.swap-button');

button.addEventListener('click', function () {
  let arr = Array.from($list.children);

  let firstIndex = 0;
  let lastIndex = 4;
  // let lastIndex = arr.length - 1;

  // 要插入到firstIndex所在的位置，需要使用后面一个元素
  // let frontNodeReference = arr[firstIndex + 1];

  // console.log(arr[lastIndex]);
  // console.log($list.lastElementChild);
  // console.log(arr[lastIndex] === $list.lastElementChild);

  //  将前面的节点插入到后面
  if (arr[lastIndex] === $list.lastElementChild) {
    $list.appendChild(arr[firstIndex]);
  } else {
    $list.insertBefore(arr[firstIndex], arr[lastIndex + 1]);
  }

  // 将后面的节点插入到前面
  $list.insertBefore(arr[lastIndex], arr[firstIndex + 1]);

}, false);

function swap(firstIndex, lastIndex) {
  let arr = Array.from($list.children);

  // 动画

  //  将前面的节点插入到后面
  if (arr[lastIndex] === $list.lastElementChild) {
    $list.appendChild(arr[firstIndex]);
  } else {
    $list.insertBefore(arr[firstIndex], arr[lastIndex + 1]);
  }

  // 将后面的节点插入到前面
  $list.insertBefore(arr[lastIndex], arr[firstIndex + 1]);
}