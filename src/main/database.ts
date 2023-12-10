import level from 'level'
import { dropAsync, mapAsync, toArrayAsync } from 'iterable-operator'
import { pipe } from 'extra-utils'
import { assert, isUndefined } from '@blackglory/prelude'
import { stringifyTimeBasedId } from '@main/utils/create-id.js'
import { INotification } from '@src/contract.js'

let db: level.LevelDB<string, INotification> | undefined

export function openDatabase(filename = 'data'): void {
  if (db) throw new Error('Database is opened')

  db = level(filename, {
    valueEncoding: 'json'
  })
}

export async function closeDatabase(): Promise<void> {
  if (isUndefined(db)) throw new Error('Database is closed')

  await db.close()
  db = undefined
}

export async function addNotifications(notifications: INotification[]): Promise<void> {
  assert(db, 'Database is not opened')

  await db.batch(notifications.map(notification => ({
    type: 'put'
  , key: notification.id
  , value: notification
  })))
}

export async function getAllNotifications(): Promise<INotification[]> {
  assert(db, 'Database is not opened')
  
  return await pipe(
    db.createValueStream({ reverse: true })
  , notifications => mapAsync(notifications, notification => notification as any as INotification)
  , toArrayAsync
  )
}

export async function queryNotificationsById(
  beforeThisId: string
, { limit, skip = 0 }: {
    limit: number
  , skip?: number
  }
): Promise<INotification[]> {
  assert(db, 'Database is not opened')

  return await pipe(
    db.createReadStream({
      reverse: true
    , limit: limit + skip
    , lt: beforeThisId
    })
  , items => mapAsync(items, item => (item as any as { key: string, value: INotification }).value)
  , notifications => dropAsync(notifications, skip)
  , toArrayAsync
  )
}

export async function queryNotificationsByTimestamp(
  beforeThisTimestamp: number 
, { limit, skip = 0 }: {
    limit: number
  , skip?: number
  }
): Promise<INotification[]> {
  assert(db, 'Database is not opened')

  return await pipe(
    db.createReadStream({
      reverse: true
    , limit: limit + skip
    , lt: stringifyTimeBasedId([beforeThisTimestamp, 0])
    })
  , items => mapAsync(items, item => (item as any as { key: string, value: INotification }).value)
  , notifications => dropAsync(notifications, skip)
  , toArrayAsync
  )
}

export async function deleteNotification(id: string): Promise<void> {
  assert(db, 'Database is not opened')

  await db.del(id)
}
