import * as http from 'http'
import { createServer } from '@main/server.js'
import * as DelightRPC from 'delight-rpc'
import { go } from '@blackglory/prelude'
import {
  getServer
, getSilentMode
, setServer
, setSilentMode
, setServerHostname
, setServerPort
} from '@main/config.js'
import {
  addNotifications
, deleteNotification
, queryNotificationsById
, queryNotificationsByTimestamp
} from '@main/database.js'
import { IAppMainAPI, IAppRendererAPI, INotificationRendererAPI } from '@src/contract.js'

export function createAppMainAPI({ appRendererAPI, notificationRendererAPI }: {
  appRendererAPI: DelightRPC.ClientProxy<IAppRendererAPI>
  notificationRendererAPI: DelightRPC.ClientProxy<INotificationRendererAPI>
}): IAppMainAPI {
  return {
    ping() {
      return 'pong'
    }

  , Server: go(() => {
      let server: http.Server | undefined
      return {
        startServer(hostname, port) {
          server = createServer({
            notify(notifications) {
              if (!getSilentMode()) {
                notificationRendererAPI.notify(notifications)
              }
              appRendererAPI.notify(notifications)
              addNotifications(notifications)
            }
          })
          server.listen(port, hostname)
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

  , Config: {
      getServer
    , setServer
    , setServerHostname
    , setServerPort
    , getSilentMode
    , setSilentMode
    }
  
  , Database: {
      addNotifications
    , deleteNotification
    , queryNotificationsById
    , queryNotificationsByTimestamp
    }
  }
}
