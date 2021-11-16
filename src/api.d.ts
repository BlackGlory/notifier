interface INotification {
  uuid: string
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
  startServer(port: number): void
  stopServer(): void
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
