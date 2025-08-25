from werkzeug.wrappers import Request, Response
from werkzeug.serving import run_simple
from jsonrpc import JSONRPCResponseManager, dispatcher

# 注册一个远程方法：echo
# 被 @dispatcher.add_method 装饰的函数会成为可远程调用的方法
@dispatcher.add_method
def echo(text):
    return f"Echo: {text}"

# 注册另一个方法：加法
@dispatcher.add_method
def add(a, b):
    return a + b

@dispatcher.add_method
def add2(**kwargs):
    a = kwargs.get('a', 0)
    b = kwargs.get('b', 0)
    return a + b

# 创建一个简单的 WSGI 应用来处理 HTTP 请求
@Request.application
def application(request):
    # 将 HTTP 请求中的数据传递给 JSONRPCResponseManager
    response = JSONRPCResponseManager.handle(
        request.get_data(cache=False, as_text=True), dispatcher
    )
    return Response(response.json, mimetype='application/json')

if __name__ == '__main__':
    # 在本地 8988 端口运行服务器
    run_simple('localhost', 8988, application)