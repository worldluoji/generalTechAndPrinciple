# cfssl使用整理
cfssl 可以用来创建证书。CA 根证书是所有组件共享的，只需要创建一个 CA 证书，后续创建的所有证书都由它签名。

<br>
 
## 1. 安装 cfssl 工具集

cfssl 工具集中包含很多工具，这里我们需要安装 cfssl、cfssljson、cfssl-certinfo，功能如下。
- cfssl：证书签发工具;
- cfssljson：将 cfssl 生成的证书（json 格式）变为文件承载式证书。
<br>

安装步骤<br>
- mkdir -p $HOME/bin/
- wget https://github.com/cloudflare/cfssl/releases/download/v1.6.1/cfssl_1.6.1_linux_amd64 -O $HOME/bin/cfssl
- wget https://github.com/cloudflare/cfssl/releases/download/v1.6.1/cfssljson_1.6.1_linux_amd64 -O $HOME/bin/cfssljson
- wget https://github.com/cloudflare/cfssl/releases/download/v1.6.1/cfssl-certinfo_1.6.1_linux_amd64 -O $HOME/bin/cfssl-certinfo
- chmod +x $HOME/bin/{cfssl,cfssljson,cfssl-certinfo}
<br>

## 2. ca-config.json配置文件
CA 配置文件是用来配置根证书的使用场景 (profile) 和具体参数 (usage、过期时间、服务端认证、客户端认证、加密等)，可以在签名其它证书时用来指定特定场景<br>
```
tee ca-config.json << EOF
{
  "signing": {
    "default": {
      "expiry": "87600h"
    },
    "profiles": {
      "iam": {
        "usages": [
          "signing",
          "key encipherment",
          "server auth",
          "client auth"
        ],
        "expiry": "876000h"
      }
    }
  }
}
EOF
```
<br>

字段意义如下：
- signing：表示该证书可用于签名其它证书（生成的 ca.pem 证书中 CA=TRUE）。
- server auth：表示 client 可以用该证书对 server 提供的证书进行验证。
- client auth：表示 server 可以用该证书对 client 提供的证书进行验证。
- expiry：876000h，证书有效期设置为 100 年。

<br>

## 3. 创建证书签名请求文件
```
tee ca-csr.json << EOF
{
  "CN": "iam-ca",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "CN",
      "ST": "BeiJing",
      "L": "BeiJing",
      "O": "marmotedu",
      "OU": "iam"
    }
  ],
  "ca": {
    "expiry": "876000h"
  }
}
EOF
```
<br>

字段意义如下：
- C：Country，国家。
- ST：State，省份。
- L：Locality (L) or City，城市。
- CN：Common Name，iam-apiserver 从证书中提取该字段作为请求的用户名 (User Name) ，浏览器使用该字段验证网站是否合法。
- O：Organization，iam-apiserver 从证书中提取该字段作为请求用户所属的组 (Group)。
- OU：Company division (or Organization Unit – OU)，部门 / 单位

<br>

还有两点需要我们注意。
- 不同证书 csr 文件的 CN、C、ST、L、O、OU 组合必须不同，否则可能出现 PEER'S CERTIFICATE HAS AN INVALID SIGNATURE 错误。
- 后续创建证书的 csr 文件时，CN、OU 都不相同（C、ST、L、O 相同），以达到区分的目的。

<br>

## 4. 创建 CA 证书和私钥
$ cfssl gencert -initca ca-csr.json | cfssljson -bare ca
$ ls ca*
ca-config.json  ca.csr  ca-csr.json  ca-key.pem  ca.pem
<br>

将会生成:
- ca-key.pem（私钥）  
- ca.pem（根证书）
- ca.csr（证书签名请求），用于交叉签名或重新签名

可以使用certinfo命令查看证书信息：
- cfssl certinfo -cert ca.pem # 查看 cert(证书信息)
- cfssl certinfo -csr ca.csr # 查看 CSR(证书签名请求)信息

## 5. 服务器生成自己的证书（server.pem，包含公钥）和私钥（server-key.pem）
```
$ mkdir newModule
$ cd  newModule

$ tee server.json <<EOF
{
  "CN": "server",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "CN",
      "ST": "ChengDu",
      "L": "ChengDu",
      "O": "marmotedu",
      "OU": "server"
    }
  ],
  "hosts": [
    "127.0.0.1",
    "localhost",
    "iam.server.com"
  ]
}
EOF

$ cfssl gencert -ca=../cert/ca.pem \
  -ca-key=../cert/ca-key.pem \
  -config=../cert/ca-config.json \
  -profile=iam server.json | cfssljson -bare server
```