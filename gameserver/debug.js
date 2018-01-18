'use strict'

const logServer = msg => {
    console.log(`SERVER: ${msg}`)
}

const logExpress = msg => {
    console.log(`EXPRESS: ${msg}`)
}

const logSocket = msg => {
    console.log(`SOCKET: ${msg}`)
}

module.exports.logServer = logServer
module.exports.logExpress = logExpress
module.exports.logSocket = logSocket