import { buildServer } from '@main/server.js'
import * as DelightRPC from 'delight-rpc'
import { go } from '@blackglory/prelude'
import { Config } from '@main/config.js'
import { addNotifications, deleteNotification, queryNotifications } from '@main/database.js'
import { IAppMainAPI, IAppRendererAPI, IConfig, INotificationRendererAPI, ServerState } from '@src/contract.js'
import { FastifyInstance } from 'fastify'
import { bind } from 'extra-proxy'
import { FiniteStateMachine } from 'extra-fsm'

export function createAppMainAPI(
  { config, appRendererClientPromise, notificationRendererClientPromise }: {
    config: Config<IConfig>
    appRendererClientPromise: PromiseLike<DelightRPC.ClientProxy<IAppRendererAPI>>
    notificationRendererClientPromise: PromiseLike<DelightRPC.ClientProxy<INotificationRendererAPI>>
  }
): DelightRPC.ImplementationOf<IAppMainAPI> {
  return {
    ping() {
      return 'pong'
    }

  , Server: go(() => {
      const fsm = new FiniteStateMachine({
        [ServerState.Stopped]: {
          start: ServerState.Starting
        }
      , [ServerState.Starting]: {
          started: ServerState.Running
        , error: ServerState.Error
        }
      , [ServerState.Running]: {
          stop: ServerState.Stopping
        }
      , [ServerState.Stopping]: {
          stopped: ServerState.Stopped
        }
      , [ServerState.Error]: {
          start: ServerState.Starting
        }
      }, ServerState.Stopped)

      let server: FastifyInstance | undefined

      return {
        async start(host, port) {
          const appRendererClient = await appRendererClientPromise
          const notificationRendererClient = await notificationRendererClientPromise

          fsm.send('start')

          try {
            server = await buildServer({
              async notify(notifications) {
                const { silentMode } = await config.get()

                const records = await addNotifications(notifications)

                await appRendererClient.notify(records)

                if (!silentMode) {
                  await notificationRendererClient.notify(records)
                }
              }
            })

            await server.listen({ host, port })

            fsm.send('started')
          } catch (e) {
            fsm.send('error')
          }
        }
      , async stop() {
          fsm.send('stop')

          await server?.close()
          server = undefined

          fsm.send('stopped')
        }
      , getState() {
          return fsm.state
        }
      }
    })

  , Config: bind(config)
  
  , Database: {
      addNotifications
    , deleteNotification
    , queryNotifications
    }
  }
}
