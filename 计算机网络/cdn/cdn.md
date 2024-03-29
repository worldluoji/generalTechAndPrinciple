# cdn
## 1. 网站访问借鉴“就近配送”思路。
无论在哪里上网，临近不远的地方基本上都有数据中心。

可以在这些数据中心里部署几台机器，形成一个缓存的集群来缓存部分数据，那么用户访问数据的时候，就可以就近访问了。
分布在各个地方的各个数据中心的节点，就称为<strong>边缘节点</strong>。

由于边缘节点数目比较多，但是每个集群规模比较小，不可能缓存下来所有东西，因而可能无法命中，
这样就会在边缘节点之上有<strong>区域节点</strong>，规模就要更大，缓存的数据会更多，命中的概率也就更大。
在区域节点之上是<strong>中心节点</strong>，规模更大，缓存数据更多。

如果还不命中，就只好回源网站访问了。

<br>

## 2. CDN 分发系统的架构
CDN 系统的缓存，也是一层一层的，能不访问后端真正的源，就不打扰它。
这也是电商网站物流系统的思路，北京局找不到，找华北局，华北局找不到，再找北方局。

<br>

## 3. CND 推拉
CND可以缓存的东西比较多，比如静态页面，静态图片。
保质期长的日用品比较容易缓存，因为不容易过期。

对于静态页面来讲，内容的分发往往采取拉取的方式，也即当发现未命中的时候，再去上一级进行拉取。

但是，流媒体数据量大，如果出现回源，压力会比较大，所以往往采取主动推送的模式，将热点数据主动推送到边缘节点。

<br>

## 4. 没有 CDN 的情况下访问网址
在没有 CDN 的情况下，用户向浏览器输入 www.web.com 这个域名，客户端访问本地 DNS 服务器的时候，
如果本地 DNS 服务器有缓存，则返回网站的地址；如果没有，递归查询到网站的权威 DNS 服务器，

这个权威 DNS 服务器是负责 web.com 的，它会返回网站的 IP 地址。本地 DNS 服务器缓存下 IP 地址，
将 IP 地址返回，然后客户端直接访问这个 IP 地址，就访问到了这个网站。

<br>

## 5. 有CDN的情况下访问网址
1) 在 web.com 这个权威 DNS 服务器上，会设置一个 CNAME 别名，
指向另外一个域名 www.web.cdn.com，返回给本地 DNS 服务器。

2) 当本地 DNS 服务器拿到这个新的域名时，需要继续解析这个新的域名。
再访问的就不是 web.com 的权威 DNS 服务器了，而是 web.cdn.com 的权威 DNS 服务器，
这是 CDN 自己的权威 DNS 服务器。
在这个服务器上，还是会设置一个 CNAME，指向另外一个域名，
也即 CDN 网络的全局负载均衡器。

3) 接下来，本地 DNS 服务器去请求 CDN 的全局负载均衡器解析域名，
全局负载均衡器会为用户选择一台合适的缓存服务器提供服务，选择的依据包括：
根据用户 IP 地址，判断哪一台服务器距用户最近；
用户所处的运营商；
根据用户所请求的 URL 中携带的内容名称，判断哪一台服务器上有用户所需的内容；
查询各个服务器当前的负载情况，判断哪一台服务器尚有服务能力。

4) 全局负载均衡器会返回一台缓存服务器的 IP 地址。本地 DNS 服务器缓存这个 IP 地址，然后将 IP 返回给客户端，
客户端去访问这个边缘节点，下载资源。缓存服务器响应用户请求，将用户所需内容传送到用户终端。
如果这台缓存服务器上并没有用户想要的内容，那么这台服务器就要向它的上一级缓存服务器请求内容，
直至追溯到网站的源服务器将内容拉到本地。

<br>

## 6. 越近越好
在进入数据中心的时候，我们希望通过最外层接入层的缓存，将大部分静态资源的访问拦在边缘。
而 CDN 则更进一步，将这些静态资源缓存到离用户更近的数据中心。
越接近客户，访问性能越好，时延越低。

<br>

## 7. 预处理
对于流媒体来讲，很多 CDN 还提供<strong>预处理服务</strong>，也即文件在分发之前，经过一定的处理。

例如将视频转换为不同的码流，以适应不同的网络带宽的用户需求；再如对视频进行分片，降低存储压力，
也使得客户端可以选择使用不同的码率加载不同的分片。这就是我们常见的，“我要看超清、标清、流畅等”。

<br>

## 8. 防盗链
HTTP 头的 referer 字段， 当浏览器发送请求的时候，一般会带上 referer，告诉服务器是从哪个页面链接过来的，
服务器基于此可以获得一些信息用于处理。<strong>如果 refer 信息不是来自本站，就阻止访问或者跳到其它链接</strong>。

referer 的机制相对比较容易破解，所以还需要配合其他的机制。一种常用的机制是<strong>时间戳防盗链</strong>:
使用 CDN 的管理员可以在配置界面上，和 CDN 厂商约定一个加密字符串。

客户端取出当前的时间戳，要访问的资源及其路径，连同加密字符串进行签名算法得到一个字符串，然后生成一个下载链接，
带上这个签名字符串和截止时间戳去访问 CDN。

在 CDN 服务端，根据取出过期时间，和当前 CDN 节点时间进行比较，确认请求是否过期。
然后 CDN 服务端有了资源及路径，时间戳，以及约定的加密字符串，根据相同的签名算法计算签名，如果匹配则一致，访问合法，才会将资源返回给客户。

<br>

## 9. 动态cdn
两种模式：

1) 一种为生鲜超市模式，也即边缘计算的模式。既然数据是动态生成的，所以数据的逻辑计算和存储，
也相应的放在边缘的节点。其中定时从源数据那里同步存储的数据，然后在边缘进行计算得到结果。
就像对生鲜的烹饪是动态的，没办法事先做好缓存，因而将生鲜超市放在你家旁边，既能够送货上门，也能够现场烹饪，
也是边缘计算的一种体现。

2) 另一种是冷链运输模式，也即路径优化的模式。数据不是在边缘计算生成的，而是在源站生成的，
但是数据的下发则可以通过 CDN 的网络，对路径进行优化。因为 CDN 节点较多，能够找到离源站很近的边缘节点，
也能找到离用户很近的边缘节点。中间的链路完全由 CDN 来规划，选择一个更加可靠的路径，使用类似专线的方式进行访问。