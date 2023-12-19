import { Settings } from '@components/settings.jsx'
import { History } from '@components/history.jsx'
import { AdjustmentsVerticalIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Tab } from '@headlessui/react'
import classNames from 'classnames'

interface ITab {
  id: string
  header: React.ReactNode
  content: React.ReactNode
}

export function AppPage() {
  const tabs: ITab[] = [
    {
      id: 'settings'
    , header: <>
        <AdjustmentsVerticalIcon className='w-7 h-7' />
        <span>Settings</span>
      </>
    , content: <Settings />
    }
  , {
      id: 'history'
    , header: <>
        <ClockIcon className='w-7 h-7' />
        <span>History</span>
      </>
    , content: <History />
    }
  ]

  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <Tab.Group>
        <Tab.List className='flex'>
          {tabs.map(tab => (
            <Tab
              key={tab.id}
              className={({ selected }) => classNames(
                'text-gray-800 bg-gray-300 hover:bg-gray-200 w-full h-20 flex flex-col justify-center items-center border-b-2 outline-none'
              , selected ? 'border-blue-500': 'border-transparent'
              )}
            >{tab.header}</Tab>
          ))}
        </Tab.List>
        <Tab.Panels className='overflow-hidden'>
          {tabs.map(tab => (
            <Tab.Panel key={tab.id} className='h-full overflow-y-auto'>
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
