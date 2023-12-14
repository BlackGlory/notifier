import { describe, test, expect, afterEach } from 'vitest'
import { Config, initialConfig } from '@main/config.js'
import { createTempFile, remove } from 'extra-filesystem'

const filename = await createTempFile()
afterEach(async () => {
  await remove(filename)
})

describe('Config', () => {
  test('get', async () => {
    const config = new Config()

    const result = await config.get()

    expect(result).toStrictEqual(initialConfig)
  })

  test('set', async () => {
    const config = new Config()
    await config.set({
      server: {
        hostname: '0.0.0.0'
      , port: 1080
      }
    , silentMode: true
    })

    expect(await config.get()).toStrictEqual({
      server: {
        hostname: '0.0.0.0'
      , port: 1080
      }
    , silentMode: true
    })
  })

  test('reset', async () => {
    const config = new Config()
    await config.set({
      server: {
        hostname: '0.0.0.0'
      , port: 1080
      }
    , silentMode: true
    })

    await config.reset()

    expect(await config.get()).toStrictEqual(initialConfig)
  })
})
