import { app, ipcMain } from 'electron'
import { go } from '@blackglory/prelude'
import { setupTray } from './tray.js'
import { createAppWindow } from '@windows/app.js'
import { createNotificationWindow } from '@windows/notification.js'
import reloader from 'electron-reloader'
import isDev from 'electron-is-dev'
import { createClientInMain } from '@delight-rpc/electron'
import { createServerInMain } from '@delight-rpc/electron'
import { createAppMainAPI } from './apis/app.js'
import { createNotificationMainAPI } from './apis/notification.js'
import * as DelightRPC from 'delight-rpc'
import { Deferred } from 'extra-promise'
import { initConfig } from './config.js'
import { openDatabase } from './database.js'
import { IAppRendererAPI, INotificationRendererAPI } from '@src/contract.js'

go(async () => {
  setAutoReload(isDev)
  preventMultipleInstances()

  initConfig()
  openDatabase()

  await app.whenReady()

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
        appRendererAPI: await appRendererClient
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
})

function setAutoReload(value: boolean) {
  if (value) {
    reloader(module, { watchRenderer: false })
  }
}

function preventMultipleInstances() {
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) app.exit()
}
