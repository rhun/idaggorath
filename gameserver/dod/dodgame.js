/*
    This file defines the interface to a Daggorath game.
    All interaction with a game should go through this file.
    Clients / users should not reach into the internal objects.
*/

'use strict'

const debug = require('../debug.js')
const Dungeon = require('./dungeon.js')
const Player = require('./player.js')

module.exports = class DodGame {
    // Default constructor
    constructor() {
        this.dungeon = new Dungeon()
        this.dungeon.CreateAllFiveOriginalLevels()
        this.players = []
    }

    // Accessors
    getDungeon() {
        return this.dungeon.getData()
    }

    getPlayers() {
        let p = []
        for (let i = 0; i < this.players.length; ++i) {
            if (this.players[i]) {
                p.push(this.players[i])
            }
        }
        return p
    }

    // Mutators
    addPlayer(id, playerConfig) {
        let added = false
        let player = new Player(id, playerConfig)
        for (let i = 0; i < this.players.length; ++i) {
            if (this.players[i] === undefined) {
                this.players[i] = player
                added = true
            }
        }
        if (!added) {
            this.players.push(player)
        }
    }

    removePlayer(id) {
        for (let i = 0; i < this.players.length; ++i) {
            if (this.players[i].id === id) {
                this.players[i] = undefined
            }
        }
    }
}