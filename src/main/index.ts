import { app, ipcMain } from 'electron'
import { go } from '@blackglory/go'
import { setupTray } from './tray'
import { createAppWindow } from '@windows/app'
import { createNotificationWindow } from '@windows/notification'
import reloader from 'electron-reloader'
import isDev from 'electron-is-dev'
import { createClientInMain } from '@delight-rpc/electron'
import { createServerInMain } from '@delight-rpc/electron'
import { createAppMainAPI } from './apis/app'
import { createNotificationMainAPI } from './apis/notification'
import { RequestProxy } from 'delight-rpc'
import { Deferred } from 'extra-promise'

go(async () => {
  setAutoReload(isDev)
  preventMultipleInstances()

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

  const notificationRendererClient = new Deferred<RequestProxy<INotificationRendererAPI>>()
  const appRendererClient = new Deferred<RequestProxy<IAppRendererAPI>>()

  ipcMain.once('app-message-port-for-server', async event => {
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

  ipcMain.once('notification-message-port-for-server', event => {
    const [port] = event.ports
    port.start()
    createServerInMain(createNotificationMainAPI(notificationWindow), port)
  })

  ipcMain.once('app-message-port-for-client', async event => {
    const [port] = event.ports
    port.start()
    const [client] = createClientInMain<IAppRendererAPI>(port)
    appRendererClient.resolve(client)
  })

  ipcMain.once('notification-message-port-for-client', async event => {
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
