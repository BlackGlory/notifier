import { createStrictContext } from 'extra-react-hooks'
import * as DelightRPC from 'delight-rpc'
import { Subject } from 'rxjs'
import { INotificationMainAPI, INotificationRecord } from '@src/contract.js'

export const MainAPIContext = createStrictContext<DelightRPC.ClientProxy<INotificationMainAPI>>()

export const newNotificationObservable = new Subject<INotificationRecord[]>()
