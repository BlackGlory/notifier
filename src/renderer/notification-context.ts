import { createContext } from 'react'
import { RequestProxy } from 'delight-rpc'

export const MainAPIContext = createContext<RequestProxy<INotificationMainAPI>>(
  {} as RequestProxy<INotificationMainAPI>
)
