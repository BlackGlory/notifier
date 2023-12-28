import { newNotificationObservable } from '@renderer/app-context.js'
import { IAppRendererAPI } from '@src/contract.js'
import { ImplementationOf } from 'delight-rpc'

export const api: ImplementationOf<IAppRendererAPI> = {
  ping() {
    return 'pong'
  }
, notify(notifications) {
    newNotificationObservable.next(notifications)
  }
}
