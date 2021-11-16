import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Settings } from '@components/settings'
import { History } from '@components/history'
import { AdjustmentsIcon, ClockIcon } from '@heroicons/react/outline'

export function AppPage() {
  return (
    <BrowserRouter>
      <div className='h-screen flex flex-col'>
        <nav className='flex bg-gray-300'>
          <div className='flex-1'>
            <Link to='/settings'>
              <div className='text-gray-800 hover:bg-gray-200 w-full h-20 flex flex-col justify-center items-center'>
                <AdjustmentsIcon className='w-7 h-7' />
                <span>Settings</span>
              </div>
            </Link>
          </div>
          <div className='flex-1'>
            <Link to='/history'>
              <div className='text-gray-800 hover:bg-gray-200 w-full h-20 flex flex-col justify-center items-center'>
                <ClockIcon className='w-7 h-7' />
                <span>History</span>
              </div>
            </Link>
          </div>
        </nav>
        <div className='flex-grow'>
          <Routes>
            <Route path='/settings' element={<Settings />} />
            <Route path='/history' element={<History />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
