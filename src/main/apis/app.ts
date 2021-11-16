import * as http from 'http'
import { createServer } from '@main/server'
import { RequestProxy } from 'delight-rpc'

let server: http.Server | undefined

export function createAppMainAPI({ appRendererAPI, notificationRendererAPI }: {
  appRendererAPI: RequestProxy<IAppRendererAPI>
  notificationRendererAPI: RequestProxy<INotificationRendererAPI>
}): IAppMainAPI {
  return {
    ping() {
      return 'pong'
    }
  , startServer(port) {
      server = createServer({
        notify(notifications) {
          notificationRendererAPI.notify(notifications)
          appRendererAPI.notify(notifications)
        }
      })
      server.listen(port)
    }
  , stopServer() {
      server?.close()
    }
  }
}
