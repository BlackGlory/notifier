import './styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppPage } from './pages/app.jsx'
import { createServerInRenderer, createClientInRenderer } from '@delight-rpc/electron'
import { MainAPIContext } from './app-context.js'
import * as DelightRPC from 'delight-rpc'
import { api } from './apis/app.js'
import { IAppMainAPI } from '@src/contract.js'
import { assert } from '@blackglory/prelude'

startRPCServer()
const [client] = createRPCClient()
await client.ping()
renderReactPage(client)

function renderReactPage(client: DelightRPC.ClientProxy<IAppMainAPI>): void {
  const main = document.querySelector('main')
  assert(main)

  const root = createRoot(main)
  root.render(
    <StrictMode>
      <MainAPIContext.Provider value={client}>
        <AppPage />
      </MainAPIContext.Provider>
    </StrictMode>
  )
}

function createRPCClient(): [
  client: DelightRPC.ClientProxy<IAppMainAPI>
, close: () => void
] {
  const channel = new MessageChannel()
  channel.port1.start()
  const [client, close] = createClientInRenderer<IAppMainAPI>(channel.port1)
  window.postMessage('message-port-for-server', '*', [channel.port2])

  return [client, close]
}

function startRPCServer(): void {
  const channel = new MessageChannel()
  channel.port1.start()
  createServerInRenderer(api, channel.port1)
  window.postMessage('message-port-for-client', '*', [channel.port2])
}
