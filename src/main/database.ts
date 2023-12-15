import * as sqlite from 'sqlite'
import sqlite3 from 'sqlite3'
import { migrate } from '@blackglory/sqlite3-migrations'
import { findMigrationFilenames, readMigrationFile } from 'migration-files'
import { map } from 'extra-promise'
import { isntUndefined } from 'extra-utils'
import { assert, isUndefined } from '@blackglory/prelude'
import { INotification, INotificationRecord } from '@src/contract.js'
import { getDataPath, getResourcePath } from '@main/utils/paths.js'

let db: sqlite.Database<sqlite3.Database, sqlite3.Statement> | undefined

export async function openDatabase(
  filename: string = getDataPath('data.db')
): Promise<void> {
  if (db) throw new Error('Database is opened')

  const migrations = await map(
    await findMigrationFilenames(getResourcePath('migrations'))
  , readMigrationFile
  )

  db = await sqlite.open({
    filename
  , driver: sqlite3.Database
  })

  await migrate(db.getDatabaseInstance(), migrations)
}

export async function closeDatabase(): Promise<void> {
  if (isUndefined(db)) throw new Error('Database is closed')

  await db.close()
  db = undefined
}

export async function addNotifications(
  notifications: INotification[]
): Promise<INotificationRecord[]> {
  assert(db, 'Database is not opened')

  const timestamp = Date.now()
  const results: INotificationRecord[] = []
  for (const notification of notifications) {
    const result = await db.run(`
      INSERT INTO notification (timestamp, title, message, icon_url, image_url, url)
      VALUES ($timestamp, $title, $message, $iconUrl, $imageUrl, $url)
    `, {
      $timestamp: timestamp
    , $title: notification.title
    , $message: notification.message
    , $iconUrl: notification.iconUrl
    , $imageUrl: notification.imageUrl
    , $url: notification.url
    })

    const id = result.lastID
    assert(isntUndefined(id))

    results.push({
      id
    , timestamp
    , title: notification.title ?? null
    , message: notification.message ?? null
    , iconUrl: notification.iconUrl ?? null
    , imageUrl: notification.imageUrl ?? null
    , url: notification.url ?? null
    })
  }
  return results
}

export async function deleteNotification(id: number): Promise<void> {
  assert(db, 'Database is not opened')

  await db.run(`
    DELETE FROM notification
     WHERE id = $id
  `, { $id: id })
}

export async function getAllNotifications(): Promise<INotificationRecord[]> {
  assert(db, 'Database is not opened')
  
  return await db.all<INotificationRecord[]>(`
    SELECT id
         , timestamp
         , title
         , message
         , icon_url as iconUrl
         , image_url as imageUrl
         , url
      FROM notification
     ORDER BY id ASC
  `)
}

export async function queryNotifications(
  { limit, offset = 0, lastId }: {
    limit: number
    offset?: number
    lastId?: number
  }
): Promise<INotificationRecord[]> {
  assert(db, 'Database is not opened')

  if (isntUndefined(lastId)) {
    return await db.all<INotificationRecord[]>(`
      SELECT id
           , timestamp
           , title
           , message
           , icon_url as iconUrl
           , image_url as imageUrl
           , url
        FROM notification
       WHERE id < $lastId
       ORDER BY id DESC
       LIMIT $limit OFFSET $offset
    `, { $limit: limit, $offset: offset, $lastId: lastId })
  } else {
    return await db.all<INotificationRecord[]>(`
      SELECT id
           , timestamp
           , title
           , message
           , icon_url as iconUrl
           , image_url as imageUrl
           , url
        FROM notification
       ORDER BY id DESC
       LIMIT $limit OFFSET $offset
    `, { $limit: limit, $offset: offset })
  }
}
