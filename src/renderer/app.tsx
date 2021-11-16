import './styles.css'
import ReactDOM from 'react-dom'
import { AppPage } from './pages/app'
import { createServerInRenderer, createClientInRenderer } from '@delight-rpc/electron'
import { MainAPIContext } from './app-context'
import { RequestProxy } from 'delight-rpc'
import { api } from './apis/app'

startRPCServer()
const [client] = createRPCClient()
client.ping()
renderReactPage(client)

function renderReactPage(client: RequestProxy<IAppMainAPI>): void {
  const rootElement = document.querySelector('main')
  ReactDOM.render(
    <MainAPIContext.Provider value={client}>
      <AppPage />
    </MainAPIContext.Provider>
  , rootElement
  )
}

function createRPCClient() {
  const channel = new MessageChannel()
  channel.port1.start()
  const client = createClientInRenderer<IAppMainAPI>(channel.port1)
  window.postMessage('message-port-for-server', '*', [channel.port2])

  return client
}

function startRPCServer(): void {
  const channel = new MessageChannel()
  channel.port1.start()
  createServerInRenderer(api, channel.port1)
  window.postMessage('message-port-for-client', '*', [channel.port2])
}
