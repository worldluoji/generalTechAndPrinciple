# TCP头各个字段的意义
- 16位端口号：标示该段报文来自哪里（源端口）以及要传给哪个上层协议或应用程序（目的端口）。进行tcp通信时，一般client是通过系统自动选择的临时端口号，而服务器一般是使用知名服务端口号或者自己指定的端口号。
- 32位序号：发送端发出的不同的TCP数据段的序号，数据段在网络传输时，顺序有可能会发生变化。接收端依据序列号按照正确的顺序重组数据。
- 32位确认号：只有ACK标志为1时，确认号字段才有效。确认序列号为成功接受的数据段的序列号加1。
- 4位头部长度：表示tcp头部有多少个32bit字（4字节），因为4位最大值是15，所以最多有15个32bit，也就是60个字节是最大的tcp头部长度。
- 6位标志位：
  - URG：紧急指针是否有效
  - ACK：表示确认号是否有效，携带ack标志的报文段也称确认报文段
  - PSH：提示接收端应用程序应该立即从tcp接受缓冲区中读走数据，为后续接收的数据让出空间
  - RST：表示要求对方重建连接。带RST标志的tcp报文段也叫复位报文段
  - SYN：表示建立一个连接，携带SYN的tcp报文段为同步报文段
  - FIN标志：表示告知对方本端要关闭连接了。
- 16位窗口大小：是TCP流量控制的一个手段，这里说的窗口是指接收通告窗口，它告诉对方本端的tcp接收缓冲区还能容纳多少字节的数据，这样对方就可以控制发送数据的速度。
- 16位校验和：由发送端填充，接收端对tcp报文段执行CRC算法以检验TCP报文段在传输过程中是否损坏。注意这个校验不仅包括tcp头部，也包括数据部分。这也是tcp可靠传输的一个重要保障。
- 16位紧急指针：是一个正的偏移量。它和序号字段的值相加表示最后一个紧急数据的下一字节的序号。因此这个字段是紧急指针相对当前序号的偏移量。不妨称之为紧急便宜，发送紧急数据时会用到这个。
- TCP头部选项：最后一个选项字段是可变长的可选信息，最多包含40字节的数据
