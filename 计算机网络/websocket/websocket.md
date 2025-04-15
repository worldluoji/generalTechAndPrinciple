# WebSocket
WebSocket 是一种基于 TCP 的应用层协议，用于在客户端和服务器之间建立**全双工、长连接**的实时通信通道。其核心原理如下：

---

### 1. **握手阶段（Handshake）**
WebSocket 连接始于一个 **HTTP 升级请求**，通过以下步骤建立连接：
- **客户端请求**：客户端发送一个 HTTP 请求，头部包含：
  ```http
  GET /chat HTTP/1.1
  Host: example.com
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==  # 随机生成的Base64密钥
  Sec-WebSocket-Version: 13
  ```
- **服务器响应**：若服务器支持 WebSocket，返回 `101 Switching Protocols`：
  ```http
  HTTP/1.1 101 Switching Protocols
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=  # 基于客户端Key生成的验证值
  ```
  - `Sec-WebSocket-Accept` 是客户端 Key 加上固定 GUID 的 SHA-1 哈希值再 Base64 编码的结果，用于验证握手有效性。

---

### 2. **全双工通信**
- **长连接**：握手完成后，TCP 连接保持打开，客户端和服务器可以**双向实时发送数据**，无需重复建立连接。
- **数据帧格式**：数据以**帧（Frame）**的形式传输，每个帧包含：
  - **操作码（Opcode）**：标识数据类型（文本、二进制、控制帧如 Ping/Pong）。
  - **掩码（Mask）**：客户端发送的数据必须掩码处理（防止中间缓存攻击）。
  - **负载长度**：数据内容的长度。
  - **负载数据**：实际传输的内容（文本或二进制）。

---

### 3. **心跳机制（Keep-Alive）**
- **Ping/Pong 帧**：服务器或客户端可发送 `Ping` 帧（检测连接活性），对方需回复 `Pong` 帧。
- **自动断连**：若长时间未收到响应，连接会关闭。

---

### 4. **安全机制**
- **wss 协议**：类似 HTTPS，使用 `wss://` 前缀并通过 TLS 加密传输数据。
- **同源策略**：浏览器限制 WebSocket 连接只能与同源服务器通信（可通过 CORS 配置例外）。

---

### 5. **与传统 HTTP 的区别**
| **特性**         | **WebSocket**                  | **HTTP**                     |
|------------------|--------------------------------|------------------------------|
| 连接方式         | 长连接，全双工                | 短连接，半双工（请求-响应） |
| 协议头           | 自定义帧格式                   | 文本头（如 GET/POST）        |
| 实时性           | 高（低延迟）                  | 低（依赖轮询或长轮询）      |
| 适用场景         | 实时通信（聊天、游戏、推送）  | 静态资源、表单提交等         |

---

### 6. **应用场景**
- **实时聊天**：消息即时收发。
- **在线游戏**：多玩家状态同步。
- **股票行情**：实时价格推送。
- **协同编辑**：多用户实时协作。

---

### 总结
WebSocket 通过一次 HTTP 握手升级为全双工协议，摆脱了传统 HTTP 的请求-响应模式，实现了高效、低延迟的实时通信，成为现代 Web 应用中实时交互的核心技术之一。