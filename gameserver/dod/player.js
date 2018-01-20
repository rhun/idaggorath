'use strict'

module.exports = class Player {
    constructor(id, playerConfig) {
        this.id = id,
        this.level = playerConfig.position.level
        this.row = playerConfig.position.row
        this.col = playerConfig.position.col
        this.dir = playerConfig.position.dir
    }
}