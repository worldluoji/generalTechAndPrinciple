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

<br>


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

<br>

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

<br>

4. git pull的时候，报错：The following untracked working tree files would be overwritten by checkout

解决方法： 执行 git clean -d -fx 即可。

可能很多人都不明白-d，-fx到底是啥意思，其实git clean -d -fx表示：删除 一些 没有 git add 的 文件；
- -n 显示将要删除的文件和目录；
- -x -----删除忽略文件已经对git来说不识别的文件
- -d -----删除未被添加到git的路径中的文件
- -f -----强制运行

建议使用 git clean -d -f

<br>

5. fatal: refusing to merge unrelated histories
如果你是git pull或者git push报fatal: refusing to merge unrelated histories
同理：
```
git pull origin master --allow-unrelated-histories
```
如果有冲突，再解决冲突后提交即可。