import './styles.css'
import ReactDOM from 'react-dom'
import { StrictMode } from 'react'
import { NotificationPage } from './pages/notification.jsx'
import { createServerInRenderer, createClientInRenderer } from '@delight-rpc/electron'
import { MainAPIContext } from './notification-context.js'
import * as DelightRPC from 'delight-rpc'
import { api } from './apis/notification.js'
import { INotificationMainAPI } from '@src/contract.js'

startRPCServer()
const [client] = createRPCClient()
client.ping()
renderReactPage(client)

function renderReactPage(client: DelightRPC.ClientProxy<INotificationMainAPI>): void {
  const rootElement = document.querySelector('main')
  ReactDOM.render(
    <StrictMode>
      <MainAPIContext.Provider value={client}>
        <NotificationPage />
      </MainAPIContext.Provider>
    </StrictMode>
  , rootElement
  )
}

function createRPCClient() {
  const channel = new MessageChannel()
  channel.port1.start()
  const client = createClientInRenderer<INotificationMainAPI>(channel.port1)
  window.postMessage('message-port-for-server', '*', [channel.port2])

  return client
}

function startRPCServer(): void {
  const channel = new MessageChannel()
  channel.port1.start()
  createServerInRenderer(api, channel.port1)
  window.postMessage('message-port-for-client', '*', [channel.port2])
}
