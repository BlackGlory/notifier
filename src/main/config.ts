import { pathExists, readJSONFile, writeJSONFile } from 'extra-filesystem'
import { isUndefined } from 'extra-utils'
import { getDataPath } from '@main/utils/paths.js'

export class Config<T> {
  private store: T | undefined

  constructor(
    private initialConfig: T
  , private filename: string = getDataPath('config.json')
  ) {}

  async set(config: T): Promise<void> {
    this.store = structuredClone(config)

    await this.write()
  }

  async get(): Promise<T> {
    if (isUndefined(this.store)) {
      this.store = await this.read()
    }

    return structuredClone(this.store)
  }

  async reset(): Promise<void> {
    await this.set(this.initialConfig)
  }

  private async write(): Promise<void> {
    await writeJSONFile(this.filename, this.store, { spaces: 2 })
  }

  private async read(): Promise<T> {
    if (await pathExists(this.filename)) {
      return await readJSONFile(this.filename)
    } else {
      return this.initialConfig
    }
  }
}
