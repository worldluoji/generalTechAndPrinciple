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


## 二. 使用rebase操作
如果我们想修改的 Commit Message 不是最近一次的 Commit Message，可以通过 git rebase -i <父 commit ID>命令来修改。
首先说下 rebase 操作是什么，变基 (rebase) 其实是一种 merge 的操作，但是和 merge 不同的是，merge 会保留分支信息，但 rebase 是直接把修改嫁接到你想保留的分支，而把切出去的那个分支的信息全部丢掉了，这样看起来就像从未切过分支一样。

<img src="git rebase.gif" />

例1：
```
$ git checkout dev
$ git rebase master
```
采用 git rebase [basebranch] [topicbranch] 的方式，basebranch是目的分支（即本例的 master 分支），topicbranch是源分支（即本例的 dev 分支），总的意思是将 dev 分支中的修改变基到 master 分支上。这样做能省去你先切换到 dev 分支，再对其执行变基命令的多个步骤。
即等价于：
```
$ git rebase master dev
```
它的原理是首先找到这两个分支（即源分支 dev 和目的分支 master）的最近共同祖先 ，然后源分支 dev 对比当前提交相对于该祖先的历次提交，提取相应的修改并存为临时文件，接着将源分支 dev 指向目标基底 （master）, 最后以此将之前另存为临时文件的修改依序应用，从而产生了新的节点。

最后，回到 master 分支，进行一次快进合并。
```
$ git checkout master
$ git merge dev
```
这样master分支就到了最新的节点。

例2：
```
git rebase -i
```
使用交互式rebase 则有更多的功能(-i 提供交互式操作)，可以细致的操作每一条 commit，这样我们就能合并，修改 commit
```
git rebase -i [start-commit] [end-commit]
# (start-commit, end-commit] 前开后闭区间，默认 end-commit 为当前 HEAD
```

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
输入命令后，会进入交互模式，其中，pick 表示当前的后三次都是使用的。
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
我们要将三个 commit 合并成一个，因此需要应该 pick 第一个 commit，同时将后面两个 commit "压入"第一个 commit 。所以需要将后面两个 commit 从 pick 改为 squash 或者 fixup，然后保存 :wq，如下
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

## 三. git rebase不适用的情况
要使用 git rebase 命令得遵守一条准则：<strong>不要对在你的仓库外有副本的分支执行变基</strong>。
打个比方，你在本地有 master 分支，在远程库有相应的副本 master 分支，这种情况下就不要对本地 master 在最近一次push之前的提交历史执行变基。
变基操作的实质是丢弃一些现有的提交，然后相应地新建一些内容一样但实际上不同的提交（最明显的就是 commit-id 改变了）。 

如果你已经将提交推送至某个仓库，而其他人也已经从该仓库拉取提交并进行了后续工作，
此时，如果你用 git rebase 命令重新整理了提交并再次推送，你的同伴因此将不得不再次将他们手头的工作与你的提交进行整合，
如果接下来你还要拉取并整合他们修改过的提交，事情就会变得一团糟。


## 参考：
1. https://zhuanlan.zhihu.com/p/80506976
2. https://blog.csdn.net/qq_42780289/article/details/98078717