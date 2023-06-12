import './styles.css'
import ReactDOM from 'react-dom'
import { StrictMode } from 'react'
import { AppPage } from './pages/app'
import { createServerInRenderer, createClientInRenderer } from '@delight-rpc/electron'
import { MainAPIContext } from './app-context'
import * as DelightRPC from 'delight-rpc'
import { api } from './apis/app'
import { IAppMainAPI } from '@src/contract'

startRPCServer()
const [client] = createRPCClient()
client.ping()
renderReactPage(client)

function renderReactPage(client: DelightRPC.ClientProxy<IAppMainAPI>): void {
  const rootElement = document.querySelector('main')
  ReactDOM.render(
    <StrictMode>
      <MainAPIContext.Provider value={client}>
        <AppPage />
      </MainAPIContext.Provider>
    </StrictMode>
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
