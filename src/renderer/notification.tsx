import './styles.css'
import ReactDOM from 'react-dom'
import { NotificationPage } from './pages/notification'
import { createServerInRenderer, createClientInRenderer } from '@delight-rpc/electron'
import { MainAPIContext } from './notification-context'
import { RequestProxy } from 'delight-rpc'
import { api } from './apis/notification'

startRPCServer()
const [client] = createRPCClient()
client.ping()
renderReactPage(client)

function renderReactPage(client: RequestProxy<INotificationMainAPI>): void {
  const rootElement = document.querySelector('main')
  ReactDOM.render(
    <MainAPIContext.Provider value={client}>
      <NotificationPage />
    </MainAPIContext.Provider>
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