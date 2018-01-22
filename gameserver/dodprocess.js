'use strict'

// Require Modules
const debug = require('./debug.js')

const handle = (signal) => {
    debug.logServer(`Received signal [${signal}] ... Exiting`)
    process.exit();
}

process.on('SIGINT', () => {
    debug.logServer('Received interupt signal (CTRL-C) ... Exiting')
    process.exit();
})
