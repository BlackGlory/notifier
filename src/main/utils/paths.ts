import { isDev } from './is-dev.js'
import { app } from 'electron'
import path from 'path'

export function getResourcePath(relativePathname: string): string {
  return path.join(app.getAppPath(), relativePathname)
}

export function getDataPath(relativePathname: string): string {
  if (isDev()) {
    return path.join(process.cwd(), relativePathname)
  } else {
    return path.join(path.dirname(app.getPath('exe')), relativePathname)
  }
}
