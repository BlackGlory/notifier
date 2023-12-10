import { newNotificationObservable } from '@renderer/notification-context.js'
import { INotificationRendererAPI, INotification } from '@src/contract.js'

export const api: INotificationRendererAPI = {
  ping() {
    return 'pong'
  }
, notify(notifications: INotification[]) {
    newNotificationObservable.next(notifications)
  }
}
