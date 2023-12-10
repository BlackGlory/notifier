import { test, expect, beforeEach, afterEach } from 'vitest'
import {
  initConfig
, getServer
, setServer
, getSilentMode
, setSilentMode
, resetConfig
, setServerHostname
, setServerPort
} from '@main/config.js'
import { createTempNameSync, remove } from 'extra-filesystem'

const filename = createTempNameSync()
beforeEach(() => {
  initConfig(filename)
})
afterEach(async () => {
  await remove(filename)
})

test('getServer(): { hostname: string; port: number }', () => {
  const result = getServer()

  expect(result).toStrictEqual({
    hostname: 'localhost'
  , port: 8080
  })
})

test('setServer(hostname: string, port: number): void', () => {
  setServer('0.0.0.0', 1080)

  expect(getServer()).toStrictEqual({
    hostname: '0.0.0.0'
  , port: 1080
  })
})

test('setServerHostname(hostname: string): void', () => {
  setServerHostname('0.0.0.0')

  expect(getServer()).toStrictEqual({
    hostname: '0.0.0.0'
  , port: 8080
  })
})

test('setServerPort(port: number): void', () => {
  setServerPort(1080)

  expect(getServer()).toStrictEqual({
    hostname: 'localhost'
  , port: 1080
  })
})

test('getSilentMode(): boolean', () => {
  const result = getSilentMode()

  expect(result).toBe(false)
})

test('setSilentMode(value: boolean): void', () => {
  setSilentMode(true)

  expect(getSilentMode()).toBe(true)
})

test('resetConfig(): void', () => {
  setServer('0.0.0.0', 1080)
  setSilentMode(true)

  resetConfig()

  expect(getServer()).toStrictEqual({
    hostname: 'localhost'
  , port: 8080
  })
  expect(getSilentMode()).toBe(false)
})
