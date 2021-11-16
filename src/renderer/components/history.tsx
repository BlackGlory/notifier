import { Notification } from '@components/notification'
import { useImmer } from 'use-immer'
import { useSubscription } from 'observable-hooks'
import { newNotificationObservable } from '@renderer/apis/app'

export function History() {
  const [notificationList, updateNotificationList] = useImmer<INotification[]>([])

  useSubscription(newNotificationObservable, newNotifications => {
    updateNotificationList(list => {
      list.push(...newNotifications)
    })
  })

  return (
    <div>
      <h2>History</h2>
      <div className='space-y-1'>
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
                }
              : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}

function openURL(url: string): void {
  window.open(url)
}
