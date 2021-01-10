import { UniversalNotification } from 'universal-notification'
import { spawn } from 'child_process'

export function notify(notification: UniversalNotification): void {
  const proc = spawn('npm', ['run', '--silent', 'start', escape(JSON.stringify(notification))], {
    stdio: 'ignore'
  , shell: true
  , detached: true
  , windowsHide: true
  })

  proc.unref()
}

function escape(str: string): string {
  const result = str.replace(/"/g, '\\"')
  return result
}
