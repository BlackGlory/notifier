import 'simplebar/dist/simplebar.min.css'
import classNames from 'classnames'
import SimpleBar from 'simplebar-react'
import { XIcon } from '@heroicons/react/solid'

interface INotificationProps {
  title?: string
  message?: string
  iconUrl?: string
  imageUrl?: string
  timestamp?: number
  senderId?: string

  onClick?: () => void
  onCloseButtonClick?: () => void
}

export function Notification(props: INotificationProps) {
  const {
    title, message, iconUrl, imageUrl, timestamp, senderId
  , onClick, onCloseButtonClick
  } = props
  const date = timestamp ? new Date(timestamp) : undefined

  return (
    <div
      onClick={onClick}
      className={classNames('bg-white flex flex-col border select-none', {
        'cursor-pointer': onClick
      })}
    >
      <div className='flex'>
        {iconUrl && (
          <div className='flex-shrink-0 w-20 h-20'>
            <img src={iconUrl} />
          </div>
        )}
        <div className='flex-1'>
          <div className='flex flex-col justify-between min-h-20 p-1.5 pr-0 space-y-0.5'>
            {title && <h2 className='font-semibold'>{title}</h2>}
            {message && (
              <SimpleBar className='max-h-20 text-sm' timeout={300}>
                <span className='break-words leading-tight'>{message}</span>
              </SimpleBar>
            )}
            <div className='flex-1' />
            {(date ?? senderId) && (
              <p className='text-sm text-gray-400 space-x-1'>
                {date && (
                  <time dateTime={date.toISOString()} title={date.toLocaleString()}>
                    {date.toLocaleTimeString()}
                  </time>
                )}
                {senderId && <span>{senderId}</span>}
              </p>
            )}
          </div>
        </div>
        {onCloseButtonClick && (
          <div>
            <button className='hover:bg-gray-200 p-0.5' onClick={evt => {
              evt.stopPropagation()
              onCloseButtonClick()
            }}>
              <XIcon className='w-4 h-4 text-gray-500' />
            </button>
          </div>
        )}
      </div>
      {imageUrl && (
        <div className='flex justify-center items-center bg-black'>
          <img className='max-h-64' src={imageUrl} />
        </div>
      )}
    </div>
  )
}
