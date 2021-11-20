import {
  openDatabase
, closeDatabase

, addNotifications
, getAllNotifications
, deleteNotification
, queryNotificationsById
, queryNotificationsByTimestamp
} from '@main/database'
import { stringifyTimeBasedId } from '@main/utils/create-id'
import { createTempNameSync, remove } from 'extra-filesystem'

const filename = createTempNameSync()
beforeEach(() => {
  openDatabase(filename)
})
afterEach(async () => {
  await closeDatabase()
  await remove(filename)
})

test('addNotifications(notifications: INotification[]): Promise<void>', async () => {
  await addNotifications([
    {
      id: stringifyTimeBasedId([0, 0])
    , timestamp: 0
    , title: '#1'
    }
  , {
      id: stringifyTimeBasedId([1, 0])
    , timestamp: 1
    , title: '#2'
    }
  ])

  expect(await getAllNotifications()).toMatchObject([
    expect.objectContaining({
      id: stringifyTimeBasedId([1, 0])
    , timestamp: 1
    , title: '#2'
    })
  , expect.objectContaining({
      id: stringifyTimeBasedId([0, 0])
    , timestamp: 0
    , title: '#1'
    })
  ])
})

describe(`
  queryNotificationsById(
    beforeThisId: string
  , options: {
      limit: number
    , skip?: number
    }
  ): Promise<INotification[]>
`, () => {
  test('limit', async () => {
    await addNotifications([
      {
        id: stringifyTimeBasedId([0, 0])
      , timestamp: 0
      , title: '#1'
      }
    , {
        id: stringifyTimeBasedId([1, 0])
      , timestamp: 1
      , title: '#2'
      }
    , {
        id: stringifyTimeBasedId([1, 1])
      , timestamp: 1
      , title: '#3'
      }
    , {
        id: stringifyTimeBasedId([1, 2])
      , timestamp: 1
      , title: '#4'
      }
    , {
        id: stringifyTimeBasedId([1, 3])
      , timestamp: 1
      , title: '#5'
      }
    ])

    const result = await queryNotificationsById(stringifyTimeBasedId([1, 3]), {
      limit: 2
    })

    expect(result).toMatchObject([
      expect.objectContaining({
        id: stringifyTimeBasedId([1, 2])
      , timestamp: 1
      , title: '#4'
      })
    , expect.objectContaining({
        id: stringifyTimeBasedId([1, 1])
      , timestamp: 1
      , title: '#3'
      })
    ])
  })

  test('limit & skip', async () => {
    await addNotifications([
      {
        id: stringifyTimeBasedId([0, 0])
      , timestamp: 0
      , title: '#1'
      }
    , {
        id: stringifyTimeBasedId([1, 0])
      , timestamp: 1
      , title: '#2'
      }
    , {
        id: stringifyTimeBasedId([1, 1])
      , timestamp: 1
      , title: '#3'
      }
    , {
        id: stringifyTimeBasedId([1, 2])
      , timestamp: 1
      , title: '#4'
      }
    , {
        id: stringifyTimeBasedId([1, 3])
      , timestamp: 1
      , title: '#5'
      }
    ])

    const result = await queryNotificationsById(stringifyTimeBasedId([1, 3]), {
      limit: 2
    , skip: 1
    })

    expect(result).toMatchObject([
      expect.objectContaining({
        id: stringifyTimeBasedId([1, 1])
      , timestamp: 1
      , title: '#3'
      })
    , expect.objectContaining({
        id: stringifyTimeBasedId([1, 0])
      , timestamp: 1
      , title: '#2'
      })
    ])
  })
})

describe(`
  queryNotificationsByTimestamp(
    beforeThisTimestamp: number 
  , options: {
      limit: number
    , skip?: number
    }
  ): Promise<INotification[]>
`, () => {
  test('limit', async () => {
    await addNotifications([
      {
        id: stringifyTimeBasedId([0, 0])
      , timestamp: 0
      , title: '#1'
      }
    , {
        id: stringifyTimeBasedId([1, 0])
      , timestamp: 1
      , title: '#2'
      }
    , {
        id: stringifyTimeBasedId([1, 1])
      , timestamp: 1
      , title: '#3'
      }
    , {
        id: stringifyTimeBasedId([1, 2])
      , timestamp: 1
      , title: '#4'
      }
    , {
        id: stringifyTimeBasedId([2, 0])
      , timestamp: 2
      , title: '#5'
      }
    ])

    const result = await queryNotificationsByTimestamp(2, { limit: 2 })

    expect(result).toMatchObject([
      expect.objectContaining({
        id: stringifyTimeBasedId([1, 2])
      , timestamp: 1
      , title: '#4'
      })
    , expect.objectContaining({
        id: stringifyTimeBasedId([1, 1])
      , timestamp: 1
      , title: '#3'
      })
    ])
  })

  test('limit & skip', async () => {
    await addNotifications([
      {
        id: stringifyTimeBasedId([0, 0])
      , timestamp: 0
      , title: '#1'
      }
    , {
        id: stringifyTimeBasedId([1, 0])
      , timestamp: 1
      , title: '#2'
      }
    , {
        id: stringifyTimeBasedId([1, 1])
      , timestamp: 1
      , title: '#3'
      }
    , {
        id: stringifyTimeBasedId([1, 2])
      , timestamp: 1
      , title: '#4'
      }
    , {
        id: stringifyTimeBasedId([2, 0])
      , timestamp: 2
      , title: '#5'
      }
    ])

    const result = await queryNotificationsByTimestamp(2, { limit: 2, skip: 1 })

    expect(result).toMatchObject([
      expect.objectContaining({
        id: stringifyTimeBasedId([1, 1])
      , timestamp: 1
      , title: '#3'
      })
    , expect.objectContaining({
        id: stringifyTimeBasedId([1, 0])
      , timestamp: 1
      , title: '#2'
      })
    ])
  })
})

test('deleteNotification(uuid: string): Promise<void>', async () => {
  await addNotifications([
    {
      id: stringifyTimeBasedId([0, 0])
    , timestamp: 0
    , title: '#1'
    }
  , {
      id: stringifyTimeBasedId([1, 0])
    , timestamp: 1
    , title: '#2'
    }
  ])

  await deleteNotification(stringifyTimeBasedId([0, 0]))

  expect(await getAllNotifications()).toMatchObject([
    expect.objectContaining({
      id: stringifyTimeBasedId([1, 0])
    , timestamp: 1
    , title: '#2'
    })
  ])
})
