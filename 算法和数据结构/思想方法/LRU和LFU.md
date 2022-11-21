# LRU和LFU

## LRU（Least Recently Used）
首先丢弃最近最少使用的项目。

## LFU（Least Frequently Used）
从数据集中，挑选最不经常使用的数据淘汰。

## LRU和LFU之间的区别
LRU淘汰的是最久未访问到的数据，而LFU是淘汰的是最不经常使用的数据（若两个或多个数据的使用频率相同时，LFU会再选择最久未访问到的数据淘汰）。

例如，如果缓存大小为3，则数据访问顺序如下：
```
set（2,2），set（1,1），get（2），get（1），get（2），set（3,3），set（4,4）
```
当set(4,4)，LFU算法消除(3,3)，LRU将被淘汰(1,1)。