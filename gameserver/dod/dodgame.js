/*
    This file defines the interface to a Daggorath game.
    All interaction with a game should go through this file.
    Clients / users should not reach into the internal objects.
*/

'use strict'

const debug = require('../debug.js')
const Dungeon = require('./dungeon.js')
const Player = require('./player.js')
const _ = require('underscore')

module.exports = class DodGame {
    // Default constructor
    constructor() {
        this.dungeon = new Dungeon()
        this.dungeon.CreateAllFiveOriginalLevels()
        this.players = []
        debug.logSocket(`Dungeon created`)
        debug.logSocket(`Player count = ${this.players.length}`)
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
    
    getCountOfPlayers() {
        return this.players.length
    }

    // Mutators
    addPlayer(id, playerConfig) {
        this.players.push(new Player(id, playerConfig))
        debug.logSocket(`Player count = ${this.players.length}`)
    }

    removePlayer(id) {
        for (let i = 0; i < this.players.length; ++i) {
            let p = this.players[i];
            if (p && p.id === id) {
                this.players[i] = undefined
                break
            }
        }
        this.players = _.compact(this.players)
        debug.logSocket(`Player count = ${this.players.length}`)
    }
}