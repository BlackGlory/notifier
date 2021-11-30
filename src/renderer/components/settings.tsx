import { useState, useContext } from 'react'
import { MainAPIContext } from '@renderer/app-context'
import { Switch } from '@headlessui/react'
import { useMount } from 'extra-react-hooks'
import { go } from '@blackglory/go'
import classNames from 'classnames'
import { all } from 'extra-promise'

export function Settings() {
  const mainAPI = useContext(MainAPIContext)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isServerRunning, setIsServerRunning] = useState<boolean>(false)
  const [serverHostname, setServerHostname] = useState<string>('localhost')
  const [serverPort, setServerPort] = useState<number>(8080)
  const [silentMode, setSilentMode] = useState<boolean>(false)

  useMount(() => {
    go(async () => {
      const { server, silentMode, isServerRunning } = await all({
        isServerRunning: mainAPI.Server.isServerRunning()
      , silentMode: mainAPI.Config.getSilentMode()
      , server: mainAPI.Config.getServer()
      })
      
      setServerHostname(server.hostname)
      setServerPort(server.port)
      setSilentMode(silentMode)
      setIsServerRunning(isServerRunning)
      setIsLoaded(true)
    })
  })

  return (
    <div className={classNames('m-5', { 'hidden': !isLoaded })}>
      <Headline>HTTP Server</Headline>
      <div className='space-y-4'>
        <div className='max-w-md grid grid-cols-4 gap-y-2 gap-x-2 items-center'>
          <label className=''>Hostname</label>
          <input type='text' className='px-1 py-0.5 border col-span-3'
            value={serverHostname}
            onChange={async event => {
              const hostname = event.target.value
              setServerHostname(hostname)
              await mainAPI.Config.setServerHostname(hostname)
            }}
          />

          <label className=''>Port</label>
          <input type='number' className='p-1 py-0.5 border col-span-3'
            value={serverPort}
            onChange={async event => {
              const port = event.target.valueAsNumber
              setServerPort(port)
              await mainAPI.Config.setServerPort(port)
            }}
          />
        </div>

        <div className='space-y-2'>
          <div>
            {`Server Status: ${isServerRunning ? 'Running' : 'Stopped'}`}
          </div>
          <Switch
            checked={isServerRunning}
            onChange={async on => {
              if (on) {
                await mainAPI.Server.startServer(serverHostname, serverPort)
              } else {
                await mainAPI.Server.stopServer()
              }
              setIsServerRunning(on)
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
          <div>{`Silent Mode: ${silentMode ? 'On' : 'Off'}`}</div>
          <Switch
            checked={silentMode}
            onChange={async value => {
              setSilentMode(value)
              await mainAPI.Config.setSilentMode(value)
            }}
            className={'bg-gray-300 py-1 px-2'}
          >
            <span>
              {silentMode ? 'Turn Off' : 'Turn On'}
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
