import { createContext } from 'react'
import * as DelightRPC from 'delight-rpc'
import { Subject } from 'rxjs'
import { INotificationMainAPI, INotification } from '@src/contract.js'

export const MainAPIContext = createContext<DelightRPC.ClientProxy<INotificationMainAPI>>(
  {} as DelightRPC.ClientProxy<INotificationMainAPI>
)

export const newNotificationObservable = new Subject<INotification[]>()
