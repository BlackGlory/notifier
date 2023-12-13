import { app, Tray, Menu, MenuItem, BrowserWindow } from 'electron'
import { assert, isUndefined } from '@blackglory/prelude'
import { closeDatabase } from './database.js'
import { getResourcePath } from '@main/utils/paths.js'

let tray: Tray | undefined // prevent GC

export function setupTray(appWindow: BrowserWindow): void {
  assert(isUndefined(tray), 'Tray is already setup')

  tray = new Tray(getResourcePath('public/icon.png'))
  tray.setToolTip('Notifier')
  tray.addListener('click', showAppWindow)
  tray.setContextMenu(createContextMenu())

  function createContextMenu(): Menu {
    const show = new MenuItem({
      type: 'normal'
    , label: 'Show'
    , click: showAppWindow
    })
    const quit = new MenuItem({
      type: 'normal'
    , label: 'Quit'
    , click(): void {
        closeDatabase()
        app.exit()
      }
    })
    const separator = new MenuItem({
      type: 'separator'
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
