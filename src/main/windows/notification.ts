import { BrowserWindow, shell } from 'electron'
import { isDev } from '@main/utils/is-dev.js'
import { getResourcePath } from '@main/utils/paths.js'

export function createNotificationWindow(): {
  window: BrowserWindow
  load(): Promise<void>
} {
  const window = new BrowserWindow({
    width: 0
  , height: 0
  , frame: false
  , transparent: true
  , resizable: false
  , hasShadow: false
  , alwaysOnTop: true
  , skipTaskbar: false
  , fullscreenable: false
  , focusable: false
  , webPreferences: {
      preload: getResourcePath('lib/renderer/notification-preload.cjs')
    , devTools: isDev()
    }
  })

  // 阻止在Electron里打开新链接
  window.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  return {
    window
  , async load() {
      await window.loadURL(
        isDev()
        ? 'http://localhost:8080/notification.html'
        : `file://${getResourcePath('dist/notification.html')}`
      )

      if (isDev()) {
        window.webContents.openDevTools({ mode: 'detach' })
      }
    }
  }
}
