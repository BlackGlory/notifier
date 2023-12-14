import { useState, useContext } from 'react'
import { MainAPIContext } from '@renderer/app-context.js'
import { Switch } from '@headlessui/react'
import { useEffectAsync, useMountAsync } from 'extra-react-hooks'
import { useSelector, useUpdater } from 'extra-react-store'
import { ConfigStore, ConfigStoreContext } from '@renderer/utils/config-store.js'
import { ServerState } from '@src/contract.js'
import { go, isUndefined } from '@blackglory/prelude'

export function Settings() {
  const mainAPI = useContext(MainAPIContext)
  const [store, setStore] = useState<ConfigStore>()

  useEffectAsync(async () => {
    const config = await mainAPI.Config.get()
    setStore(new ConfigStore(mainAPI, config))
  }, [])

  return store
       ? (
           <ConfigStoreContext.Provider value={store}>
             <Config />
           </ConfigStoreContext.Provider>
         )
       : null
}

function Config() {
  const mainAPI = useContext(MainAPIContext)
  const config = useSelector(ConfigStoreContext, state => state)
  const updateConfig = useUpdater(ConfigStoreContext)
  const [serverState, setServerState] = useState<ServerState>()

  useMountAsync(async () => {
    setServerState(await mainAPI.Server.getState())
  })

  return (
    <div className='p-5'>
      <Headline>HTTP Server</Headline>
      <div className='space-y-4'>
        <div className='max-w-md grid grid-cols-4 gap-y-2 gap-x-2 items-center'>
          <label className=''>Hostname</label>
          <input type='text' className='px-1 py-0.5 border col-span-3'
            disabled={serverState === ServerState.Running}
            value={config.server.hostname}
            onChange={event => {
              const hostname = event.target.value
              updateConfig(config => {
                config.server.hostname = hostname
              })
            }}
          />

          <label className=''>Port</label>
          <input type='number' className='p-1 py-0.5 border col-span-3'
            disabled={serverState === ServerState.Running}
            value={config.server.port}
            onChange={event => {
              const port = event.target.valueAsNumber
              updateConfig(config => {
                config.server.port = port
              })
            }}
          />
        </div>

        <div className='space-y-2'>
          <div>
            Server Status: {go(() => {
              switch (serverState) {
                case ServerState.Starting: return 'Starting'
                case ServerState.Running: return 'Running'
                case ServerState.Stopping: return 'Stopping'
                case ServerState.Stopped: return 'Stopped'
                case ServerState.Error: return 'Error'
                default: return 'Unknown'
              }
            })}
          </div>
          <button
            className='bg-gray-300 py-1 px-2'
            disabled={
              isUndefined(serverState) ||
              serverState === ServerState.Starting ||
              serverState === ServerState.Stopping
            }
            onClick={async () => {
              try {
                switch (serverState) {
                  case ServerState.Running: {
                    setServerState(ServerState.Stopping)
                    await mainAPI.Server.stop()
                    updateConfig(config => {
                      config.server.running = false
                    })
                    break
                  }
                  case ServerState.Stopped: {
                    setServerState(ServerState.Starting)
                    await mainAPI.Server.start(
                      config.server.hostname
                    , config.server.port
                    )
                    updateConfig(config => {
                      config.server.running = true
                    })
                    break
                  }
                }
              } finally {
                setServerState(await mainAPI.Server.getState())
              }
            }}
          >
            {go(() => {
              switch (serverState) {
                case ServerState.Running: return 'Stop Server'
                case ServerState.Stopped: return 'Start Server'
                default: return 'Unknown'
              }
            })}
          </button>
        </div>
      </div>

      <Headline>Silent Mode</Headline>
      <div>
        <div className='space-y-2'>
          <div>Silent Mode: {config.silentMode ? 'On' : 'Off'}</div>
          <Switch
            checked={config.silentMode}
            onChange={value => {
              updateConfig(config => {
                config.silentMode = value
              })
            }}
            className={'bg-gray-300 py-1 px-2'}
          >
            <span>
              {config.silentMode ? 'Turn Off' : 'Turn On'}
            </span>
          </Switch>
        </div>
      </div>
    </div>
  )
}

function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h2 className='font-bold text-lg border-b mt-4 mb-2'>{children}</h2>
  )
}
