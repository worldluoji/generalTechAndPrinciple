# homebrew安装
不需要魔法安装：
```shell
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```
可能需要先执行
```shell
xcode-select --install 
```
安装Git等命令行工具。

如果有魔法，直接参考官网：
```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

最后再配置国内镜像源即可。
```shell
git -C "$(brew --repo)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git 
```

---

## references
- https://brew.sh/
- https://zhuanlan.zhihu.com/p/687163530
- https://juejin.cn/post/7589201772134334505