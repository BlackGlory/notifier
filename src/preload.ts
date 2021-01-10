import { ipcRenderer, contextBridge } from 'electron'
import { UniversalNotification } from 'universal-notification'
import { Deferred } from 'extra-promise'

const deferred = new Deferred<UniversalNotification>()

ipcRenderer.once('notification', (evt, notification: UniversalNotification) => {
  deferred.resolve(notification)
})

contextBridge.exposeInMainWorld('API', {
  async getNotification() {
    return await deferred
  }
})
