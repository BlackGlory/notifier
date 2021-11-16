import { Subject } from 'rxjs'

export const newNotificationObservable = new Subject<INotification[]>()

export const api: INotificationRendererAPI = {
  ping() {
    return 'pong'
  }
, notify(notifications: INotification[]) {
    newNotificationObservable.next(notifications)
  }
}
