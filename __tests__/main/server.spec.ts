import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { buildServer } from '@main/server.js'
import { fetch } from 'extra-fetch'
import { get, post } from 'extra-request'
import { url, json, pathname } from 'extra-request/transformers'
import { UnpackedPromise } from 'hotypes'

const notify = vi.fn()
let server: UnpackedPromise<ReturnType<typeof buildServer>>
let address: string

beforeEach(async () => {
  await startService()
})
afterEach(async () => {
  await stopService()
  notify.mockClear()
})

describe('buildServer', () => {
  test('health', async () => {
    const res = await fetch(get(
      url(getAddress())
    , pathname('/health')
    ))

    expect(res.status).toBe(200)
    expect(await res.text()).toBe('OK')
  })

  describe('notify', () => {
    test('notification', async () => {
      const res = await fetch(post(
        url(getAddress())
      , json({
          title: 'title'
        , other: 'other'
        })
      ))

      expect(res.status).toBe(204)
      expect(notify).toBeCalledTimes(1)
      expect(notify).toBeCalledWith([
        {
          title: 'title'
        }
      ])
      expect(notify.mock.calls[0]).not.toHaveProperty('other')
    })

    test('notifications', async () => {
      const res = await fetch(post(
        url(getAddress())
      , json([
          {
            title: 'title-1'
          , other: 'other'
          }
        , {
            title: 'title-2'
          , other: 'other'
          }
        ])
      ))

      expect(res.status).toBe(204)
      expect(notify).toBeCalledTimes(1)
      expect(notify).toBeCalledWith([
        { title: 'title-1' }
      , { title: 'title-2' }
      ])
      expect(notify.mock.calls[0]).not.toHaveProperty('other')
    })

    test('invalid payload', async () => {
      const res = await fetch(post(
        url(getAddress())
      , json({ title: 0 })
      ))

      expect(res.status).toBe(400)
      expect(notify).not.toBeCalled()
    })
  })
})

function getAddress() {
  return address
}

async function startService(): Promise<void> {
  server = await buildServer({ notify })
  address = await server.listen()
}

async function stopService(): Promise<void> {
  await server.close()
}
