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
import { IAppRendererAPI, IConfig, INotificationRendererAPI } from '@src/contract.js'
import { Config } from './config.js'
import { go } from '@blackglory/prelude'
import { migrateConfig } from './migrate.js'

// https://github.com/electron/electron/issues/40719
go(async () => {
  preventMultipleInstances()

  await app.whenReady()

  setCSPHeader()

  await migrateConfig()
  const config = new Config<IConfig>({
    version: app.getVersion()
  , server: {
      hostname: 'localhost'
    , port: 8080
    , running: false
    }
  , silentMode: false
  })
  await openDatabase()

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
    const appMainAPI = createAppMainAPI({
      config
    , appRendererClientPromise: appRendererClient
    , notificationRendererClientPromise: notificationRendererClient
    })
    createServerInMain(appMainAPI, port)

    const { server } = await config.get()
    if (server.running) {
      await appMainAPI.Server.start(server.hostname, server.port)
    }
  })

  ipcMain.on('notification-message-port-for-server', event => {
    const [port] = event.ports
    port.start()
    createServerInMain(createNotificationMainAPI(notificationWindow), port)
  })

  ipcMain.on('app-message-port-for-client', event => {
    const [port] = event.ports
    port.start()
    const [client] = createClientInMain<IAppRendererAPI>(port)
    appRendererClient.resolve(client)
  })

  ipcMain.on('notification-message-port-for-client', event => {
    const [port] = event.ports
    port.start()
    const [client] = createClientInMain<INotificationRendererAPI>(port)
    notificationRendererClient.resolve(client)
  })

  await loadNotificationWindow()
  await loadAppWindow()
})

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
      , 'Content-Security-Policy': `default-src 'self' 'unsafe-inline'; img-src *`
      }
    })
  })
}
