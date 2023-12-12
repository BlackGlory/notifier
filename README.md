# Notifier
该项目通过Electron为桌面平台提供一致的通知功能.
Notifier创建一个本地的HTTP API服务器, 其他本地程序可以通过向服务器发送请求来发出通知.

## API
### notify
`POST /`

向Notifier发出通知.

请求的payload必须是以JSON表示的INotification对象或INotification数组:
```ts
interface INotification {
  title?: string | null
  message?: string | null
  iconUrl?: string | null
  imageUrl?: string | null
  url?: string | null

  // 其他成员将被Notifier忽略
  [name: string]: JSONValue
}
```

#### Example
curl
```sh
curl \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{ "message": "Hello World" }' \
  "http://localhost:8080"
```

JavaScript
```ts
await fetch('http://localhost:8080', {
  method: 'POST'
, headers: { 'Content-Type': 'application/json' }
, body: JSON.stringify({ message: 'hello world' })
})
```

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
