import { app, Tray, Menu, MenuItem, nativeImage } from 'electron'
import { parseUniversalNotification } from 'universal-notification'
import { startDaemon, sendUniversalNotificationToDaemon } from './ipc'
import { createNotificationWindow } from './create-notification-window'
import { TaskRunner } from 'extra-promise'

const serialRunner = new TaskRunner(1)
serialRunner.pause()

let tray: Tray // prevent GC

;(async () => {
  const text = process.argv[2]
  if (!text) return app.exit()

  const notification = parseUniversalNotification(text)
  if (!notification) return app.exit()

  const isDaemon = app.requestSingleInstanceLock()
  if (!isDaemon) {
    await sendUniversalNotificationToDaemon(notification)
    return app.exit()
  }

  serialRunner.push(() => createNotificationWindow(notification))
  setupDaemon()

  await app.whenReady()
  setupTray()

  serialRunner.resume()
})()

function setupDaemon() {
  startDaemon().subscribe(notification => {
    serialRunner.push(() => createNotificationWindow(notification))
  })
}

function setupTray() {
  tray = new Tray(nativeImage.createEmpty())

  const contextMenu = new Menu()
  const quit = new MenuItem({
    type: 'normal'
  , label: 'Quit'
  , click() {
      app.quit()
    }
  })
  contextMenu.append(quit)

  tray.setContextMenu(contextMenu)
}
