import { useState, useContext } from 'react'
import { MainAPIContext } from '@renderer/app-context'
import { Switch } from '@headlessui/react'
import { useMount } from 'extra-react-hooks'
import { go } from '@blackglory/go'

export function Settings() {
  const mainAPI = useContext(MainAPIContext)
  const [serverRunning, setServerRunning] = useState<boolean>(false)
  const [serverHostname, setServerHostname] = useState<string>('localhost')
  const [serverPort, setServerPort] = useState<number>(8080)
  const [silentMode, setSilentMode] = useState<boolean>(false)

  useMount(() => {
    go(async () => {
      setServerRunning(await mainAPI.Server.isServerRunning())
    })

    go(async () => {
      setSilentMode(await mainAPI.Config.getSilentMode())
    })

    go(async () => {
      const { hostname, port } = await mainAPI.Config.getServer()
      setServerHostname(hostname)
      setServerPort(port)
    })
  })

  return (
    <div className='m-5'>
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
            {`Server Status: ${serverRunning ? 'Running' : 'Stopped'}`}
          </div>
          <Switch
            checked={serverRunning}
            onChange={async on => {
              if (on) {
                await mainAPI.Server.startServer(serverHostname, serverPort)
              } else {
                await mainAPI.Server.stopServer()
              }
              setServerRunning(on)
            }}
            className={'bg-gray-300 py-1 px-2'}
          >
            <span>
              {serverRunning ? 'Stop Server' : 'Start Server'}
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
