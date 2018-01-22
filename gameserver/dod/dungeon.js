'use strict'

const dod = require('./dod.js')
const rng = require('./rng.js')
const RowCol = require('./rowcol.js')

module.exports = class Dungeon {
    constructor() {

        // Internal arrays
        this.MSKTAB = []
        this.DORTAB = []
        this.SDRTAB = []
        this.STPTAB = []
        this.NEIBOR = []
        this.LEVTAB = []
        this.VFTTAB = []
        this.VFTPTR = 0

        this.DROW = new RowCol()

        // Debug arrays
        this.NS = []
        this.EW = []

        this.debugCounter = 0

        // Set up tables

        this.SetLEVTABOrig()

        this.MSKTAB[0] = dod.N_WALL
    	this.MSKTAB[1] = dod.E_WALL
    	this.MSKTAB[2] = dod.S_WALL
    	this.MSKTAB[3] = dod.W_WALL

    	this.DORTAB[0] = dod.HF_DOR
    	this.DORTAB[1] = (dod.HF_DOR << 2)
    	this.DORTAB[2] = (dod.HF_DOR << 4)
    	this.DORTAB[3] = (dod.HF_DOR << 6)

    	this.SDRTAB[0] = dod.HF_SDR
    	this.SDRTAB[1] = (dod.HF_SDR << 2)
    	this.SDRTAB[2] = (dod.HF_SDR << 4)
    	this.SDRTAB[3] = (dod.HF_SDR << 6)

    	this.STPTAB[0] = -1
    	this.STPTAB[1] = 0
    	this.STPTAB[2] = 0
    	this.STPTAB[3] = 1
    	this.STPTAB[4] = 1
    	this.STPTAB[5] = 0
    	this.STPTAB[6] = 0
    	this.STPTAB[7] = -1

        //this.SetVFTTABOrig()

        this.NS[3]='—'
    	this.NS[2]='='
    	this.NS[1]='—'
    	this.NS[0]=' '
    	this.EW[3]='|'
    	this.EW[2]=')'
    	this.EW[1]='|'
    	this.EW[0]=' '

        // All five levels
        this.levels = []
        this.levels.push([], [], [], [], [])

        // Vertical features
        this.VF_NONE = 0
        this.VF_HOLE_UP = 1
        this.VF_LADDER_UP = 2
        this.VF_HOLE_DOWN = 3
        this.VF_LADDER_DOWN = 4
    }

    getData() {
        return {
            levels: this.levels
        }
    }

    CreateAllFiveOriginalLevels() {
        for (let l = 0; l < 5; ++l) {
            this.DGNGEN(l)
        }
        this.SetVFTTABOrig()
    }

    DGNGEN(LEVEL) {

        /* Locals */
    	let mzctr
    	let maz_idx
    	let cell_ctr
    	let a_row
    	let a_col
    	let b_row
    	let b_col
    	let DIR
    	let DST
    	let DROW = new RowCol()
    	let ROW = new RowCol()
    	let spin
        let MAZLND = this.levels[LEVEL]
        let DD

    	/* Phase 1: Create Maze */

        /* Set Cells to 0xFF */
    	for (mzctr = 0; mzctr < 1024; ++mzctr) {
    		MAZLND[mzctr] = dod.ALL_WALLS
    	}

        // Initialize Random Number Generator
        rng.setSeeds(this.LEVTAB[LEVEL], this.LEVTAB[LEVEL + 1], this.LEVTAB[LEVEL + 2])
        cell_ctr = 500;

        // TODO: Add in random maze code here
        a_col = (rng.RANDOM() & 31)
		a_row = (rng.RANDOM() & 31)
		DROW.setRC(a_row, a_col)
		DD = this.RndDstDir()
        DIR = DD.DIR
        DST = DD.DST

        // Make sure the vertical feature table isn't overwritten from pervious new game.

        // For code archeologists, I've removed the arcane Vertical Features Table.
        // Vertical features are now stored together in the main array, in the higher
        // order byte. The only restriction is that a room can't have a both a ceiling
        // feature and a floor feature. (The graphics won't support it at the moment.)
        //
        // this.VF_NONE = 0
        // this.VF_HOLE_UP = 1
        // this.VF_LADDER_UP = 2
        // this.VF_HOLE_DOWN = 3
        // this.VF_LADDER_DOWN = 4
        //
        // This next line has been moved outside this function, as all five levels
        // of the maze are now built at once. When I add back in random mazes,
        // I'll need to revisit this. TODO: Random Mazes
		//this.SetVFTTABOrig()

        // Build the rooms
        while (cell_ctr > 0) {
    		/* Take a step */
    		b_row = DROW.row
    		b_col = DROW.col
    		b_row += this.STPTAB[DIR * 2]
    		b_col += this.STPTAB[(DIR * 2) + 1]

    		/* Check if it's out of bounds */
    		if (this.BORDER(b_row, b_col) == false) {
    			DD = this.RndDstDir()
                DIR = DD.DIR
                DST = DD.DST
    			continue
    		}

    		/* Store index and temp room */
    		maz_idx = this.RC2IDX(b_row, b_col)
    		ROW.setRC(b_row, b_col)

    		/* If not yet touched */
    		if (MAZLND[maz_idx] == dod.ALL_WALLS) {
    			this.FRIEND(ROW, MAZLND);
    			if (this.NEIBOR[3] + this.NEIBOR[0] + this.NEIBOR[1] == 0 ||
    				this.NEIBOR[1] + this.NEIBOR[2] + this.NEIBOR[5] == 0 ||
    				this.NEIBOR[5] + this.NEIBOR[8] + this.NEIBOR[7] == 0 ||
    				this.NEIBOR[7] + this.NEIBOR[6] + this.NEIBOR[3] == 0)
    			{
                    DD = this.RndDstDir()
                    DIR = DD.DIR
                    DST = DD.DST
    				continue
    			}
    			MAZLND[maz_idx] = 0
    			--cell_ctr
    		}

    		if (cell_ctr > 0) {
    			DROW.row = ROW.row;
                DROW.col = ROW.col
    			--DST;
    			if (DST == 0) {
                    DD = this.RndDstDir()
                    DIR = DD.DIR
                    DST = DD.DST
    				continue
    			} else {
    				continue
    			}
    		}
    	}

        /* Phase 2: Create Walls */

    	for (DROW.row = 0; DROW.row < 32; ++DROW.row) {
    		for (DROW.col = 0; DROW.col < 32; ++DROW.col) {
    			maz_idx = this.RC2IDX(DROW.row, DROW.col)
    			if (MAZLND[maz_idx] != dod.ALL_WALLS) {
    				this.FRIEND(DROW, MAZLND)
    				if (this.NEIBOR[1] == dod.ALL_WALLS)
    					MAZLND[maz_idx] |= dod.N_WALL
    				if (this.NEIBOR[3] == dod.ALL_WALLS)
    					MAZLND[maz_idx] |= dod.W_WALL
    				if (this.NEIBOR[5] == dod.ALL_WALLS)
    					MAZLND[maz_idx] |= dod.E_WALL
    				if (this.NEIBOR[7] == dod.ALL_WALLS)
    					MAZLND[maz_idx] |= dod.S_WALL
    			}
    		}
    	}

        /* Phase 3: Create Doors/Secret Doors */

    	for (mzctr = 0; mzctr < 70; ++mzctr) {
    		this.MAKDOR(this.DORTAB, MAZLND)
    	}

    	for (mzctr = 0; mzctr < 45; ++mzctr) {
    		this.MAKDOR(this.SDRTAB, MAZLND)
    	}

        /* Phase 4: Create vertical feature */
        // TODO: More random maze stuff here

        // // Spin the RNG
    	// if (scheduler.curTime == 0)
    	// {
    	// 	if (LEVEL == 0)
    	// 	{
    	// 		spin = 6;
    	// 	}
    	// 	else
    	// 	{
    	// 		spin = 21;
    	// 	}
    	// }
    	// else
    	// {
    	// 	spin = (scheduler.curTime % 60);
    	// }
        //
    	// while (spin > 0)
    	// {
    	// 	rng.RANDOM();
    	// 	--spin;
    	// }
    }

    RndDstDir() {
        return {
            DIR: (rng.RANDOM() & 3),
            DST: (rng.RANDOM() & 7) + 1
        }
    }

    BORDER(R, C) {
        if ((R & 224) != 0) return false
    	if ((C & 224) != 0) return false
    	return true
    }

    RC2IDX(R, C) {
        R &= 31
    	C &= 31
    	return (R * 32 + C)
    }

    FRIEND(RC, MAZLND) {
        let r3, c3
    	let u = 0;

    	for (r3 = RC.row; r3 <= (RC.row + 2); ++r3)
    	{
    		for (c3 = RC.col; c3 <= (RC.col + 2); ++c3)
    		{
    			if (this.BORDER((r3 - 1), (c3 - 1)) == false)
    			{
    				this.NEIBOR[u] = dod.ALL_WALLS;
    			}
    			else
    			{
    				this.NEIBOR[u] = MAZLND[this.RC2IDX((r3 - 1), (c3 - 1))];
    			}
    			++u;
    		}
    	}
    }

    MAKDOR(table, MAZLND) {
        let a_row
    	let a_col
    	let maz_idx
    	let val
    	let DIR
    	let ROW = new RowCol()

        do
    	{
    		do
    		{
    			a_col = (rng.RANDOM() & 31);
    			a_row = (rng.RANDOM() & 31);
    			ROW.setRC(a_row, a_col);
    			maz_idx = this.RC2IDX(a_row, a_col);
    			val = MAZLND[maz_idx];
    		} while (val == dod.ALL_WALLS);

    		DIR = (rng.RANDOM() & 3);
    	} while ((val & this.MSKTAB[DIR]) != 0);

        MAZLND[maz_idx] |= table[DIR];

    	ROW.row += this.STPTAB[DIR * 2];
    	ROW.col += this.STPTAB[(DIR * 2) + 1];
    	DIR += 2;
    	DIR &= 3;
    	maz_idx = this.RC2IDX(ROW.row, ROW.col);
    	MAZLND[maz_idx] |= table[DIR];
    }

    // For code archeologists, I've removed the arcane Vertical Features Table.
    // Vertical features are now stored together in the main array, in the higher
    // order byte. The only restriction is that a room can't have a both a ceiling
    // feature and a floor feature. (The graphics won't support it at the moment.)
    //
    // this.VF_NONE = 0
    // this.VF_HOLE_UP = 1
    // this.VF_LADDER_UP = 2
    // this.VF_HOLE_DOWN = 3
    // this.VF_LADDER_DOWN = 4
    //
    SetVFTTABOrig() {
        // First Level (0) -- Ceiling
        // No holes or ladders from above

        // First Level (0) -- Floor
        this.SetVerticalFeature(0,  0, 23, this.VF_LADDER_DOWN)
        this.SetVerticalFeature(0, 15,  4, this.VF_HOLE_DOWN)
        this.SetVerticalFeature(0, 20, 17, this.VF_HOLE_DOWN)
        this.SetVerticalFeature(0, 28, 30, this.VF_LADDER_DOWN)

        // Second Level (1) -- Ceiling (same as above)
        this.SetVerticalFeature(1,  0, 23, this.VF_LADDER_UP)
        this.SetVerticalFeature(1, 15,  4, this.VF_HOLE_UP)
        this.SetVerticalFeature(1, 20, 17, this.VF_HOLE_UP)
        this.SetVerticalFeature(1, 28, 30, this.VF_LADDER_UP)

        // Second Level (1) -- Floor
        this.SetVerticalFeature(1,  2,  3, this.VF_LADDER_DOWN)
        this.SetVerticalFeature(1,  3, 31, this.VF_HOLE_DOWN)
        this.SetVerticalFeature(1, 19, 20, this.VF_HOLE_DOWN)
        this.SetVerticalFeature(1, 31,  0, this.VF_HOLE_DOWN)

        // Third Level (2) -- Ceiling (same as above)
        this.SetVerticalFeature(2,  2,  3, this.VF_LADDER_UP)
        this.SetVerticalFeature(2,  3, 31, this.VF_HOLE_UP)
        this.SetVerticalFeature(2, 19, 20, this.VF_HOLE_UP)
        this.SetVerticalFeature(2, 31,  0, this.VF_HOLE_UP)

        // Third Level (2) -- Floor
        // No holes or ladders leading down

        // Fourth Level (3) -- Ceiling (same as above)
        // No holes or ladders from above

        // Fourth Level (3) -- Floor
        this.SetVerticalFeature(3,  0, 31, this.VF_HOLE_DOWN)
        this.SetVerticalFeature(3,  5,  0, this.VF_HOLE_DOWN)
        this.SetVerticalFeature(3, 22, 28, this.VF_HOLE_DOWN)
        this.SetVerticalFeature(3, 31, 16, this.VF_HOLE_DOWN)

        // Fifth Level (4) -- Ceiling (same as above)
        this.SetVerticalFeature(4,  0, 31, this.VF_HOLE_UP)
        this.SetVerticalFeature(4,  5,  0, this.VF_HOLE_UP)
        this.SetVerticalFeature(4, 22, 28, this.VF_HOLE_UP)
        this.SetVerticalFeature(4, 31, 16, this.VF_HOLE_UP)

        // Fifth Level (4) -- Floor
        // No holes or ladders leading down

        // this.VFTTAB[0] = -1
    	// this.VFTTAB[1] = 1
    	// this.VFTTAB[2] = 0
    	// this.VFTTAB[3] = 23
    	// this.VFTTAB[4] = 0
    	// this.VFTTAB[5] = 15
    	// this.VFTTAB[6] = 4
    	// this.VFTTAB[7] = 0
    	// this.VFTTAB[8] = 20
    	// this.VFTTAB[9] = 17
    	// this.VFTTAB[10] = 1
    	// this.VFTTAB[11] = 28
    	// this.VFTTAB[12] = 30
    	// this.VFTTAB[13] = -1
    	// this.VFTTAB[14] = 1
    	// this.VFTTAB[15] = 2
    	// this.VFTTAB[16] = 3
    	// this.VFTTAB[17] = 0
    	// this.VFTTAB[18] = 3
    	// this.VFTTAB[19] = 31
    	// this.VFTTAB[20] = 0
    	// this.VFTTAB[21] = 19
    	// this.VFTTAB[22] = 20
    	// this.VFTTAB[23] = 0
    	// this.VFTTAB[24] = 31
    	// this.VFTTAB[25] = 0
    	// this.VFTTAB[26] = -1
    	// this.VFTTAB[27] = -1
    	// this.VFTTAB[28] = 0
    	// this.VFTTAB[29] = 0
    	// this.VFTTAB[30] = 31
    	// this.VFTTAB[31] = 0
    	// this.VFTTAB[32] = 5
    	// this.VFTTAB[33] = 0
    	// this.VFTTAB[34] = 0
    	// this.VFTTAB[35] = 22
    	// this.VFTTAB[36] = 28
    	// this.VFTTAB[37] = 0
    	// this.VFTTAB[38] = 31
    	// this.VFTTAB[39] = 16
    	// this.VFTTAB[40] = -1
    	// this.VFTTAB[41] = -1
    }

    SetVerticalFeature(level, row, col, feature) {
        let idx = this.RC2IDX(row, col)
        this.levels[level][idx] |= (feature << 8)
    }

    SetLEVTABOrig() {
        this.LEVTAB[0] = 0x73
    	this.LEVTAB[1] = 0xC7
    	this.LEVTAB[2] = 0x5D
    	this.LEVTAB[3] = 0x97
    	this.LEVTAB[4] = 0xF3
    	this.LEVTAB[5] = 0x13
    	this.LEVTAB[6] = 0x87
    }

    printMaze(LEVEL) {
        let MAZLND = this.levels[LEVEL]
        let idx, row, x
    	let val, n, e, s, w
    	for (idx = 0; idx < 1024; idx += 32) {
    		for (x = 0; x < 3; ++x) {
                let line = ''
    			for (row = 0; row < 32; ++row) {
    				val = MAZLND[idx+row]
    				n = (val & 0x03)
    				e = (val & 0x0C) >> 2
    				s = (val & 0x30) >> 4
    				w = (val & 0xC0) >> 6
    				switch (x)
    				{
    				case 0:
                        line += '∙' + this.NS[n]
    					if (row >= 31) {
                            line += '∙'
    					}
    					break;
    				case 1:
                        line += this.EW[w]
    					if (val == 0xFF) {
                            line += '#'
    					} else {
                            line += ' '
                        }
    					if (row >= 31) {
                            line += this.EW[e]
    					}
    					break;
    				case 2:
    					if (idx >= 992) {
                            line += '∙' + this.NS[s]
    						if (row >= 31) {
                                line += '∙'
    						}
    					}
    				}
    			}
    			if (x < 2 || idx >= 992)
    			{
                    console.log(line)
    			}
    		}
    	}
    }
}