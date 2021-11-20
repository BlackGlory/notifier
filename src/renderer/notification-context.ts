import { createContext } from 'react'
import * as DelightRPC from 'delight-rpc'
import { Subject } from 'rxjs'

export const MainAPIContext = createContext<DelightRPC.ClientProxy<INotificationMainAPI>>(
  {} as DelightRPC.ClientProxy<INotificationMainAPI>
)

export const newNotificationObservable = new Subject<INotification[]>()
