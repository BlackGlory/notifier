import { ipcRenderer } from 'electron'

window.addEventListener('message', event => {
  if (event.data === 'message-port-for-server') {
    const [port] = event.ports
    ipcRenderer.postMessage('app-message-port-for-server', null, [port])
    return
  }

  if (event.data === 'message-port-for-client') {
    const [port] = event.ports
    ipcRenderer.postMessage('app-message-port-for-client', null, [port])
    return
  }
})
