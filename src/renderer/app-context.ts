import { createContext } from 'react'
import * as DelightRPC from 'delight-rpc'
import { Subject } from 'rxjs'
import { IAppMainAPI, INotificationRecord } from '@src/contract.js'

export const MainAPIContext = createContext<DelightRPC.ClientProxy<IAppMainAPI>>(
  {} as DelightRPC.ClientProxy<IAppMainAPI>
)

export const newNotificationObservable = new Subject<INotificationRecord[]>()
