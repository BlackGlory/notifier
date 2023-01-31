import { Notification } from '@components/notification'
import { useImmer } from 'use-immer'
import { newNotificationObservable } from '@renderer/app-context'
import { useMount } from 'extra-react-hooks'
import { useContext } from 'react'
import { MainAPIContext } from '@renderer/app-context'
import { go } from '@blackglory/go'
import { INotification } from '@src/contract'

export function History() {
  const [notificationList, updateNotificationList] = useImmer<INotification[]>([])
  const mainAPI = useContext(MainAPIContext)

  useMount(() => {
    go(async () => {
      const notifications = await mainAPI.Database.queryNotificationsByTimestamp(
        Date.now()
      , { limit: 100 }
      )

      updateNotificationList(list => {
        list.push(...notifications)
      })
    })
  })

  useMount(() => {
    const subscription = newNotificationObservable.subscribe(newNotifications => {
      updateNotificationList(list => {
        list.unshift(...newNotifications)
      })
    })

    return () => subscription.unsubscribe()
  })

  return (
    <div className='mx-auto max-w-[24rem] m-5 space-y-1'>
      {Array.from(notificationList).map(notification => (
        <Notification 
          key={notification.id}
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
              }
            : undefined
          }
          onCloseButtonClick={() => deleteNotification(notification.id)}
        />
      ))}
    </div>
  )

  async function deleteNotification(id: string): Promise<void> {
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
