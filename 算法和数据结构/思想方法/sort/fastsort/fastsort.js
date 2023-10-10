function quickSort(arr) {
    quickSortPart(arr, 0, arr.length - 1);
}

function quickSortPart(arr, start, end) {
    // 如果区域内的数字少于 2 个，退出递归
    if (start >= end) return;
    // 将数组分区，并获得中间值的下标
    const middle = partition(arr, start, end);
    // 对左边区域快速排序
    quickSortPart(arr, start, middle - 1);
    // 对右边区域快速排序
    quickSortPart(arr, middle + 1, end);
}

// 将 arr 从 start 到 end 分区，左边区域比基数小，右边区域比基数大，然后返回中间值的下标
function partition(arr, start, end) {
    // 取第一个数为基数
    const pivot = arr[start];
    // 从第二个数开始分区
    let left = start + 1;
    // 右边界
    let right = end;
    while (left < right) {
        // 找到第一个大于基数的位置
        while (left < right && arr[left] <= pivot) left++;
        // 找到第一个小于基数的位置
        while (left < right && arr[right] >= pivot) right--;
        // 交换这两个数，使得左边分区都小于或等于基数，右边分区大于或等于基数
        if (left < right) {
            exchange(arr, left, right);
            left++;
            right--;
        }
    }
    // 如果 left 和 right 相等，单独比较 arr[right] 和 pivot
    if (left == right && arr[right] > pivot) right--;
    // 将基数和轴交换
    exchange(arr, start, right);
    return right;
}

function exchange(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

let arr = [7,5,3,4,1,2,6];
quickSort(arr);
console.log(arr);