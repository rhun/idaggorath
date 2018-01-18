'use strict'

const debug = require('./debug.js')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const _ = require('underscore')
const path = require('path')

const app = express()
const server = http.Server(app)
const io = socketio(server)

const DodGame = require('./dodgame.js')
const dodGame = new DodGame()

const port = 58181
const root = path.join(__dirname, '../gameclient')

server.listen(port)
// debug.logServer(`Static root: [${root}]`)
// debug.logServer(`Listening on port: [${port}]`)

app.use((req, res, next) => {
    // debug.logExpress(`[${Date.now()}]: ${req.originalUrl}`)
    next()
});

app.use(express.static(root));

io.on('connection', (client) => {

    // Make sure not too many clients
    var numClients = Object.keys(io.sockets.connected).length
    if (numClients > 10) {
        io.to(client.id).emit('disconnect', {message: 'Too many users!'})
    }

    // Disconnect handler
    client.on('disconnect', function() {
        // debug.logSocket(`Disconnected client [${client.id}]`)
        // debug.logSocket(`Connection count [${Object.keys(io.sockets.connected).length}]`)
    })

    // debug message
    // debug.logSocket(`Connected client [${client.id}]`)
    // debug.logSocket(`Connection count [${numClients}]`)

    client.on('getMap', (level) => {
        debug.logSocket(`<= getMap(${level})`)

        let data = dodGame.dungeon.levels[level]

        io.emit('getMap', data)
    })
});



