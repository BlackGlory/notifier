import { createServer } from '@main/server'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, json, header } from 'extra-request/lib/es2018/transformers'
import { assert } from '@blackglory/errors'
import { isObject } from '@blackglory/types'
import { AddressInfo } from 'net'

const fn: jest.Mock = jest.fn()
let server: ReturnType<typeof createServer>
let address: string

beforeEach(async () => {
  server = createServer({ notify: fn })
  address = await startService()
})
afterEach(async () => {
  await stopService()
  fn.mockClear()
})

describe(`
  createServer({ notify }: {
    notify: (notifications: INotification[]) => void
  }): http.Server
`, () => {
  test('good payload', async () => {
    const res = await fetch(post(
      url(getAddress())
    , json({
        title: 'title'
      , other: 'other'
      })
    ))

    expect(res.status).toBe(200)
    expect(fn).toBeCalledTimes(1)
    expect(fn).toBeCalledWith([
      expect.objectContaining({
        id: expect.any(String)
      , timestamp: expect.any(Number)
      , title: 'title'
      })
    ])
    expect(fn.mock.calls[0]).not.toHaveProperty('other')
  })

  test('with X-Sender-Id', async () => {
    const res = await fetch(post(
      url(getAddress())
    , header('X-Sender-Id', 'tester')
    , json({})
    ))

    expect(res.status).toBe(200)
    expect(fn).toBeCalledTimes(1)
    expect(fn).toBeCalledWith([
      expect.objectContaining({
        id: expect.any(String)
      , timestamp: expect.any(Number)
      , senderId: 'tester'
      })
    ])
  })

  test('bad payload', async () => {
    const res = await fetch(post(
      url(getAddress())
    , json({ title: 0 })
    ))

    expect(res.status).toBe(400)
    expect(fn).not.toBeCalled()
  })
})

function getAddressFromAddressInfo(address: AddressInfo): string {
  if (address.family === 'IPv4') {
    return `http://${address.address}:${address.port}`
  } else {
    return `http://[${address.address}]:${address.port}`
  }
}

function getAddress() {
  return address
}

async function startService(): Promise<string> {
  return await new Promise<string>(resolve => {
      server.listen({ host: 'localhost', port: 0 }, () => {
      const addressInfo = server.address()
      assert(isObject(addressInfo), 'addressInfo is not object')

      const address = getAddressFromAddressInfo(addressInfo)
      resolve(address)
    })
  })
}

async function stopService(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.close(err => {
      if (err) return reject(err)
      resolve()
    })
  })
}
