function mergeSort(arr) {
    if (!arr.length || arr.length < 2) { 
        return;
    }
    let result = new Array(arr.length);
    mergePart(arr, 0, arr.length - 1, result);
    return result;
}

// 对 arr 的 [start, end] 区间归并排序
function mergePart(arr, start, end, result) {
    // 只剩下一个数字，停止拆分
    if (start === end) { 
        return;
    }

    const middle = Math.floor((start + end) / 2);
    // 拆分左边区域，并将归并排序的结果保存到 result 的 [start, middle] 区间
    mergePart(arr, start, middle, result);
    // 拆分右边区域，并将归并排序的结果保存到 result 的 [middle + 1, end] 区间
    mergePart(arr, middle + 1, end, result);
    // 合并左右区域到 result 的 [start, end] 区间
    merge(arr, start, end, result);
}

// 将 result 的 [start, middle] 和 [middle + 1, end] 区间合并
function merge(arr, start, end, result) {
    let end1 = Math.floor((start + end) / 2);
    let start2 = end1 + 1;
    // 用来遍历数组的指针
    let index1 = start;
    let index2 = start2;
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

let arr = [7,4,5,3,2,6,1];
const result = mergeSort(arr);
console.log(result);