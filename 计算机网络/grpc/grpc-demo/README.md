# gRPC Demo
## 准备
python 3.13后使用pipx来全局安装grpcio-tools
```bash
% pipx install grpcio-tools
  installed package grpcio-tools 1.73.1, installed using Python 3.13.2
  These apps are now globally available
    - python-grpc-tools-protoc
done! ✨ 🌟 ✨
```
接着执行：
```bash
python-grpc-tools-protoc -I. --python_out=. --grpc_python_out=. helloworld.proto
```
会生成 helloworld_pb2.py 和 helloworld_pb2_grpc.py 两个文件

## 运行
启动server:
```bash
uv run greeter_server.py
```

client调用:
```bash
uv run greeter_client.py
```