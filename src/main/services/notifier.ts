import { FastifyPluginAsync } from 'fastify'
import { isArray } from '@blackglory/prelude'
import { INotification, IServerAPI } from '@src/contract.js'

export const routes: FastifyPluginAsync<IServerAPI> = async (server, api) => {
  server.post<{
    Body: INotification | INotification[]
  }>(
    '/'
  , {
      schema: {
        body: {
          anyOf: [
            { $ref: '#/$defs/notification' }
          , {
              type: 'array'
            , items: { $ref: '#/$defs/notification' }
            }
          ]
        , $defs: {
            notification: {
              type: 'object'
            , properties: {
                title: { type: 'string', nullable: true }
              , message: { type: 'string', nullable: true }
              , iconUrl: { type: 'string', format: 'uri', nullable: true }
              , imageUrl: { type: 'string', format: 'uri', nullable: true }
              , url: { type: 'string', format: 'uri', nullable: true }
              }
            , required: []
            , additionalProperties: false
            }
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const notifications = isArray(req.body) ? req.body : [req.body]

      api.notify(notifications)

      reply
        .status(204)
        .send()
    }
  )
}
