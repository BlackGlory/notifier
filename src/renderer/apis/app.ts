import { newNotificationObservable } from '@renderer/app-context'

export const api: INotificationRendererAPI = {
  ping() {
    return 'pong'
  }
, notify(notifications: INotification[]) {
    newNotificationObservable.next(notifications)
  }
}
