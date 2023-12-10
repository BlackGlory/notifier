import { BrowserWindow, screen } from 'electron'
import { INotificationMainAPI } from '@src/contract.js'

export function createNotificationMainAPI(window: BrowserWindow): INotificationMainAPI {
  return {
    ping() {
      return 'pong'
    }
    /*
     * 当窗口被放大时, 会发生闪烁.
     */
  , resizeWindow(width, height) {
      if (width === 0 || height === 0) {
        // 在Windows这样的操作系统上, 对窗口的最小尺寸有限制, 无法设置为0尺寸, 因此直接隐藏窗口.
        // https://github.com/electron/electron/issues/28320
        window.hide()
      } else {
        const displaySize = getWorkAreaSize()
        const margin = 4
        const x = displaySize.width - width - margin
        const y = displaySize.height - height - margin

        // 注1: renderer通过`element.getBoundingClientRect()`获得的尺寸可能有小数值,
        //      该方法无法处理小数值, 因此需要对参数四舍五入.
        // 注2: 修改窗口的position会导致窗口闪烁.
        window.setBounds({
          x: Math.round(x)
        , y: Math.round(y)
        , width: Math.round(width)
        , height: Math.round(height)
        })

        window.show()
      }
    }
  }
}

/**
 * 获取主显示器工作区域的尺寸(不包含任务栏的尺寸)
 */
function getWorkAreaSize(): { width: number; height: number } {
  return screen.getPrimaryDisplay().workAreaSize
}
