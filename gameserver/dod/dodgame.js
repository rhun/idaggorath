'use strict'

const Dungeon = require('./dungeon.js')
const Player = require('./player.js')

module.exports = class DodGame {
    constructor() {
        this.dungeon = new Dungeon()
        this.dungeon.CreateAllFiveOriginalLevels()
        //this.dungeon.printMaze(2)

        this.player = new Player()
    }

    getDungeonData() {
        return this.dungeon.getData()
    }
}