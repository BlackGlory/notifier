import { useRef, useContext, useLayoutEffect } from 'react'
import { Notification } from '@components/notification'
import { MainAPIContext } from '@renderer/notification-context'
import { useResizeObserver } from 'extra-react-hooks'
import { useImmer } from 'use-immer'
import { newNotificationObservable } from '@renderer/apis/notification'
import { useSubscription } from 'observable-hooks'

export function NotificationPage() {
  const [notificationList, updateNotificationList] = useImmer<INotification[]>([])
  const mainAPI = useContext(MainAPIContext)
  const container = useRef<HTMLDivElement>(null)

  useSubscription(newNotificationObservable, newNotifications => {
    updateNotificationList(list => {
      list.push(...newNotifications)
    })
  })

  useResizeObserver(() => {
    resizeHandler()
  }, [container])

  useLayoutEffect(() => {
    resizeHandler()
  }, [notificationList])

  return (
    <div ref={container} className='min-w-96 space-y-1'>
      {Array.from(notificationList).reverse().map(notification => (
        <Notification 
          key={notification.uuid}
          title={notification.title}
          message={notification.message}
          iconUrl={notification.iconUrl}
          imageUrl={notification.imageUrl}
          timestamp={notification.timestamp}
          senderId={notification.senderId}
          onClick={
            notification.url
            ? () => {
                openURL(notification.url!)
                closeNotification(notification.uuid)
              }
            : undefined
          }
          onCloseButtonClick={() => closeNotification(notification.uuid)}
        />
      ))}
    </div>
  )

  function closeNotification(uuid: string) {
    updateNotificationList(list => {
      const index = list.findIndex(x => x.uuid === uuid)
      if (index !== -1) {
        list.splice(index, 1)
      }
    })
  }

  async function resizeHandler(): Promise<void> {
    await updateWindowSize(container.current!)
  }

  async function updateWindowSize(element: HTMLElement): Promise<void> {
    const rect = element.getBoundingClientRect()
    await mainAPI.resizeWindow(rect.width, rect.height)
  }
}

function openURL(url: string): void {
  window.open(url)
}
