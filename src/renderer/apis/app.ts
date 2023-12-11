import { newNotificationObservable } from '@renderer/app-context.js'
import { INotificationRendererAPI } from '@src/contract.js'

export const api: INotificationRendererAPI = {
  ping() {
    return 'pong'
  }
, notify(notifications) {
    newNotificationObservable.next(notifications)
  }
}
