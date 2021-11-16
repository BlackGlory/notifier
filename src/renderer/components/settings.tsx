import { useState, useContext } from 'react'
import { MainAPIContext } from '@renderer/app-context'
import { Switch } from '@headlessui/react'

export function Settings() {
  const mainAPI = useContext(MainAPIContext)
  const [silentMode, setSilentMode] = useState(false)

  return (
    <div>
      <h2 className='text-lg border-b'>HTTP Server</h2>
      <div>
        <label>Port: <input type='number' className='border' /></label>
        <button className='bg-gray-400 p-2'
          onClick={() => mainAPI.startServer(8989)}
        >Start Server</button>
        <button className='bg-gray-400 p-2'
          onClick={() => mainAPI.stopServer()}
        >Stop Server</button>
      </div>

      <h2 className='text-lg border-b'>Silent Mode</h2>
      <Switch checked={silentMode} onChange={setSilentMode}></Switch>
    </div>
  )
}
