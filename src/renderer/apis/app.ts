import { newNotificationObservable } from '@renderer/app-context'
import { INotificationRendererAPI, INotification } from '@src/contract'

export const api: INotificationRendererAPI = {
  ping() {
    return 'pong'
  }
, notify(notifications: INotification[]) {
    newNotificationObservable.next(notifications)
  }
}
