interface INotification {
  id: string
  timestamp: number 
  title?: string
  message?: string
  iconUrl?: string
  imageUrl?: string
  url?: string
  senderId?: string
}

interface IAppMainAPI {
  ping(): string

  Server: {
    startServer(hostname: string, port: number): void
    stopServer(): void
    isServerRunning(): boolean
  }

  Config: {
    setServerHostname(hostname: string): void
    setServerPort(port: number): void
    setServer(hostname: string, port: number): void
    getServer(): {
      hostname: string
      port: number
    }

    setSilentMode(value: boolean): void
    getSilentMode(): boolean
  }

  Database: {
    addNotifications(notifications: INotification[]): Promise<void> 
    deleteNotification(id: string): Promise<void>
    queryNotificationsById(
      beforeThisId: string
    , options: {
        limit: number
      , skip?: number
      }
    ): Promise<INotification[]>
    queryNotificationsByTimestamp(
      beforeThisTimestamp: number 
    , options: {
        limit: number
      , skip?: number
      }
    ): Promise<INotification[]>
  }
}

interface INotificationMainAPI {
  ping(): string
  resizeWindow(width: number, height: number): void
}

interface INotificationRendererAPI{
  ping(): string
  notify(notifications: INotification[]): void
}

interface IAppRendererAPI {
  ping(): string
  notify(notifications: INotification[]): void
}
