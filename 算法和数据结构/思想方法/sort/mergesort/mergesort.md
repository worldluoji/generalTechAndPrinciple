# merge sort
如果两个数组是有序的，要将两个数组中的数拉通牌组, 只要开辟一个长度等同于两个数组长度之和的新数组，并使用两个指针来遍历原有的两个数组，不断将较小的数字添加到新数组中，并移动对应的指针即可。

通过分治的思路，将 1 个数字组成的有序数组合并成一个包含 2 个数字的有序数组，再将 2 个数字组成的有序数组合并成包含 4 个数字的有序数组...直到整个数组排序完成，这就是归并排序（Merge Sort）的思想。

归并排序的复杂度比较容易分析，拆分数组的过程中，会将数组拆分 logn 次，每层执行的比较次数都约等于 n 次，所以时间复杂度是 
O(nlogn)。

空间复杂度是 
O(n)，主要占用空间的就是我们在排序前创建的长度为 n 的 result 数组。

归并排序是一种稳定的排序算法

<br>

## 优化

为了减少在递归过程中不断开辟空间的问题，我们可以在归并排序之前，先开辟出一个临时空间，在递归过程中统一使用此空间进行归并即可。

```
function mergeSort(arr) {
    if (arr.length == 0) return;
    let result = new Array(arr.length);
    mergeSort(arr, 0, arr.length - 1, result);
}

// 对 arr 的 [start, end] 区间归并排序
function mergeSort(arr, start, end, result) {
    // 只剩下一个数字，停止拆分
    if (start == end) return;
    const middle = (start + end) / 2;
    // 拆分左边区域，并将归并排序的结果保存到 result 的 [start, middle] 区间
    mergeSort(arr, start, middle, result);
    // 拆分右边区域，并将归并排序的结果保存到 result 的 [middle + 1, end] 区间
    mergeSort(arr, middle + 1, end, result);
    // 合并左右区域到 result 的 [start, end] 区间
    merge(arr, start, end, result);
}

// 将 result 的 [start, middle] 和 [middle + 1, end] 区间合并
function merge(arr, start, end, result) {
    int end1 = (start + end) / 2;
    int start2 = end1 + 1;
    // 用来遍历数组的指针
    int index1 = start;
    int index2 = start2;
    while (index1 <= end1 && index2 <= end) {
        if (arr[index1] <= arr[index2]) {
            result[index1 + index2 - start2] = arr[index1++];
        } else {
            result[index1 + index2 - start2] = arr[index2++];
        }
    }
    // 将剩余数字补到结果数组之后
    while (index1 <= end1) {
        result[index1 + index2 - start2] = arr[index1++];
    }
    while (index2 <= end) {
        result[index1 + index2 - start2] = arr[index2++];
    }
    // 将 result 操作区间的数字拷贝到 arr 数组中，以便下次比较
    while (start <= end) {
        arr[start] = result[start++];
    }
}
```

