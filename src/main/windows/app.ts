import * as path from 'path'
import { app, BrowserWindow, shell } from 'electron'
import isDev from 'electron-is-dev'

export function createAppWindow(): {
  window: BrowserWindow
  load(): Promise<void>
} {
  const window = new BrowserWindow({
    width: 800
  , height: 600
  , minWidth: 600
  , minHeight: 500
  , resizable: true
  , webPreferences: {
      preload: path.join(app.getAppPath(), 'lib/renderer/app-preload.js')
    , devTools: isDev
    }
  })

  window.removeMenu()

  // 阻止在Electron里打开新链接
  window.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 将关闭窗口改为隐藏窗口
  window.addListener('close', evt => {
    evt.preventDefault()
    window.hide()
  })

  return {
    window
  , async load() {
      await window.loadURL(
        isDev
        ? 'http://localhost:8080/app.html'
        : `file://${path.join(app.getAppPath(), 'dist/app.html')}`
      )

      if (isDev) {
        window.webContents.openDevTools({ mode: 'detach' })
      }
    }
  }
}
