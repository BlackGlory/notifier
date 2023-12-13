export interface IConfig {
  server: {
    hostname: string
    port: number
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
    addNotifications(notifications: INotificationRecord[]): Promise<void> 
    deleteNotification(id: string): Promise<void>
    queryNotificationsById(
      beforeThisId: string
    , options: {
        limit: number
      , skip?: number
      }
    ): Promise<INotificationRecord[]>
    queryNotificationsByTimestamp(
      beforeThisTimestamp: number 
    , options: {
        limit: number
      , skip?: number
      }
    ): Promise<INotificationRecord[]>
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
  id: string
  timestamp: number

  title?: string
  message?: string
  iconUrl?: string
  imageUrl?: string
  url?: string
}

export interface INotification {
  title?: string | null
  message?: string | null
  iconUrl?: string | null
  imageUrl?: string | null
  url?: string | null
}
