export interface IConfig {
  server: {
    hostname: string
    port: number
    running: boolean
  }
, silentMode: boolean
}

export enum ServerState {
  Starting
, Running
, Stopping
, Stopped
, Error
}

export interface IAppMainAPI {
  ping(): string

  Server: {
    start(hostname: string, port: number): void
    stop(): void
    getState(): ServerState
  }

  Config: {
    set(value: IConfig): void
    get(): IConfig
  }

  Database: {
    addNotifications(notifications: INotification[]): INotificationRecord[]

    deleteNotification(id: number): void

    queryNotifications(params: {
      limit: number
      lastId?: number
      offset?: number
    }): INotificationRecord[]
  }
}

export interface INotificationMainAPI {
  ping(): string

  resizeWindow(width: number, height: number): void
}

export interface INotificationRendererAPI{
  ping(): string

  notify(notifications: INotificationRecord[]): void
}

export interface IAppRendererAPI {
  ping(): string

  notify(notifications: INotificationRecord[]): void
}

export interface IServerAPI {
  notify: (notifications: INotification[]) => void
}

export interface INotificationRecord {
  id: number
  timestamp: number

  title: string | null
  message: string | null
  iconUrl: string | null
  imageUrl: string | null
  url: string | null
}

export interface INotification {
  title?: string | null
  message?: string | null
  iconUrl?: string | null
  imageUrl?: string | null
  url?: string | null
}
