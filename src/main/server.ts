import fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { routes as health } from './services/health.js'
import { routes as notify } from './services/notify.js'
import { IServerAPI } from '@src/contract.js'

export async function buildServer(api: IServerAPI): Promise<FastifyInstance> {
  const server = fastify({
    forceCloseConnections: true
  , ajv: {
      customOptions: {
        coerceTypes: false
      }
    }
  })

  server.addHook('onRequest', async (req, reply) => {
    reply.header('Cache-Control', 'private, no-cache')
  })

  await server.register(cors, { origin: true })
  await server.register(notify, api)
  await server.register(health)

  return server
}
