# git rebase
我们在本地开发的过程中，常常会有一些语义不清的提交，比如 
```
git commit -m 'save'
```
但是当我们 push 到 origin 的时候会期望改为一些有实际意义的 commit message，
比如本来应该为：
```
git commit -m 'fix: timestamp bug'
```
解决这个问题有两种方式：

1. git commit --amend
2. git rebase -i


## 一.  使用 git commit --amend 直接修改上一次的 commit message
```
git commit --amend  # 进入交互模式修改
git commit --amend -m 'new commit message' # 直接修改上一次 commit
```
需要注意：
这是用一个新的 commit 来替换掉原来的 commit，所以 commit ID 会发生变化。
不要修改已经 push 的 commit，除非你是在自己的分支。


## 二. git rebase
如果我们想修改的 Commit Message 不是最近一次的 Commit Message，可以通过 git rebase -i <父 commit ID>命令来修改。

快递送货 vs 整理书架：
- git pull（默认merge）就像快递送货上门——直接把别人的更新打包塞进你的仓库，保留原始提交痕迹；
- git rebase则像整理书架——把你的修改"挪到"最新代码基础上，让历史记录像一本连贯的书，没有突兀的插入痕迹5。

在 Git 中，`git rebase`主要有以下一些使用场景：

**1、保持线性提交历史**

当多个开发者在一个分支上工作时，可能会出现多个提交交错的情况，使得提交历史看起来比较杂乱。使用`git rebase`可以将一个分支的提交历史整理成线性的。比如你在一个功能分支上进行开发，期间主分支也有新的提交，当你准备将功能分支合并到主分支时，可以先在功能分支上执行`git rebase master`，这样功能分支上的提交就会基于主分支的最新提交重新排列，使得提交历史更加清晰。

**2、整理个人提交历史**

在你自己进行开发时，如果在短时间内进行了多次小的提交，这些提交可能会使提交历史看起来很琐碎。你可以使用`git rebase -i`进行交互式变基，将多个小提交合并成一个有意义的提交，或者重新排列提交的顺序以更好地反映开发过程。

例如，你在开发一个新功能时，先提交了一个初步的实现，然后又进行了一些小的修改和调试提交，最后功能完成。你可以使用交互式变基将这些提交整理为一个清晰的提交，描述整个功能的实现。

**3、处理合并冲突**

有时候在合并分支时可能会出现复杂的冲突。如果使用`git merge`出现冲突，解决冲突后提交可能会留下一个合并提交记录。而使用`git rebase`可以在遇到冲突时逐个解决每个提交的冲突，最终得到一个更干净的提交历史，没有额外的合并提交。

比如，你从主分支拉取了一个新的分支进行开发，期间主分支又有了新的提交。当你准备将开发分支合并回主分支时，如果使用`git merge`出现了很多冲突，那么可以尝试使用`git rebase master`，这样可以在每个提交点上分别解决冲突，使得合并过程更加可控。

简单来讲，合并本地其他分支，为了不产生多余的分叉及合并记录时可以使用rebase

<img src="./pics/git rebase.gif" />

例1：基分支变更时（一般是master），重新让特性分支基于最新的基分支
```
$ git checkout dev
$ git rebase master
```
采用 git rebase [basebranch] [topicbranch] 的方式，basebranch是目的分支（即本例的 master 分支），topicbranch是源分支（即本例的 dev 分支），总的意思是将 dev 分支中的修改变基到 master 分支上。这样做能省去你先切换到 dev 分支，再对其执行变基命令的多个步骤。
即等价于：
```
$ git rebase master dev
```
它的原理是首先找到这两个分支（即源分支 dev 和目的分支 master）的最近共同祖先 ，然后源分支 dev 对比当前提交相对于该祖先的历次提交，
提取相应的修改并存为临时文件，接着将源分支 dev 指向目标基底 （master）, 最后依次将之前另存为临时文件的修改依序应用，从而产生了新的节点。
```
原始状态：
A---B---C  feature  ← 你的分支（基于B开发）
/
D---E---F---G    main   ← 主分支

执行 git rebase main 后：
A'---B'---C'  feature  ← 你的提交被"重放"到G之后
/
D---E---F---G    main
```
- 不是简单复制：你的提交A/B/C会被重新应用到main最新提交G上，形成新提交A'/B'/C'（哈希值已变）4。
- 冲突处理：若你的修改与main冲突，需逐个解决（如先解决A与G冲突生成A'，再用A'解决B冲突生成B'）3。
- 基底变更：feature分支的"起点"从B变成了G，后续开发都基于最新代码

最后，回到 master 分支，进行一次快进合并。
```
$ git checkout master
$ git merge dev
```
这样master分支就到了最新的节点。rebase后的commit记录，会把master的提交记录放在dev的提交记录前面。

---

