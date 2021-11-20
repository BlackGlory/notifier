import Store from 'electron-store'

interface IConfigV0_1_0 {
  server: {
    hostname: string
    port: number
  }
, silentMode: boolean
}

let store: Store<IConfigV0_1_0>

export function initConfig(filename?: string) {
  store = new Store<IConfigV0_1_0>({
    cwd: filename
  , accessPropertiesByDotNotation: false
  , schema: {
      server: {
        type: 'object'
      , default: {
          hostname: 'localhost'
        , port: 8080
        }
      , properties: {
          hostname: {
            type: 'string'
          }
        , port: {
            type: 'integer'
          , minimum: 1
          }
        }
      }
    , silentMode: {
        type: 'boolean'
      , default: false
      }
    }
  })
}

export function setServer(hostname: string, port: number): void {
  store.set('server', { hostname, port })
}

export function setServerHostname(hostname: string): void {
  store.set('server', {
    hostname
  , port: store.get('server').port
  })
}

export function setServerPort(port: number): void {
  store.set('server', {
    hostname: store.get('server').hostname
  , port
  })
}

export function getServer(): { hostname: string; port: number } {
  return store.get('server')
}

export function setSilentMode(value: boolean): void {
  store.set('silentMode', value)
}

export function getSilentMode(): boolean {
  return store.get('silentMode')
}

export function resetConfig(): void {
  store.clear()
}
