import { app, ipcMain, session } from 'electron'
import { setupTray } from './tray.js'
import { createAppWindow } from '@windows/app.js'
import { createNotificationWindow } from '@windows/notification.js'
import { createClientInMain } from '@delight-rpc/electron'
import { createServerInMain } from '@delight-rpc/electron'
import { createAppMainAPI } from './apis/app.js'
import { createNotificationMainAPI } from './apis/notification.js'
import * as DelightRPC from 'delight-rpc'
import { Deferred } from 'extra-promise'
import { openDatabase } from './database.js'
import { IAppRendererAPI, INotificationRendererAPI } from '@src/contract.js'
import { Config } from './config.js'

preventMultipleInstances()

const config = new Config()
await openDatabase()

await app.whenReady()

setCSPHeader()

const {
  window: notificationWindow
, load: loadNotificationWindow
} = createNotificationWindow()
const {
  window: appWindow
, load: loadAppWindow
} = createAppWindow()
setupTray(appWindow)

const notificationRendererClient = new Deferred<DelightRPC.ClientProxy<INotificationRendererAPI>>()
const appRendererClient = new Deferred<DelightRPC.ClientProxy<IAppRendererAPI>>()

ipcMain.on('app-message-port-for-server', async event => {
  const [port] = event.ports
  port.start()
  createServerInMain(
    createAppMainAPI({
      config
    , appRendererAPI: await appRendererClient
    , notificationRendererAPI: await notificationRendererClient
    })
  , port
  )
})

ipcMain.on('notification-message-port-for-server', event => {
  const [port] = event.ports
  port.start()
  createServerInMain(createNotificationMainAPI(notificationWindow), port)
})

ipcMain.on('app-message-port-for-client', async event => {
  const [port] = event.ports
  port.start()
  const [client] = createClientInMain<IAppRendererAPI>(port)
  appRendererClient.resolve(client)
})

ipcMain.on('notification-message-port-for-client', async event => {
  const [port] = event.ports
  port.start()
  const [client] = createClientInMain<INotificationRendererAPI>(port)
  notificationRendererClient.resolve(client)
})

await loadNotificationWindow()
await loadAppWindow()

function preventMultipleInstances(): void {
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) app.exit()
}

/**
 * 为渲染器页面设置CSP header, 以消除相应的Electron警告.
 */
function setCSPHeader(): void {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders
      , 'Content-Security-Policy': [`default-src 'self' 'unsafe-inline'`]
      }
    })
  })
}
