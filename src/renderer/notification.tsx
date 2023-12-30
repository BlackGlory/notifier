import './styles.css'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { NotificationPage } from './pages/notification.jsx'
import { createServerInRenderer, createClientInRenderer } from '@delight-rpc/electron'
import { MainAPIContext } from './notification-context.js'
import * as DelightRPC from 'delight-rpc'
import { api } from './apis/notification.js'
import { INotificationMainAPI } from '@src/contract.js'
import { assert } from '@blackglory/prelude'

startRPCServer()
const [client] = createRPCClient()
await client.ping()
renderReactPage(client)

function renderReactPage(client: DelightRPC.ClientProxy<INotificationMainAPI>): void {
  const main = document.querySelector('main')
  assert(main)

  const root = createRoot(main)

  root.render(
    <StrictMode>
      <MainAPIContext.Provider value={client}>
        <NotificationPage />
      </MainAPIContext.Provider>
    </StrictMode>
  )
}

function createRPCClient(): [
  client: DelightRPC.ClientProxy<INotificationMainAPI>
, close: () => void
] {
  const channel = new MessageChannel()
  channel.port1.start()
  const [client, close] = createClientInRenderer<INotificationMainAPI>(channel.port1)
  window.postMessage('message-port-for-server', '*', [channel.port2])

  return [client, close]
}

function startRPCServer(): void {
  const channel = new MessageChannel()
  channel.port1.start()
  createServerInRenderer(api, channel.port1)
  window.postMessage('message-port-for-client', '*', [channel.port2])
}
