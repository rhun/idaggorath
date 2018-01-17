'use strict'

const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const _ = require('underscore')
const path = require('path')

const app = express()
const server = http.Server(app)
const io = socketio(server)

const port = 58181
const root = path.join(__dirname, '../gameclient')

server.listen(port)

console.log('Static root is: ' + root)
console.log('Listening on port ' + port)

app.use((req, res, next) => {
    console.log('[' + Date.now() + ']: ' + req.originalUrl);
    console.log('ROOT: ' + path.join(__dirname, '../gameclient'));
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
        console.log("Disconnected client " + client.id)
        console.log((Object.keys(io.sockets.connected).length || "no") + " connections")
    })

    // debug message
    console.log("Connected client " + client.id)
    console.log((numClients || "no") + " connections")

});




