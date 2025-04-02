import { useRef, useContext, useLayoutEffect } from 'react'
import { Notification } from '@components/notification.jsx'
import { MainAPIContext } from '@renderer/notification-context.js'
import { useResizeObserver, useMount } from 'extra-react-hooks'
import { useImmer } from 'use-immer'
import { newNotificationObservable } from '@renderer/notification-context.js'
import { INotificationRecord } from '@src/contract.js'
import { assert } from '@blackglory/prelude'

export function NotificationPage() {
  const [notificationList, updateNotificationList] = useImmer<INotificationRecord[]>([])
  const mainAPI = useContext(MainAPIContext)
  const containerRef = useRef<HTMLDivElement>(null)

  useMount(() => {
    const subscription = newNotificationObservable.subscribe(newNotifications => {
      updateNotificationList(list => {
        list.push(...newNotifications)
      })
    })
    
    return () => subscription.unsubscribe()
  })

  useResizeObserver(() => {
    resizeHandler()
  }, [containerRef])

  useLayoutEffect(() => {
    resizeHandler()
  }, [notificationList])

  return (
    <div ref={containerRef} className='min-w-[24rem] space-y-1'>
      {Array.from(notificationList).reverse().map(notification => (
        <Notification
          key={notification.id}
          title={notification.title}
          message={notification.message}
          iconUrl={notification.iconUrl}
          imageUrl={notification.imageUrl}
          timestamp={notification.timestamp}
          onClick={
            notification.url
            ? () => {
                openURL(notification.url!)
                closeNotification(notification.id)
              }
            : undefined
          }
          onCloseButtonClick={() => closeNotification(notification.id)}
        />
      ))}
    </div>
  )

  function closeNotification(id: number): void {
    updateNotificationList(list => {
      const index = list.findIndex(x => x.id === id)
      if (index !== -1) {
        list.splice(index, 1)
      }
    })
  }

  async function resizeHandler(): Promise<void> {
    const container = containerRef.current
    assert(container)

    await updateWindowSize(container)
  }

  async function updateWindowSize(element: HTMLElement): Promise<void> {
    const rect = element.getBoundingClientRect()
    await mainAPI.resizeWindow(rect.width, rect.height)
  }
}

function openURL(url: string): void {
  window.open(url)
}
