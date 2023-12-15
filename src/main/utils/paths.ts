import { isDev } from './is-dev.js'
import { app } from 'electron'
import path from 'path'
import { findUpPackageFilenameSync } from 'extra-filesystem'
import { fileURLToPath } from 'url'
import { assert } from '@blackglory/prelude'

export function getResourcePath(relativePathname: string): string {
  if (isDev()) {
    return path.join(getDevRoot(), relativePathname)
  } else {
    return path.join(app.getAppPath(), relativePathname)
  }
}

export function getDataPath(relativePathname: string): string {
  if (isDev()) {
    return path.join(getDevRoot(), relativePathname)
  } else {
    return path.join(path.dirname(app.getPath('exe')), relativePathname)
  }
}

function getDevRoot(): string {
  const packageFilename = findUpPackageFilenameSync(fileURLToPath(import.meta.url))
  assert(packageFilename)

  return path.dirname(packageFilename)
}
