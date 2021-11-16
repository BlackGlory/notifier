# unotifier-desktop

## 动机
该项目通过Electron为桌面平台提供高度一致的通知功能, 其原因在于桌面操作系统的原生通知功能难以使用:
- 不同平台支持的通知功能特性不同, 使得跨平台API难以成立.
- 一些平台存在着足以影响交互的差异性: Windows 10有着功能丰富的通知API, 却无法允许单个应用同时显示多个通知.
- 对数据类型有严格限制: 一些平台限制了图片的分辨率, 文件大小, 文件类型.
- 一些桌面环境没有实现通知.
- Chromium浏览器在大多数平台上取消了它自己设计良好的通知功能, 转而使用差劲的原生功能.

## 原理
unotifier创建一个HTTP服务器, 当它收到POST请求, 且请求正文是一个UniversalNotification时, 弹出通知.

## 开发

```sh
# 在第一个终端里运行
yarn dev

# 在第二个终端里运行
yarn start
```

## 架构
### main进程
该进程负责:
- 创建主窗口.
- 创建通知窗口.
- 建立HTTP服务器.
- 接受来自renderer进程的IPC调用.

### 主窗口renderer进程
该进程负责:
- 显示通知历史记录.
- 配置整个unotifier的行为.
- 接受来自main进程的IPC调用.

### 通知窗口renderer进程
该进程负责:
- 作为通知显示.
- 接受来自main进程的IPC调用.

## 风格
### Chromium
还原Chromium的经典通知, 通知总是在屏幕右下角弹出.

### PlayStation
还原PlayStation风格的通知, 通知总是在屏幕左上角弹出.
