# fastsort
它的时间复杂度也是 O(nlogn)，但它在时间复杂度为 O(nlogn) 级的几种排序算法中，大多数情况下效率更高，所以快速排序的应用非常广泛。再加上快速排序所采用的分治思想非常实用，使得快速排序深受面试官的青睐，所以掌握快速排序的思想尤为重要。

快速排序算法的基本思想是：
- 从数组中取出一个数，称之为基数（pivot）
- 遍历数组，将比基数大的数字放到它的右边，比基数小的数字放到它的左边。遍历完成后，数组被分成了左右两个区域
- 将左右两个区域视为两个数组，重复前两个步骤，直到排序完成

快速排序的每一次遍历，都将基数摆到了最终位置上。第一轮遍历排好 1 个基数，第二轮遍历排好 2 个基数（每个区域一个基数，但如果某个区域为空，则此轮只能排好一个基数），第三轮遍历排好 4 个基数（同理，最差的情况下，只能排好一个基数），以此类推。

总遍历次数为 logn～n 次，每轮遍历的时间复杂度为 O(n)，所以很容易分析出快速排序的时间复杂度为O(nlogn) ～ O(n^2)，平均时间复杂度为 O(nlogn)。

<br>

## 基本框架
```
// JavaScript
function quickSort(arr) {
    quickSort(arr, 0, arr.length - 1);
}

function quickSort(arr, start, end) {
    // 如果区域内的数字少于 2 个，退出递归
    if (start >= end) return;
    // 将数组分区，并获得中间值的下标
    const middle = partition(arr, start, end);
    // 对左边区域快速排序
    quickSort(arr, start, middle - 1);
    // 对右边区域快速排序
    quickSort(arr, middle + 1, end);
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
function exchange(arr, int i, int j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
```