#!/usr/bin/env node
import { program } from 'commander'
import { notify } from './electron'
import * as readline from 'readline'
import { parseUniversalNotification } from 'universal-notification'

program
  .name('unotify')
  .version(require('../package.json').version)
  .description(require('../package.json').description)
  .action(async () => {
    const stdin = readline.createInterface({ input: process.stdin })

    for await (const line of stdin) {
      const notification = parseUniversalNotification(line)
      if (notification) {
        notify(notification)
      } else {
        console.error(`"${line}" is not a valid UniversalNotification object.`)
      }
    }
  })
  .parse()
