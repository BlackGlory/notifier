import { newNotificationObservable } from '@renderer/notification-context.js'
import { INotificationRendererAPI } from '@src/contract.js'
import { ImplementationOf } from 'delight-rpc'

export const api: ImplementationOf<INotificationRendererAPI> = {
  ping() {
    return 'pong'
  }
, notify(notifications) {
    newNotificationObservable.next(notifications)
  }
}
