# Sorting code used in the project

## Bubble sort (冒泡排序)

### 算法思想

将相邻的两个数值进行比较、交换，逐步让数组变得有序。

```javascript
let arr = [6, 4, 2, 9, 1, 10, 7, 3, 8, 5];

for (let i = 0, n = arr.length, temp; i < n; i += 1) {
  for (let j = n - 1; j > i; j -= 1) {
    // 相邻两个 item 进行比较
    // 如果前面的较大，则对两个 item 进行交换
    if (arr[j - 1] > arr[j]) {
      temp = arr[j - 1];
      arr[j - 1] = arr[j];
      arr[j] = temp;
    }
  }
}

console.log(arr);
```

## Select sort (选择排序)

### 算法思想

找出第 n 次循环可遍历的元素中最小的数值，并把它交换到数组的第 n 个位置。

```javascript
let arr = [6, 4, 2, 9, 1, 10, 7, 3, 8, 5];

for (let i = 0, n = arr.length; i < n - 1; i += 1) {
  let min = i;

  // 在每一轮内层循环中，找出数值最小的下标
  for (let j = i + 1; j <= n - 1; j += 1) {
    if (arr[j] < arr[min]) {
      min = j;
    }
  }

  // 如果 min 不等于初始化时的 i，则把它交换到相应次序的位置
  if (min !== i) {
    let temp = arr[i];
    arr[i] = arr[min];
    arr[min] = temp;
  }
}

console.log(arr);
```

## Insert sort (插入排序)

### 算法思想

将后面小的数值插入到比它大的元素前面，同时比它小的元素后面的位置。

```javascript
let arr = [6, 4, 2, 9, 1, 10, 7, 3, 8, 5];

for (let i = 1, n = arr.length; i <= n - 1; i += 1) {
  // 找到一组相邻的，且前面比后面大的数字
  if (arr[i - 1] > arr[i]) {
    let insertItem = arr[i];
    let j;

    // 将比 insert item 大的数字往后移，以下循环的方向是从右往左
    // 直到遇到一个比 insert item 小的数值，或者已经到了数组的最左边，结束循环
    for (j = i - 1; j >= 0 && arr[j] > insertItem ; j -= 1) {
      arr[j + 1] = arr[j];
    }

    // 将 insert item 插入到循环结束前遍历到的最后一个位置
    // 因为遍历到的位置的数值都往后移了一位，所以循环结束前遍历到的最后一个位置应该是空的（数值是重复的）
    // j 要 +1 是因为上面的循环结束前，运行了一次 j -= 1。因此循环结束后，j 的值比想要的数字少了 1，要把它加上
    arr[j + 1] = insertItem;
  }
}

console.log(arr);
```

## Merge sort (归并排序)

### 算法思想

递归的前半部分，将要排序的数组拆分成尽可能少元素的两部分，直到拆分的数组只有一个元素。  
递归的后半部分，根据两个拆分数组之间的元素大小关系进行排列，然后合并成一个新的数组，并把这个合并好且有序的数组依次返回。

```javascript
let arr = [6, 4, 2, 9, 1, 10, 7, 3, 8, 5];

function mergeSort(arr) {
  const len = arr.length;

  // arr 的长度为 1 时，返回这个 arr
  // 注意最小的 arr 的长度只能为 1，不会为 0，前一次的 arr 的长度只可能是 2 或 3
  if (len < 2) return arr;

  // 将数组分成两部分，利用 js 数组的 slice() 方法获得这两部分数组
  const mid = len / 2;
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];

  while (left.length && right.length) {
    // 这里巧妙地使用了 shift() 方法，将最小的数值从相应的数组头部中移出，然后添加到 result 中
    let min = left[0] <= right[0] ? left.shift() : right.shift();
    result.push(min);
  }

  // 将排序好的 result 作为 mergeSort() 的运算结果返回
  return result.concat(left, right);
}

let result = mergeSort(arr);

console.log(result);
```

## Quick sort (快速排序)

### 算法思想

选择一个数值作为 pivot（枢轴），经过一些步骤，使得位于 pivot 左侧的所有数值都小于 pivot，而位于 pivot 右侧的所有数值都大于 pivot。

```javascript
let arr = [6, 4, 2, 9, 1, 10, 7, 3, 8, 5];

function quickSort(low, high, list) {
  let pivot;

  if (low < high) {
    // 进行排序的是 partition()，
    // quickSort() 通过 partition() 找到 pivot，
    // 不断地将数组越拆越小，直到每一部分数组都有序
    pivot = partition(low, high, list);
 
    quickSort(low, pivot - 1, list);
    quickSort(pivot + 1, high, list);
  }
}

function partition(low, high, list) {
  let pivotValue = list[low];

  while (low < high) {
    while (low < high && list[high] >= pivotValue) {
      high -= 1;
    }
    // 把比 pivot 小的值，与 pivot 的位置进行交换。交换后 pivot 的值，位于 high
    swap(low, high, list);

    while (low < high && list[low] <= pivotValue) {
      low += 1;
    }
    // 把比 pivot 大的值，与 pivot 的位置进行交换。
    // 因为 pivot 的值已经位于 high，所以将两者交换，pivot 又回到了左侧。
    // 如果找不到比 pivot 大的值，low 的位置就会不断向右移动，直到 low === high，退出所有循环
    swap(low, high, list);
  }

  return low;
}

function swap(i, j, list) {
  [list[i], list[j]] = [list[j], list[i]];
}

quickSort(0, arr.length - 1, arr);

console.log(arr);
```
