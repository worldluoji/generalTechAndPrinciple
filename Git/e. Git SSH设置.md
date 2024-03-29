# Git SSH设置
1. 首先，先查看本地是否已经生成过ssh秘钥，其实就是查看用户根目录下面.ssh这个文件, 查看命令$ cd ~/.ssh然后查看这个文件夹下有没有类似***_rsa和***_ras.pub这两个文件，一个是私钥文件，一个是公钥文件。
如果本地没有.ssh这个文件的话，需要新生成一个ssh key，命令如下:
```
ssh-keygen -t rsa -C "*******新注释******"

	-t是设置秘钥类型为rsa;
	-C是提供一个新注释
	具体可见[ssh参数详解](https://www.iteye.com/blog/killer-jok-1853451)
```

2. 进入 .ssh 文件夹下 可以看到有两个文件 id_rsa 和 id_rsa.pub
- id_rsa 这个是你的私钥 需要保密
- id_rsa.pub 这个是你的公钥 需要放到github里面

查看自己的公钥 复制下来,进入到git仓库页面，设置下ssh选项，将之前公钥添加进去；

3. git远程仓库个人设置添加完ssh秘钥后，在本地的git项目文件夹，可以通过以下几种方式ssh连接远程仓库。
通过git命令
```
git remote set-url origin [url]
```
使用 git remote set-url origin [url]命令，直接修改远程仓库为https的地址

或者下面这种
```
git remote rm origin
git remote add origin [url]
```
直接修改.git/config文件
```
vim .git/config
```
手动编辑下[remote “origin”]下面的url变量即可。

<br>

## https与ssh切换总结：

1、从ssh切换至https
```
git remote set-url origin(远程仓库名称) https://email/username/ProjectName.git
```

2、从https切换至ssh
```
git remote set-url origin git@git.zhlh6.cn:worldluoji/elasticsearch.git
```

3、查看当前是ssh还是https
```
git remote -v
```