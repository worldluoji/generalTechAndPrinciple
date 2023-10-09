# topK 问题思路
给定一个整数数组 nums 和一个整数 k ，请返回其中出现频率前 k 高的元素。可以按 任意顺序 返回答案。

例子：
```
输入: nums = [1,1,1,2,2,3], k = 2
输出: [1,2]
```

思路：
- 1. 用map把各个数字出现的次数存起来
- 2. 建立窗口，长度为k，遍历map，如果新进窗口的元素出现的次数 > 窗口内元素的最小次数，就替换调。
```
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {
    let m = new Map();
    for (let num of nums) {
        if (m.has(num)) {
            m.set(num, m.get(num) + 1);
        } else {
            m.set(num, 1);
        }
    }
    let res = [];
    for (let entry of m.entries()) {
        if (res.length < k) {
            res.push(entry);
        } else {
            res.sort((e1, e2) => e2[1] - e1[1]);
            if (entry[1] > res[k-1][1]) {
                res[k - 1] = entry;
            }
        }
    }

    return res.map(r => r[0]);
};
```

优化： 窗口中k个元素，新进元素时，每一次都遍历k个元素会影响性能，这里可以用“最小堆”，加快查询速度。
因为堆的大小至多为 k，因此每次堆操作需要 O(log⁡k) 的时间。