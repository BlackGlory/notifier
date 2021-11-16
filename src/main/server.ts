import * as http from 'http'
import { RequestHandler, json, createError } from 'micro'
import micro from 'micro'
import {
  validateUniversalNotification
, UniversalNotification
} from 'universal-notification'
import { getError, getSuccess } from 'return-style'
import { nanoid } from 'nanoid'

export function createServer({ notify }: {
  notify: (notifications: INotification[]) => void
}): http.Server {
  const handler: RequestHandler = async req => {
    if (req.url === '/health') return 'OK'

    const payload = await json(req)
    if (payload) {
      if (Array.isArray(payload)) {
        const notifications = payload
          .filter(x => getSuccess(() => validateUniversalNotification(x)))
          .map(x => ({
            ...x as UniversalNotification[]
          , uuid: nanoid()
          , senderId: req.headers['x-sender-id'] as string | undefined
          , timestamp: Date.now()
          }))
        notify(notifications)
        return ''
      } else {
        const err = getError(() => validateUniversalNotification(payload))
        if (err) {
          throw createError(400, err.message)
        } else {
          const notification = payload as UniversalNotification
          notify([
            {
              ...notification
            , uuid: nanoid()
            , senderId: req.headers['x-sender-id'] as string | undefined
            , timestamp: Date.now()
            }
          ])
          return ''
        }
      }
    } else {
      throw createError(400, 'The payload is not a valid JSON')
    }
  }

  return new http.Server(micro(handler))
}
