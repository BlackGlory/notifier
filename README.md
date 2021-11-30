# unotifier-desktop
## 动机
该项目通过Electron为桌面平台提供一致的通知功能, 因为桌面操作系统的原生通知功能大多难以使用:
- 不同平台支持的通知功能特性不同, 使得跨平台的API接口难以建立.
- 一些平台存在着严重影响交互性的差异.
- 一些桌面环境没有实现通知.

## 原理
unotifier-desktop创建一个HTTP API服务器, 其他程序通过向服务器发送请求来发出通知.

## API
### notify
`POST /`

发出通知.

要求payload是一个合法的由JSON表示的[UniversalNotification]对象或[UniversalNotification]数组.
通知的发出者可以通过可选的请求头`X-Sender-Id`表明自己的身份.

[UniversalNotification]: https://github.com/UniversalNotification/spec

## 开发
```sh
# 在第一个终端里运行
yarn dev

# 在第二个终端里运行
yarn start
```

## 打包
```sh
yarn clean
yarn build
yarn package
```

## 架构
### Main
功能性职责:
- 建立HTTP服务器.

### App Renderer
功能性职责:
- 提供非持久化的通知历史记录.
- 提供用于设置main行为的用户界面.

### Notification Renderer
功能性职责:
- 显示即时通知.
