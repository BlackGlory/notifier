import { isUndefined } from '@blackglory/prelude'
import electron from 'electron'

export function isDev(): boolean {
  if (isUndefined(electron.app)) {
    return true
  } else {
    return !electron.app.isPackaged
  }
}
