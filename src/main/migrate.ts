import { isUndefined, pipeAsync } from 'extra-utils'
import { getDataPath } from './utils/paths.js'
import { readJSONFile, pathExists, writeJSONFile } from 'extra-filesystem'
import { createMigration } from 'extra-semver'

export async function migrateConfig(
  filename: string = getDataPath('config.json')
): Promise<void> {
  if (await pathExists(filename)) {
    const config = await readJSONFile<{
      version: string | undefined
    }>(filename)

    // 在v0.2.1之前, 没有`config.version`属性.
    if (isUndefined(config.version)) {
      config.version = '0.2.0'
    }

    await pipeAsync(
      config.version
    , createMigration('0.2.0', '0.2.1', async () => {
        config.version = '0.2.1'
      })
    )

    await writeJSONFile(filename, config, { spaces: 2 })
  }
}
