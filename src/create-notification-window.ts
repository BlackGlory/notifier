import { app, BrowserWindow } from 'electron'
import { UniversalNotification } from 'universal-notification'
import * as path from 'path'

export async function createNotificationWindow(notification: UniversalNotification): Promise<BrowserWindow> {
  const win = new BrowserWindow({
    width: 360
  , height: 87
  , frame: process.env.NODE_ENV !== 'production'
  , skipTaskbar: true
  , webPreferences: {
      preload: path.join(app.getAppPath(), 'lib/preload.js')
    , contextIsolation: true
    }
  })

  await win.loadFile('assets/notification.html')
  win.webContents.send('notification', notification)

  return win
}
