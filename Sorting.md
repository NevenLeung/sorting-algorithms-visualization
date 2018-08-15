# Sorting code used in the project

## Bubble sort (冒泡排序)

```javascript
let arr = [6, 4, 2, 9, 1, 10, 7, 3, 8, 5];

for (let i = 0, n = arr.length, temp; i < n; i += 1) {
  for (let j = n - 1; j > i; j -= 1) {
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

```javascript
let arr = [6, 4, 2, 9, 1, 10, 7, 3, 8, 5];

for (let i = 0, n = arr.length; i < n - 1; i += 1) {
  let min = i;
  for (let j = i + 1; j <= n - 1; j += 1) {
    if (arr[min] > arr[j]) {
      min = j;
    }
  }
  if (min !== i) {
    let temp = arr[i];
    arr[i] = arr[min];
    arr[min] = temp;
  }
}

console.log(arr);
```

## Insert sort (插入排序)

```javascript
let arr = [6, 4, 2, 9, 1, 10, 7, 3, 8, 5];

for (let i = 1, n = arr.length; i <= n - 1; i += 1) {
  if (arr[i - 1] > arr[i]) {
    let insertItem = arr[i];
    let j;

    for (j = i - 1; j >= 0 && insertItem < arr[j] ; j -= 1) {
      arr[j + 1] = arr[j];
    }

    arr[j + 1] = insertItem;
  }
}

console.log(arr);
```

## Merge sort (归并排序)

```javascript
let arr = [6, 4, 2, 9, 1, 10, 7, 3, 8, 5];

function mergeSort(arr) {
  const len = arr.length;
  if (len < 2) return arr;
  const mid = len / 2;
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return merge(mergeSort(left), mergeSort(right));

  function merge(left, right) {
    let result = [];
    while (left.length && right.length) {
      let min = left[0] <= right[0]? left.shift(): right.shift();
      result.push(min);
    }

    return result.concat(left, right);
  }
}

let result = mergeSort(arr);

console.log(result);
```

## Quick sort (快速排序)

```javascript
let arr = [6, 4, 2, 9, 1, 10, 7, 3, 8, 5];

function swap(i, j, list) {
  [list[i], list[j]] = [list[j], list[i]];
}

function partition(low, high, list) {

  let pivotValue = list[low];
  while (low < high) {
    while (low < high && list[high] >= pivotValue) {
      high -= 1;
    }
    swap(low, high, list);
    while (low < high && list[low] <= pivotValue) {
      low += 1;
    }
    swap(low, high, list);
  }

  return low;
}

function quickSort(low, high, list) {
  let pivot;
  if (low < high) {
    pivot = partition(low, high, list);
    quickSort(low, pivot - 1, list);
    quickSort(pivot + 1, high, list);
  }
}

quickSort(0, arr.length - 1, arr);

console.log(arr);
```