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