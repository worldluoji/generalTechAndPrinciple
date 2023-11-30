# toml
.toml是一种文件扩展名，通常用于存储配置信息。
这种文件格式是由Tom's Obvious, Minimal Language（TOML）定义的，它是一种用于存储配置数据的简单、易于阅读和编辑的文本格式。

TOML文件通常用于配置应用程序、软件包、服务等，可以包含各种配置参数，例如设置环境变量、指定数据库连接信息、定义用户凭据等。

.toml文件通常以键值对的形式存储配置数据，例如：
```
[database]  
host = "localhost"  
port = 3306  
username = "admin"  
password = "password"
```
在这个例子中，database是一个配置项，它的子项包括host、port、username和password。
每个子项都有一个对应的值，值可以是字符串、数字、布尔值或其他数据类型。

使用.toml文件可以方便地管理和维护配置数据，因为它是一种文本格式，可以很容易地使用文本编辑器进行编辑和查看。
同时，由于TOML语法简单、直观，即使是非技术用户也可以轻松地编辑.toml文件。