import { useState, useContext } from 'react'
import { MainAPIContext } from '@renderer/app-context.js'
import { Switch } from '@headlessui/react'
import { useEffectAsync, useMountAsync } from 'extra-react-hooks'
import { useSelector, useUpdater } from 'extra-react-store'
import { ConfigStore, ConfigStoreContext } from '@renderer/utils/config-store.js'
import { Loading } from '@components/loading.jsx'

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
       : <Loading />
}

function Config() {
  const mainAPI = useContext(MainAPIContext)
  const config = useSelector(ConfigStoreContext, state => state)
  const updateConfig = useUpdater(ConfigStoreContext)
  const [isServerRunning, setIsServerRunning] = useState<boolean>(false)

  useMountAsync(async () => {
    const isServerRunning = await mainAPI.Server.isServerRunning()
    setIsServerRunning(isServerRunning)
  })

  return (
    <div className='p-5'>
      <Headline>HTTP Server</Headline>
      <div className='space-y-4'>
        <div className='max-w-md grid grid-cols-4 gap-y-2 gap-x-2 items-center'>
          <label className=''>Hostname</label>
          <input type='text' className='px-1 py-0.5 border col-span-3'
            disabled={isServerRunning}
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
            disabled={isServerRunning}
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
            {`Server Status: ${isServerRunning ? 'Running' : 'Stopped'}`}
          </div>
          <Switch
            checked={isServerRunning}
            onChange={async enabled => {
              if (enabled) {
                await mainAPI.Server.startServer(config.server.hostname, config.server.port)
              } else {
                await mainAPI.Server.stopServer()
              }
              setIsServerRunning(enabled)
            }}
            className={'bg-gray-300 py-1 px-2'}
          >
            <span>
              {isServerRunning ? 'Stop Server' : 'Start Server'}
            </span>
          </Switch>
        </div>
      </div>

      <Headline>Silent Mode</Headline>
      <div>
        <div className='space-y-2'>
          <div>{`Silent Mode: ${config.silentMode ? 'On' : 'Off'}`}</div>
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
