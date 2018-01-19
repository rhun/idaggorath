'use strict'

module.exports = class RowCol {
    constructor() {
        this.row = 0
        this.col = 0
    }

    setByIdx(idx) {
        this.row = Math.trunc(idx / 32)
        this.col = idx % 32
    }

    setRC(r, c) {
        this.row = r
        this.col = c
    }
}