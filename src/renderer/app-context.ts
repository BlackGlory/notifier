import { createContext } from 'react'
import { RequestProxy } from 'delight-rpc'

export const MainAPIContext = createContext<RequestProxy<IAppMainAPI>>(
  {} as RequestProxy<IAppMainAPI>
)
