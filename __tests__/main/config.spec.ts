import { describe, test, expect, afterEach } from 'vitest'
import { Config } from '@main/config.js'
import { createTempName, remove } from 'extra-filesystem'

const filename = await createTempName()
afterEach(async () => {
  await remove(filename)
})

describe('Config', () => {
  test('get', async () => {
    const initialConfig = { foo: 'bar' }
    const config = new Config(initialConfig, filename)

    const result = await config.get()

    expect(result).toStrictEqual(initialConfig)
  })

  test('set', async () => {
    const initialConfig = { foo: 'bar' }
    const config = new Config(initialConfig, filename)

    await config.set({
      foo: 'baz'
    })

    expect(await config.get()).toStrictEqual({
      foo: 'baz'
    })
  })

  test('reset', async () => {
    const initialConfig = { foo: 'bar' }
    const config = new Config(initialConfig, filename)
    await config.set({
      foo: 'baz'
    })

    await config.reset()

    expect(await config.get()).toStrictEqual(initialConfig)
  })
})
