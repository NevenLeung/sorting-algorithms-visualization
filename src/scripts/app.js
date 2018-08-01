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

function swap(firstIndex, lastIndex) {
  const arr = Array.from($list.children);

  const firstEl = arr[firstIndex];
  const lastEl = arr[lastIndex];

  // 节点位置
  const firstTop = firstEl.offsetTop;
  const lastTop = lastEl.offsetTop;

  const diff_Y = Math.abs(firstTop - lastTop);

  // 动画
  const animationKeyframesForFirstEl = [
    { transform: 'translateY(0px)' },
    { transform: `translateY(${diff_Y}px)` }
  ];

  const animationKeyframesForlastEl = [
    { transform: 'translateY(0px)' },
    { transform: `translateY(${-diff_Y}px)` }
  ];

  const animationOption = {
    duration: 1000,
  };

  firstEl.animate(
    animationKeyframesForFirstEl,
    animationOption
  );

  lastEl.animate(
    animationKeyframesForlastEl,
    animationOption
  );

  firstEl.classList.add('first-item');
  lastEl.classList.add('last-item');

  setTimeout(function () {
    //  将前面的节点插入到后面
    if (arr[lastIndex] === $list.lastElementChild) {
      $list.appendChild(arr[firstIndex]);
    } else {
      $list.insertBefore(arr[firstIndex], arr[lastIndex + 1]);
    }

    // 将后面的节点插入到前面
    $list.insertBefore(arr[lastIndex], arr[firstIndex + 1]);

    firstEl.classList.remove('first-item');
    lastEl.classList.remove('last-item');

  }, 999);
}