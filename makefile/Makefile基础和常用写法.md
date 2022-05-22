# Makefile基础和常用写法

## 一个例子说明基本写法
-> hello
```
[going@dev hello]$ make
go build hello.go
[going@dev hello]$ ls
hello  hello.go  Makefile
```
第二次make的时候会显示target已经是最新了，不会重生成
```
[going@dev hello]$ make
make: `hello' is up to date.
[going@dev hello]$ pwd
/home/going/makefile/hello
[going@dev hello]$ ls
hello  hello.go  Makefile
```

## 伪目标
在hello Makefile示例中，我们定义了一个clean目标，这个其实是一个伪目标，也就是说我们不会为该目标生成任何文件。因为伪目标不是文件，make 无法生成它的依赖关系和决定是否要执行它，通常我们需要显式地指明这个目标为伪目标。为了避免和文件重名，在Makefile中可以使用.PHONY来标识一个目标为伪目标：

```
.PHONY: clean
clean:
    rm hello
```

## order-only 依赖
在上面介绍的规则中，只要 prerequisites 中有任何文件发生改变，就会重新构造 target。但是有时候，我们希望只有当 prerequisites 中的部分文件改变时，才重新构造 target。这时，你可以通过 order-only prerequisites 实现。

```
targets : normal-prerequisites | order-only-prerequisites
    command
    ...
    ...
```

在上面的规则中:
- 只有第一次构造 targets 时，才会使用 order-only-prerequisites。后面即使 order-only-prerequisites 发生改变，也不会重新构造 targets
- 只有 normal-prerequisites 中的文件发生改变时，才会重新构造 targets。这里，符号“ | ”后面的 prerequisites 就是 order-only-prerequisites

## 其它语法
### 1. @
很多时候，我们不需要命令行提示make时的命令，因为我们更想看的是命令产生的日志，而不是执行的命令。这时就可以在命令行前加@，禁止 make 输出所执行的命令。
```
.PHONY: test
test:
    @echo "hello world"
```
这里，我建议在命令前都加@符号，禁止打印命令本身，以保证你的 Makefile 输出易于阅读的、有用的信息。

### 2. -
默认情况下，每条命令执行完 make 就会检查其返回码。如果返回成功（返回码为 0），make 就执行下一条指令；如果返回失败（返回码非 0），make 就会终止当前命令。很多时候，命令出错（比如删除了一个不存在的文件）时，我们并不想终止，这时就可以在命令行前加 - 符号，来让 make 忽略命令的出错，以继续执行下一条命令。
```
clean:
    -rm hello.o
```

## 参考资料
- https://github.com/marmotedu/geekbang-go/blob/master/makefile/Makefile基础知识.md
- https://time.geekbang.org/column/article/389115