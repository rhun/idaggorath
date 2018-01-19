'use strict'

class Dod {
    constructor() {

        // Set up Constants

        this.N_WALL = 0x03          // North mask
        this.E_WALL = 0x0C          // East mask
        this.S_WALL = 0x30          // South mask
        this.W_WALL = 0xC0          // West mask

        this.HF_PAS = 0             // Open passage
        this.HF_DOR = 1             // Regular door
        this.HF_SDR = 2             // Secret (magic) door
        this.HF_WAL = 3             // Wall

        this.ALL_WALLS = 0xFF       // Room with all walls

        this.VF_HOLE_UP = 0         // Hole in ceiling
        this.VF_LADDER_UP = 1       // Ladder in ceiling
        this.VF_HOLE_DOWN = 2       // Hole in floor
        this.VF_LADDER_DOWN = 3     // Ladder in floor
        this.VF_NULL = 0xFF         // No hole or ladder
    }
}

module.exports = new Dod()
