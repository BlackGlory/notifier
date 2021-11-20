import { newNotificationObservable } from '@renderer/notification-context'

export const api: INotificationRendererAPI = {
  ping() {
    return 'pong'
  }
, notify(notifications: INotification[]) {
    newNotificationObservable.next(notifications)
  }
}
