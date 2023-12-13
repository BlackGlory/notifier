import { buildServer } from '@main/server.js'
import * as DelightRPC from 'delight-rpc'
import { go } from '@blackglory/prelude'
import { Config } from '@main/utils/config.js'
import {
  addNotifications
, deleteNotification
, queryNotificationsById
, queryNotificationsByTimestamp
} from '@main/database.js'
import { IAppMainAPI, IAppRendererAPI, INotification, INotificationRecord, INotificationRendererAPI } from '@src/contract.js'
import { FastifyInstance } from 'fastify'
import { createTimeBasedId, stringifyTimeBasedId } from '@main/utils/create-id.js'
import { bind } from 'extra-proxy'

export function createAppMainAPI(
  { config, appRendererAPI, notificationRendererAPI }: {
    config: Config
    appRendererAPI: DelightRPC.ClientProxy<IAppRendererAPI>
    notificationRendererAPI: DelightRPC.ClientProxy<INotificationRendererAPI>
  }
): DelightRPC.ImplementationOf<IAppMainAPI> {
  return {
    ping() {
      return 'pong'
    }

  , Server: go(() => {
      let server: FastifyInstance | undefined
      return {
        async startServer(host, port) {
          server = await buildServer({
            async notify(notifications) {
              const records = notifications.map(createNotificationRecord)

              const { silentMode } = await config.get()
              if (!silentMode) {
                notificationRendererAPI.notify(records)
              }

              appRendererAPI.notify(records)
              addNotifications(records)
            }
          })
          server.listen({ host, port })
        }
      , stopServer() {
          server?.close()
          server = undefined
        }
      , isServerRunning() {
          return !!server
        }
      }
    })

  , Config: bind(config)
  
  , Database: {
      addNotifications
    , deleteNotification
    , queryNotificationsById
    , queryNotificationsByTimestamp
    }
  }
}

function createNotificationRecord(
  notification: INotification
): INotificationRecord {
  const [timestamp, num] = createTimeBasedId()
  const id = stringifyTimeBasedId([timestamp, num])

  return {
    id
  , timestamp
  , title: notification.title ?? undefined
  , message: notification.message ?? undefined
  , iconUrl: notification.iconUrl ?? undefined
  , imageUrl: notification.imageUrl ?? undefined
  , url: notification.url ?? undefined
  }
}
