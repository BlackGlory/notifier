import { IConfig } from '@src/contract.js'
import { pathExists, readJSONFile, writeJSONFile } from 'extra-filesystem'
import { isUndefined } from 'extra-utils'
import { getDataPath } from '@main/utils/paths.js'

export const initialConfig: IConfig = {
  server: {
    hostname: 'localhost'
  , port: 8080
  }
, silentMode: false
}

export class Config {
  private store: IConfig | undefined

  constructor(
    private filename: string = getDataPath('config.json')
  ) {}

  async set(config: IConfig): Promise<void> {
    this.store = structuredClone(config)

    await this.write()
  }

  async get(): Promise<IConfig> {
    if (isUndefined(this.store)) {
      this.store = await this.read()
    }

    return structuredClone(this.store)
  }

  async reset(): Promise<void> {
    await this.set(initialConfig)
  }

  private async write(): Promise<void> {
    await writeJSONFile(this.filename, this.store, { spaces: 2 })
  }

  private async read(): Promise<IConfig> {
    if (await pathExists(this.filename)) {
      return await readJSONFile(this.filename)
    } else {
      return initialConfig
    }
  }
}