例2：交互式合并多个commit为1个
```
git rebase -i [startpoint] [endpoint]
# startpoint不包含，endpoint包含，前开后闭区间
# endpoint可以没有，则默认为当前分支的HEAD
```
使用交互式rebase 则有更多的功能(-i 提供交互式操作)，可以细致的操作每一条 commit，这样我们就能合并，修改 commit

假如我们一共有四次提交，如下
```
commit b95a1b0d2fbc2210aeffd80cbd521fbdf019d0be (HEAD -> master)
Author: N
Date:   Mon May 27 18:49:00 2019 +0800

    4th commit

commit 295fadd3680a8909220a73ab37703113eff00d44
Author: N
Date:   Mon May 27 18:48:29 2019 +0800

    third commit

commit e96c3419b9edb337d24861906de562430dc974db
Author: N
Date:   Mon May 27 18:48:00 2019 +0800

    second commit

commit da629ffe1dc0d22c418b7e60a4a804b42ab4a313
Author: N
Date:   Mon May 27 18:47:30 2019 +0800

    first commit
```
如果我们想合并后三次 (2, 3, 4) 提交，那么 start-commit 应该为第一个 commit ID （前开后闭区间）。
输入命令后，会进入交互模式。
```
> git rebase -i da629ffe1dc0d22c418b7e60a4a804b42ab4a313 #(第一次提交的 commit ID)
----------------------------
pick e96c341 second commit
pick 295fadd third commit
pick b95a1b0 4th commit
```
下面的内容同时也会出现，提示你应该将 commit 置为哪种状态。
```
# Commands:
# 用这个 commit
# p, pick <commit> = use commit
# 修改 message
# r, reword <commit> = use commit, but edit the commit message 
# 停下来，修改内容
# e, edit <commit> = use commit, but stop for amending 
# 合并
# s, squash <commit> = use commit, but meld into previous commit
# 合并且抛弃 message
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# 抛弃这个 commit
# d, drop <commit> = remove commit 
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```
我们要将三个 commit 合并成一个，因此需要应该 pick 第一个 commit，同时将后面两个 commit "压入"第一个 commit 。
所以需要将后面两个 commit 从 pick 改为 squash 或者 fixup，然后保存 :wq，如下
```
pick e96c341 second commit
f 295fadd third commit
f b95a1b0 4th commit
```
结果只剩下两个 commit，大功告成！

如果想要修改 commti message，可以在这一步之后再使用 git commit --amend ，或者在使用r指令修改message
```
# 修改 message
# r, reword <commit> = use commit, but edit the commit message 
commit 521bea075647a6e0a0d34d4f6df288bfda9353ad (HEAD -> master)
Author: N
Date:   Mon May 27 18:48:00 2019 +0800

	second commit

commit da629ffe1dc0d22c418b7e60a4a804b42ab4a313
Author: N
Date:   Mon May 27 18:47:30 2019 +0800

	first commit
```

例3: 交互式变基（压缩/修改历史提交）
```
git rebase -i HEAD～3
```
- 操作：将最近3个提交合并为1个、修改提交信息或删除冗余提交6。
- 适用：提交PR前"美化"历史，提升代码审查体验。


其它常用命令：
```
# 继续之前的rebase： 如果需要解决冲突等原因跳出rebase过程后，还想继续刚才的rebase
git rebase --continue

# 退出rebase
git rebase --abort

# 继续编辑rebase动作
git rebase --edit-todo
```

---

## 三. git rebase不适用的情况
在多人协作的项目中使用 `git rebase` 需要格外谨慎。

**1、避免混乱的重要性**

在多人协作的环境中，大家通常基于共同的分支进行开发和协作。如果随意对已经推送到共享仓库且其他人正在使用的分支进行变基，就会打乱整个团队的开发节奏。因为变基会改变提交的顺序和 commit-id，这对于其他开发者来说是非常困惑的。他们可能会难以理解提交历史的变化，也难以将自己的工作与变基后的分支进行整合。

**2、团队沟通与协作规范**

为了避免因不当使用 `git rebase` 带来的麻烦，团队应该建立明确的协作规范。例如，明确规定只有在特定情况下（如在尚未推送的本地分支上）才可以使用变基操作。同时，团队成员之间也应该加强沟通，在进行可能影响到其他人的操作之前，先与相关人员进行协商，确保不会给整个团队带来不必要的困扰。

**3、替代方案与谨慎决策**

如果在多人协作项目中确实需要整理提交历史，可以考虑其他相对安全的方法。例如，使用 `git merge` 进行合并操作，虽然可能会留下一些合并提交记录，但相对来说更加稳定和安全。在决定是否使用 `git rebase` 时，一定要充分考虑到对整个团队的影响，权衡利弊后做出谨慎的决策。

总之，"Rebase重写历史，Merge保留痕迹；本地整理用rebase，团队协作用merge"

---

## 参考：
1. https://zhuanlan.zhihu.com/p/80506976
2. https://blog.csdn.net/qq_42780289/article/details/98078717