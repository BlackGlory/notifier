import LoadingIcons from 'react-loading-icons'

export function Loading() {
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-4'>
      <LoadingIcons.Oval stroke='#000000' strokeWidth={6} />
      <span className='text-sm font-semibold'>Loading</span>
    </div>
  )
}
