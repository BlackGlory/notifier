import * as DelightRPC from 'delight-rpc'
import { Subject } from 'rxjs'
import { createStrictContext } from 'extra-react-hooks'
import { IAppMainAPI, INotificationRecord } from '@src/contract.js'

export const MainAPIContext = createStrictContext<DelightRPC.ClientProxy<IAppMainAPI>>()

export const newNotificationObservable = new Subject<INotificationRecord[]>()
