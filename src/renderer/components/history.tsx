import { Notification } from '@components/notification.jsx'
import { useImmer } from 'use-immer'
import { newNotificationObservable } from '@renderer/app-context.js'
import { useMount, useMountAsync, useIntersectionObserver } from 'extra-react-hooks'
import { useContext, useRef } from 'react'
import { MainAPIContext } from '@renderer/app-context.js'
import { INotificationRecord } from '@src/contract.js'
import { isntEmptyArray } from '@blackglory/prelude'

export function History() {
  const mainAPI = useContext(MainAPIContext)
  const [notificationList, updateNotificationList] = useImmer<INotificationRecord[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useIntersectionObserver(async entries => {
    if (isntEmptyArray(notificationList) && entries.some(entry => entry.isIntersecting)) {
      const notifications = await mainAPI.Database.queryNotifications({
        limit: 50
      , lastId: notificationList[notificationList.length - 1].id
      })

      if (isntEmptyArray(notifications)) {
        updateNotificationList(list => {
          list.push(...notifications)
        })
      }
    }
  }, [bottomRef], [notificationList])

  useMountAsync(async () => {
    const notifications = await mainAPI.Database.queryNotifications({ limit: 50 })

    updateNotificationList(notifications)
  })

  useMount(() => {
    const subscription = newNotificationObservable.subscribe(newNotifications => {
      updateNotificationList(list => {
        list.unshift(...newNotifications)
      })
    })

    return () => subscription.unsubscribe()
  })

  return <>
    <div className='py-5 mx-auto max-w-[24rem] space-y-1'>
      {Array.from(notificationList).map(notification => (
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
              }
            : undefined
          }
          onCloseButtonClick={() => deleteNotification(notification.id)}
        />
      ))}
    </div>
    <div ref={bottomRef}></div>
  </>

  async function deleteNotification(id: number): Promise<void> {
    await mainAPI.Database.deleteNotification(id)
    updateNotificationList(list => {
      const index = list.findIndex(x => x.id === id)
      if (index !== -1) {
        list.splice(index, 1)
      }
    })
  }
}

function openURL(url: string): void {
  window.open(url)
}
