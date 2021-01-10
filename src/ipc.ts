import { Deferred } from 'extra-promise'
import ipc = require('node-ipc')
import { UniversalNotification } from 'universal-notification'
import { Observable } from 'rxjs'

ipc.config.silent = true
const serverId = 'unotifiy-for-electron'

export function startDaemon(): Observable<UniversalNotification> {
  return new Observable(observer => {
    ipc.config.id = serverId

    ipc.serve(() => {
      ipc.server.on('notification', data => observer.next(data))
    })

    ipc.server.start()
    return () => ipc.server.stop()
  })
}

export function sendUniversalNotificationToDaemon(notification: UniversalNotification): PromiseLike<void> {
  const deferred = new Deferred<void>()

  ipc.connectTo(serverId, () => {
    ipc.of[serverId].on('connect', () => {
      ipc.of[serverId].emit('notification', notification)
      ipc.disconnect(serverId)
      deferred.resolve()
    })
  })

  return deferred
}
