'use strict'

// Require Modules
const debug = require('./debug.js')
const dodproc = require('./dodprocess.js')
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

// Handle connection from client
io.on('connection', (socket) => {

    // Make sure not too many clients
    var numPlayers = dodGame.getCountOfPlayers()
    if (numPlayers > 10) {
        socket.emit('disconnect', { message: 'This game is already full.' })
        return;
    }

    // Disconnect handler
    socket.on('disconnect', function() {
        debug.logSocket(`Disconnected: ${socket.id}`)
        dodGame.removePlayer(socket.id)
    })

    socket.on('getDungeon', () => {
        debug.logSocket(`<= getDungeon()`)
        socket.emit('dungeon', dodGame.getDungeon())
    })

    socket.on('addPlayer', (playerConfig) => {
        debug.logSocket(`<= addPlayer(id: ${socket.id})`)
        dodGame.addPlayer(socket.id, playerConfig)
        socket.emit('players', dodGame.getPlayers())
        socket.broadcast.emit('players', dodGame.getPlayers())
    })
});



