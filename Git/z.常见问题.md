# 常见问题
1. 国内总是443超时空
(1) 取消http/https代理再试试
```  
git config --global --unset http.proxy
git config --global --unset https.prox
```

(2) 去 https://www.ipaddress.com/ 输入下面的域名更新hosts
```
185.199.108.153 asserts-cdn.github.com
185.199.109.153 asserts-cdn.github.com
185.199.110.153 asserts-cdn.github.com
185.199.111.153 asserts-cdn.github.com
199.232.69.194 github.global.ssl.fastly.net
185.199.108.133 raw.githubusercontent.com
185.199.109.133 raw.githubusercontent.com
185.199.110.133 raw.githubusercontent.com
185.199.111.133 raw.githubusercontent.com
```
有一种说法是不要配github.com对应的IP，就不会超时

(3) 使用ssh的方式，亲测不容易超时，且不会因为文件大而传输失败。

---


2. git每次提交都输用户名和密码的解决方法:
```
git config credential.helper store 
```                                            
这里没有--global意思是指只对这个仓库生效，建议以后都不要加--global
让代码配置以仓库为单位存储就好，设置成全局不灵活。

设置完成后的第一次push输入用户名和密码后，后续就不用再输入了。

如果用户名和邮箱都配置正确了，报错logon failed
```
git update-git-for-windows
```
更新一下git版本。可能是因为git版本太老了。

---

3.  git push 报如下错误
```
# Enumerating objects: 76, done.
# Counting objects: 100% (76/76), done.
# Delta compression using up to 4 threads
# Compressing objects: 100% (59/59), done.
# Writing objects: 100% (60/60), 808.06 MiB | 10.78 MiB/s, done.
# Total 60 (delta 32), reused 0 (delta 0), pack-reused 0
# error: RPC failed; curl 18 transfer closed with outstanding read data remaining
# send-pack: unexpected disconnect while reading sideband packet
# fatal: the remote end hung up unexpectedly
# Everything up-to-date
```
1）这种情况有可能是缓存过小引起的，我们可以尝试增大缓存（缓存大小根据实际情况设置）
```
git config --global http.postBuffer 1048576000
```
单位是byte

如果传输的文件实在太大，可以试试增大压缩率（压缩率大小根据实际情况设置）
```
git config --global core.compression 3
```

1) 这种情况也可能是网络波动导致的，我们可以尝试取消相关的网络限制
```
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999
```

3）分批次提交
```
git push <远程仓库名称> <commit id>:<远程分支名称>
git push https://github.com/worldluoji/kafka d96757a3732665deba775538f9d49ff33c3666ea:master
```

---

4. git pull的时候，报错：The following untracked working tree files would be overwritten by checkout

解决方法： 执行 git clean -d -fx 即可。

可能很多人都不明白-d，-fx到底是啥意思，其实git clean -d -fx表示：删除 一些 没有 git add 的 文件；
- -n 显示将要删除的文件和目录；
- -x -----删除忽略文件已经对git来说不识别的文件
- -d -----删除未被添加到git的路径中的文件
- -f -----强制运行

建议使用 git clean -d -f

---

5. fatal: refusing to merge unrelated histories

如果你是git pull或者git push报fatal: refusing to merge unrelated histories
同理：
```
git pull origin master --allow-unrelated-histories
```
如果有冲突，再解决冲突后提交即可。

---

6. 密码变更后，本地保存的密码如何更新
```
git config --global --unset credential.helper
```
然后再push代码，会让你重输入用户名和密码，这样就更新了。

---

7. 歧路分支
```
> git pull --tags origin main
From github.com:worldluoji/LLM-Tutorials
 * branch            main       -> FETCH_HEAD
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.
```
你在执行 `git pull --tags origin main` 时遇到的提示，是因为 **本地 `main` 分支和远程 `origin/main` 分支的历史出现了“分叉”（divergent）**，导致 Git 无法自动决定如何合并它们。

## 为什么会发生分叉？

通常有两种情况：

1. **你本地有尚未推送的提交**，同时**远程也有别人推送的新提交**。  
   比如：你本地提交了 A、B，别人推送了 C、D，且这些提交不是简单的线性前后关系（即远程不是你的直接祖先）。

2. **你强制推送或重写了历史**（例如 `git rebase` 后 `--force` 推送），导致本地和远程的历史彻底分叉。

Git 无法自动选择是执行“合并”（merge）还是“变基”（rebase），因此要求你明确指定。

## 如何解决？

### 方法一：直接在本次 pull 命令中指定策略

- **使用合并（merge）**：保留双方历史，产生一个合并提交  
  ```bash
  git pull --no-rebase --tags origin main
  ```
  等价于 `git fetch + git merge`

- **使用变基（rebase）**：将本地提交“移动”到远程提交之后，保持线性历史  
  ```bash
  git pull --rebase --tags origin main
  ```
  等价于 `git fetch + git rebase`

- **仅允许快进（fast-forward only）**：如果不能快进就报错（可用来避免意外合并）  
  ```bash
  git pull --ff-only --tags origin main
  ```

### 方法二：设置全局或仓库级别的默认行为（避免每次指定）

根据你的工作习惯，选择一个默认策略：

```bash
# 默认使用 merge（产生合并提交）
git config --global pull.rebase false

# 默认使用 rebase（保持线性历史）
git config --global pull.rebase true

# 默认仅快进，若不能快进则报错
git config --global pull.ff only
```

之后直接运行 `git pull --tags origin main` 就会按默认行为执行。

### 方法三：先 fetch，再手动处理

```bash
git fetch origin main
git status   # 查看本地与远程的差异
# 然后手动 merge 或 rebase
git merge origin/main   # 或 git rebase origin/main
```

## 注意事项

- **`--tags` 选项**：会同时拉取所有标签，但不影响分支分叉的解决逻辑。
- 如果分叉是因为你**本地有未推送的提交**，使用 `--rebase` 通常能保持历史整洁；如果你希望明确记录分支合并点，使用 `--no-rebase`。
- 如果分叉是因为你**意外重写了历史**，可能需要 `--force` 推送，但务必谨慎（避免覆盖他人工作）。

## 快速推荐

- 如果你是**单人开发**或**希望历史干净**：  
  ```bash
  git pull --rebase --tags origin main
  ```
- 如果你是**协作开发且希望保留分支合并痕迹**：  
  ```bash
  git pull --no-rebase --tags origin main
  ```

执行前可以先运行 `git log --oneline --graph --all` 查看分叉情况，确认后再选择合适策略。