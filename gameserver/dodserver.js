'use strict'

// Require Modules
const debug = require('./debug.js')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const _ = require('underscore')
const path = require('path')
const DodGame = require('./dod/dodgame.js')

// Create Networking Objects
const app = express()
const server = http.Server(app)
const io = socketio(server)
const port = 58181
const root = path.join(__dirname, '../gameclient')

// Start iDaggorath Server
server.listen(port)
app.use(express.static(root));

// Create Daggorath Game
const dodGame = new DodGame()

io.on('connection', (client) => {

    // Make sure not too many clients
    var numClients = Object.keys(io.sockets.connected).length
    if (numClients > 10) {
        io.to(client.id).emit('disconnect', { message: 'Too many users!' })
    }

    // Disconnect handler
    client.on('disconnect', function() {
        // debug.logSocket(`Disconnected client [${client.id}]`)
        // debug.logSocket(`Connection count [${Object.keys(io.sockets.connected).length}]`)
    })

    client.on('getMap', (level) => {
        debug.logSocket(`<= getMap(${level})`)

        let data = dodGame.dungeon.levels[level]

        io.emit('getMap', data)
    })
});



