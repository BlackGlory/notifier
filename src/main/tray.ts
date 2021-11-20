import { app, Tray, Menu, MenuItem, BrowserWindow } from 'electron'
import { assert } from '@blackglory/errors'
import { isUndefined } from '@blackglory/types'
import * as path from 'path'
import { closeDatabase } from './database'

let tray: Tray | undefined // prevent GC

export function setupTray(appWindow: BrowserWindow) {
  assert(isUndefined(tray))

  tray = new Tray(path.join(app.getAppPath(), 'public/icon.png'))
  tray.setToolTip('Unotifier')
  tray.addListener('click', showAppWindow)
  tray.setContextMenu(createContextMenu())

  function createContextMenu(): Menu {
    const show = new MenuItem({
      type: 'normal'
    , label: 'Show'
    , click: showAppWindow
    })
    const separator = new MenuItem({
      type: 'separator'
    })
    const quit = new MenuItem({
      type: 'normal'
    , label: 'Quit'
    , click() {
        closeDatabase()
        app.exit()
      }
    })

    const contextMenu = new Menu()
    contextMenu.append(show)
    contextMenu.append(separator)
    contextMenu.append(quit)

    return contextMenu
  }

  function showAppWindow(): void {
    appWindow.show()
  }
}
