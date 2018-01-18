'use strict'

class Rng {
    constructor() {
        this.carry = 0
        this.seed = [0, 0, 0]
    }

    getSeed(idx) {
        return this.seed[idx]
    }

    setSeed(idx, val) {
        this.seed[idx] = val
    }

    setSeeds(val0, val1, val2) {
        this.seed[0] = val0
        this.seed[1] = val1
        this.seed[2] = val2
    }

    lsl(c) {
        this.carry = (((c & 128) == 128) ? 1 : 0)
		return ((c << 1) & 255)
    }

    lsr(c) {
        this.carry = (((c & 1) == 1) ? 1 : 0)
		return (c >> 1)
    }

    rol(c) {
		let cry = (((c & 128) == 128) ? 1 : 0)
		c = ((c << 1) & 255)
		c = ((c + this.carry) & 255)
		this.carry = cry
		return c
    }

    RANDOM() {
        let x, y, a, b
		this.carry = 0
		for (x = 8; x != 0; --x)
		{
			b = 0
			a = (this.seed[2] & 0xE1)
			for (y = 8; y != 0; --y)
			{
				a = this.lsl(a)
				if (this.carry != 0)
					++b
			}
			b = this.lsr(b)
			this.seed[0] = this.rol(this.seed[0])
			this.seed[1] = this.rol(this.seed[1])
			this.seed[2] = this.rol(this.seed[2])
		}
		return this.seed[0]
    }
}

module.exports = new Rng()
