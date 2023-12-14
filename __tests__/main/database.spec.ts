import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import {
  openDatabase
, closeDatabase

, addNotifications
, getAllNotifications
, deleteNotification
, queryNotifications
} from '@main/database.js'

beforeEach(async () => {
  await openDatabase(':memory:')
})
afterEach(async () => {
  await closeDatabase()
})

test('addNotifications', async () => {
  const result = await addNotifications([
    {
      title: '#1'
    , message: 'message'
    , iconUrl: 'iconUrl'
    , imageUrl: 'imageUrl'
    , url: 'url'
    }
  , { title: '#2' }
  ])

  expect(result).toStrictEqual([
    {
      id: 1
    , timestamp: expect.any(Number)
    , title: '#1'
    , message: 'message'
    , iconUrl: 'iconUrl'
    , imageUrl: 'imageUrl'
    , url: 'url'
    }
  , {
      id: 2
    , timestamp: expect.any(Number)
    , title: '#2'
    , message: null
    , iconUrl: null
    , imageUrl: null
    , url: null
    }
  ])
  expect(await getAllNotifications()).toStrictEqual([
    {
      id: 1
    , timestamp: expect.any(Number)
    , title: '#1'
    , message: 'message'
    , iconUrl: 'iconUrl'
    , imageUrl: 'imageUrl'
    , url: 'url'
    }
  , {
      id: 2
    , timestamp: expect.any(Number)
    , title: '#2'
    , message: null
    , iconUrl: null
    , imageUrl: null
    , url: null
    }
  ])
})

test('deleteNotification', async () => {
  await addNotifications([
    { title: '#1' }
  , { title: '#2' }
  ])

  await deleteNotification(1)

  expect(await getAllNotifications()).toStrictEqual([
    {
      id: 2
    , timestamp: expect.any(Number)
    , title: '#2'
    , message: null
    , iconUrl: null
    , imageUrl: null
    , url: null
    }
  ])
})

describe('queryNotifications', () => {
  test('limit, offset', async () => {
    await addNotifications([
      { title: '#1' }
    , { title: '#2' }
    , { title: '#3' }
    , { title: '#4' }
    ])

    const result = await queryNotifications({ limit: 2, offset: 1 })

    expect(result).toStrictEqual([
      {
        id: 3
      , timestamp: expect.any(Number)
      , title: '#3'
      , message: null
      , iconUrl: null
      , imageUrl: null
      , url: null
      }
    , {
        id: 2
      , timestamp: expect.any(Number)
      , title: '#2'
      , message: null
      , iconUrl: null
      , imageUrl: null
      , url: null
      }
    ])
  })

  test('lastId, limit, offset', async () => {
    await addNotifications([
      { title: '#1' }
    , { title: '#2' }
    , { title: '#3' }
    , { title: '#4' }
    , { title: '#5' }
    ])

    const result = await queryNotifications({
      limit: 2
    , offset: 1
    , lastId: 5
    })

    expect(result).toStrictEqual([
      {
        id: 3
      , timestamp: expect.any(Number)
      , title: '#3'
      , message: null
      , iconUrl: null
      , imageUrl: null
      , url: null
      }
    , {
        id: 2
      , timestamp: expect.any(Number)
      , title: '#2'
      , message: null
      , iconUrl: null
      , imageUrl: null
      , url: null
      }
    ])
  })
})
