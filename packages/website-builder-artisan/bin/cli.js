#!/usr/bin/env node

'use strict'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err
})

const path = require('path')

const spawn = require('cross-spawn')

const args = process.argv.slice(2)

const script = path.join(__dirname, '..', 'dist', 'artisan.js')

const result = spawn.sync('node', [script, ...args], {
  stdio: 'inherit',
})

if (result.signal) {
  if (result.signal === 'SIGKILL') {
    console.log(
      'The build failed because the process exited too early. ' +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.'
    )
  }

  if (result.signal === 'SIGTERM') {
    console.log(
      'The build failed because the process exited too early. ' +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.'
    )
  }

  process.exit(1)
}

process.exit(result.status)
