import requests
import json

# 服务器地址
url = "http://localhost:8988/jsonrpc"

# 构建一个 JSON-RPC 请求的头部
headers = {'content-type': 'application/json'}

# 示例 1: 调用 echo 方法
payload = {
    "jsonrpc": "2.0",
    "method": "echo",
    "params": ["Hello World!"],
    "id": 1
}
response = requests.post(
    url, data=json.dumps(payload), headers=headers
).json()
print(f"Response for 'echo': {response}")

# 示例 2: 调用 add 方法
payload = {
    "jsonrpc": "2.0",
    "method": "add",
    "params": [5, 3],
    "id": 2
}
response = requests.post(
    url, data=json.dumps(payload), headers=headers
).json()
print(f"Response for 'add': {response}")

# 示例 3: 调用一个不存在的方法，会触发错误
payload = {
    "jsonrpc": "2.0",
    "method": "does_not_exist",
    "params": [],
    "id": 3
}
response = requests.post(
    url, data=json.dumps(payload), headers=headers
).json()
print(f"Response for error: {response}")


# 示例4: 使用命名参数（对象）而不是位置参数（数组）
payload = {
    "jsonrpc": "2.0",
    "method": "add2",
    "params": {"a": 10, "b": 5}, # 参数是一个对象
    "id": 4
}
response = requests.post(
    url, data=json.dumps(payload), headers=headers
).json()
print(f"Response for named params 'add2': {response}")