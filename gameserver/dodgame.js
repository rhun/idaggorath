'use strict'

const Dungeon = require('./dungeon.js')

module.exports = class DodGame {
    constructor() {
        this.dungeon = new Dungeon()
        this.dungeon.CreateAllFiveOriginalLevels()
        //this.dungeon.printMaze(2)

        this.player = {
            level: 0,
            row: 12,
            col: 22,
            dir: 0
        }
    }
}