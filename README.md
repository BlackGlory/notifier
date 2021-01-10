# notify for Electron

## 动机

桌面操作系统的通知功能往往难以使用:
- 不同平台支持的通知功能不同, 使得跨平台API难以成立.
- 一些平台存在着足以影响交互的差异性, 例如Windows 10有着功能丰富的通知API, 却单个应用无法同时显示多个通知.
- 对数据类型有严格限制, 例如一些平台限制了图片的分辨率, 文件大小, 文件类型.
- 一些桌面环境没有实现通知.

为解决这些问题, 创建了这个由Electron实现的通知组件, 该组件通过Web技术为所有支持Electron的平台提供高度一致的通知功能.

## 原理

notify本身是一个Node.js CLI程序, 用于接收stdin里的UniversalNotification.
对于每一个UniversalNotification, CLI都会启用一个Electron实例.

首个启动的实例称为daemon, 负责协调多个通知的显示.
Electron在启动后会检查daemon是否存在, 如果存在, 则通过IPC将UniversalNotification交给daemon.

## 已知问题

- https://github.com/nodejs/node/issues/21825
