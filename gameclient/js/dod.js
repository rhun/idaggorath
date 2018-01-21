window.dod = {
    // iDaggorath Server
    server: {
        url: 'localhost:58181',
        socket: undefined,
        initSocketHandlers: function() {
            dod.server.socket.on('dungeon', dod.game.handlers.onDungeon);
            dod.server.socket.on('players', dod.game.handlers.onPlayers);
        }
    },

    // Phaser.io Game
    phaser: {
        game: undefined,
        width: 512,
        height: 384,
        graphics: undefined,

        onKeyDown: function(keyEvent) {
            //Locals
            var v = dod.game.viewer;
            var p = dod.game.state.players[0];

            if (keyEvent.keyCode === Phaser.KeyCode.UP) {
                dod.game.control.moveForward();
            } else if (keyEvent.keyCode === Phaser.KeyCode.DOWN) {
                dod.game.control.moveBackward();
            } else if (keyEvent.keyCode === Phaser.KeyCode.LEFT) {
                --p.dir;
                if (p.dir < 0) {
                    p.dir = 3;
                }
                v.update = true;
            } else if (keyEvent.keyCode === Phaser.KeyCode.RIGHT) {
                ++p.dir;
                if (p.dir > 3) {
                    p.dir = 0;
                }
                v.update = true;
            }
        },

        onKeyPress: function(key, keyEvent) {
            console.log('onKeyPress: ' + keyEvent.keyCode);
            // Locals
            var v = dod.game.viewer;
            var c = dod.game.constants;

            if (keyEvent.keyCode >= 49 && keyEvent.keyCode <= 53) {
                v.setMapLevel(keyEvent.keyCode - 49);
            } else if (key === 'P' || key === 'p') {
                v.setMode(c.view.PORT);
            } else if (key === 'M' || key === 'm') {
                v.setMode(c.view.MAP);
            } else if (keyEvent.keyCode === Phaser.KeyCode.UP) {
                --dod.game.state.players[0].row;
            }
        }
    },

    // iDaggorath Game
    game: {
        constants: {
            origWidth: 256,
            origHeight: 192,
            scale: 2,
            view: {
                MAP: 1,
                PORT: 2,
                EXAMINE: 3,
                TITLE: 4
            },
            position: {
                CLASSIC_START: {
                    level: 1,
                    row: 16,
                    col: 11,
                    dir: 0
                }
            },
            color: {
                black: '#000000',
                white: '#FFFFFF'
            },
            colorNum: {
                black: 0x000000,
                white: 0xFFFFFF
            },
            dungeon: {
                HF_PAS: 0,
                HF_DOR: 1,
                HF_SDR: 2,
                HF_WAL: 3,

                VF_HOLE_UP: 0,
        		VF_LADDER_UP: 1,
        		VF_HOLE_DOWN: 2,
        		VF_LADDER_DOWN: 3,
        		VF_NULL: 255
            }
        },

        state: {
            dungeon: [],
            players: [],
            viewer: undefined,

            isReady: function() {
                return (dod.game.state.dungeon.levels && dod.game.state.players.length);
            }
        },

        viewer: {
            mode: 4,
            update: false,
            seer: false,
            HLFSTP: 0,
            BAKSTP: 0,
            MAGFLG: 0,
            PASFLG: 0,
            NORSCL: 0,
            HLFSCL: 10,
            BAKSCL: 11,
            TXBFLG: 0,
            TXB_U: 0,
            tcaret: 0,
            tlen: 0,
            RLIGHT: 0,
            MLIGHT: 0,
            VCTFAD: 32,
            VXSCAL: 0,
            VYSCAL: 0,
            VCNTRX: 128,
            VCNTRY: 76,
            RANGE: 0,
            NEIBOR: [],
            STPTAB: [-1, 0, 0, 1, 1, 0, 0, -1],
            delay: 0,
            done: false,
            fadeVal: -2,
            bgColor: '#000000',
            fgColor: '#FFFFFF',
            bgColorNum: 0x000000,
            fgColorNum: 0xFFFFFF,
            VFTPTR: -1,

            // Fixed arrays
            LPAS_VLA: [],
            LDOR_VLA: [],
            LSD_VLA: [],
            LWAL_VLA: [],
            FPAS_VLA: [],
            FDOR_VLA: [],
            FSD_VLA: [],
            FWAL_VLA: [],
            RPAS_VLA: [],
            RDOR_VLA: [],
            RSD_VLA: [],
            RWAL_VLA: [],
            CEI_VLA: [],
            HUP_VLA: [],
            LAD_VLA: [],
            HDN_VLA: [],
            Scale: [],
            FLATAB: [3, 0, 1],
            FLATABv: [],
            LArch: [],
            FArch: [],
            RArch: [],

            // Temp fields
            mapLevel: 0,

            // This is the pseudo-constructor
            init: function() {
                // Locals
                var v = dod.game.viewer;
                var u = dod.game.utils;

                u.loadFromHex(v.Scale, 'C88050321F140C080402FF9C6441281A100A060301');
                u.loadFromHex(v.FSD_VLA, '01036C7180439472');
            	u.loadFromHex(v.LSD_VLA, '0103288032423A75');
            	u.loadFromHex(v.RSD_VLA, '0103D880CE42C675');
            	u.loadFromHex(v.RWAL_VLA, '0104E510C026C072E588');
            	u.loadFromHex(v.LWAL_VLA, '01041B10402640721B88');
            	u.loadFromHex(v.FWAL_VLA, '02024026C026024072C072');
            	u.loadFromHex(v.RPAS_VLA, '0204E526C026C072E57202E510C026');
            	u.loadFromHex(v.LPAS_VLA, '02041D26402640721B72021B104026');
            	u.loadFromHex(v.FPAS_VLA, '00');
            	u.loadFromHex(v.RDOR_VLA, '0304E510C026C072E58804D880D841C844C87702D05CCC5D');
            	u.loadFromHex(v.LDOR_VLA, '03041B10402640721B8804288028413844387702305C345D');
            	u.loadFromHex(v.FDOR_VLA, '04024026C026024072C072046C726C4394439472027E5E825E');
                u.loadFromHex(v.CEI_VLA, '01022F1CD11C');
                u.loadFromHex(v.HUP_VLA, '040664225C18A4189C2264226418029C229C18022F1C601C02A11CD21C');
                u.loadFromHex(v.LAD_VLA, '0B0274187480028C188C8002741C8C1C0274288C280274348C340274408C4002744C8C4C0274588C580274648C640274708C7002747B8C7B');
                u.loadFromHex(v.HDN_VLA, '020664765C80A4809C7664766480029C769C80');

                v.LArch[0] = v.LPAS_VLA;
            	v.LArch[1] = v.LDOR_VLA;
            	v.LArch[2] = v.LSD_VLA;
            	v.LArch[3] = v.LWAL_VLA;

            	v.FArch[0] = v.FPAS_VLA;
            	v.FArch[1] = v.FDOR_VLA;
            	v.FArch[2] = v.FSD_VLA;
            	v.FArch[3] = v.FWAL_VLA;

            	v.RArch[0] = v.RPAS_VLA;
            	v.RArch[1] = v.RDOR_VLA;
            	v.RArch[2] = v.RSD_VLA;
            	v.RArch[3] = v.RWAL_VLA;

                v.FLATABv[0] = v.LArch;
            	v.FLATABv[1] = v.FArch;
            	v.FLATABv[2] = v.RArch;
            },

            reset: function() {
                // Locals
                var v = dod.game.viewer;
                var c = dod.game.constants;
                var u = dod.game.utils;

                // Reset values
                v.setVidInv(false);
                v.mode = c.view.TITLE;
                v.update = false;
                v.seer = false;
                v.HLFSTP = 0;
                v.BAKSTP = 0;
                v.MAGFLG = 0;
                v.PASFLG = 0;
                v.NORSCL = 0;
                v.HLFSCL = 10;
                v.BAKSCL = 11;
                v.TXBFLG = 0;
                v.TXB_U = 0;
                v.tcaret = 0;
                v.tlen = 0;
                v.RLIGHT = 0;
                v.MLIGHT = 0;
                v.VCTFAD = 32;
                v.VXSCAL = 0;
                v.VYSCAL = 0;
                v.VCNTRX = 128;
                v.VCNTRY = 76;
                v.RANGE = 0;
                v.delay = 0;
                v.done = false;
                v.fadeVal = -2;
                v.VFTPTR = -1;


                // Remove this later
                v.RLIGHT = 10;
                v.MLIGHT = 4;


/*
clearArea(&TXTPRI);
clearArea(&TXTEXA);
clearArea(&TXTSTS);
*/
            },

            setVidInv: function(inv) {
                // Locals
                var v = dod.game.viewer;
                var c = dod.game.constants;

                // Set normal or inverse colors
                v.bgColor = (inv ? c.color.white : c.color.black);
                v.fgColor = (inv ? c.color.black : c.color.white);
                v.bgColorNum = (inv ? c.colorNum.white : c.colorNum.black);
                v.fgColorNum = (inv ? c.colorNum.black : c.colorNum.white);
            },

            setMode: function(mode) {
                if (dod.game.viewer.mode !== mode) {
                    dod.game.viewer.mode = mode;
                    dod.game.viewer.update = true;
                }
            },

            drawGame: function() {
                // Locals
                var g = dod.phaser.graphics;
                var v = dod.game.viewer;
                var c = dod.game.constants;
                var u = dod.game.utils;

                // Make sure initial state is ready
                if (dod.game.state.isReady()) {

                    // Make sure VFTPTR is set correctly.
                    // This check needs to go into a more
                    // sophisticated internal DoD game state engine.
                    if (v.VFTPTR === -1) {
                        u.calcVFI();
                    }

                    // Check if update is needed
                    if (v.update) {
                        g.clear();
                        if (v.mode === c.view.MAP) {
                            v.drawMap();
                        } else {
                            g.beginFill(v.fgColorNum);
                            if (v.mode === c.view.PORT) {
                                v.drawView();
                            } else if (v.mode === c.view.EXAMINE) {
                                //
                            } else if (v.mode === c.view.TITLE) {
                                //
                            } else {
                                // ?????
                            }
                            g.endFill();
                        }
                        v.update = false;
                    }
                } else {
                    // What to show before game is ready???
                }
            },

            // This is the 3D-Viewport rendering routine.
            // It is only a temporary version right now,
            // for the walk-through. It needs updated to
            // the full version still.
            drawView: function() {
                // Locals
                var v = dod.game.viewer;
                var utils = dod.game.utils;
                var c = dod.game.constants;
                var a, b, u, x, ftctr, vft;

                var level = v.mapLevel;
                var row = dod.game.state.players[0].row;
                var col = dod.game.state.players[0].col;
                var dir = dod.game.state.players[0].dir;

                v.RANGE = 0;

                do {
                    v.setScale();
                    a = dod.game.state.dungeon.levels[level][utils.rc2idx(row, col)];
                    u = 0;
                    x = 4;

                    do {
                        b = a;
            			b = (b & 3);
            			v.NEIBOR[u+4] = b;
            			v.NEIBOR[u] = b;
            			++u;
            			a >>= 2;
            			--x;
                    } while (x !== 0);

                    b = dir;
                    u = b;

                    // Draw walls and doors
                    for (ftctr = 0; ftctr < 3; ++ftctr)
            		{
            			b = v.NEIBOR[u + v.FLATAB[ftctr]];
            			if (b == c.dungeon.HF_SDR)
            			{
            				--v.MAGFLG;
            				v.drawIt(v.FLATABv[ftctr][b]);
            				b = c.dungeon.HF_WAL;
            			}
            			v.drawIt(v.FLATABv[ftctr][b]);
            		}

                    // Draw creatures here

                    // Draw creature shadows here

                    // Draw vertical features
                    vft = utils.vfind(row, col);
                    if (vft === c.dungeon.VF_NULL) {
                        v.drawIt(v.CEI_VLA);
                    } else {
                        switch (vft) {
                            case c.dungeon.VF_HOLE_UP:
                                v.drawIt(v.HUP_VLA);
                                break;
                            case c.dungeon.VF_LADDER_UP:
                                v.drawIt(v.LAD_VLA);
                                v.drawIt(v.HUP_VLA);
                                break;
                            case c.dungeon.VF_HOLE_DOWN:
                                v.drawIt(v.HDN_VLA);
                                v.drawIt(v.CEI_VLA);
                                break;
                            case c.dungeon.VF_LADDER_DOWN:
                                v.drawIt(v.LAD_VLA);
                                v.drawIt(v.HDN_VLA);
                                v.drawIt(v.CEI_VLA);
                                break;
                        }
                    }

                    ///// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    ///// all the rest of the rendering
                    ///// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                    if (v.NEIBOR[u] != 0)
                    {
                        break;
                    }

                    row += v.STPTAB[dir * 2];
                    col += v.STPTAB[dir * 2 + 1];
                    ++v.RANGE;

                } while (v.RANGE <= 9);
            },

            drawIt: function(vl) {
                dod.game.viewer.setFade();
                dod.game.viewer.drawVectorList(vl);
            },

            drawVectorList: function(vl) {
                // Locals
                var v = dod.game.viewer;
                var utils = dod.game.utils;
                var c = dod.game.constants;

                var numLists = vl[0];
            	var curList = 0;
            	var numVertices;
            	var curVertex;
            	var	ctr = 1;
                var x0, y0, x1, y1;

            	if (v.VCTFAD == 0xFF)
            	{
            		return;
            	}

                while (curList < numLists) {
                    numVertices = vl[ctr];
                    ++ctr;
                    curVertex = 0;
                    while (curVertex < (numVertices - 1)) {
                        // TODO: add modern graphics option here

                        x0 = v.scaleXf(vl[ctr]) + v.VCNTRX;
                        y0 = v.scaleYf(vl[ctr + 1]) + v.VCNTRY;
                        x1 = v.scaleXf(vl[ctr + 2]) + v.VCNTRX;
                        y1 = v.scaleYf(vl[ctr + 3]) + v.VCNTRY;
                        v.drawVector(x0, y0, x1, y1);

                        ctr += 2;
                        ++curVertex;
                    }
                    ++curList;
                    ctr += 2;
                }
            },

            drawVector: function(X0, Y0, X1, Y1) {
                // Locals
                var v = dod.game.viewer;
                var XL, YL, L, FADCNT, DX, DY, XX, XY;

                // TODO: add modern graphics option here

                if (v.VCTFAD === 0xFF) {
                    return;
                }
                FADCNT = v.VCTFAD + 1;
        		XL = (X1 > X0) ? (X1 - X0) : (X0 - X1);
        		YL = (Y1 > Y0) ? (Y1 - Y0) : (Y0 - Y1);
        		L = (XL > YL) ? XL : YL;
        		if (L === 0)
        		{
        			return;
        		}
                DX = (XL / L) * ((X0 < X1) ? 1 : -1);
        		DY = (YL / L) * ((Y0 < Y1) ? 1 : -1);

                // TODO: add high-res option here

                XX = X0 + 0.5;
                YY = Y0 + 0.5;
                do {
                    if (--FADCNT === 0)
        			{
        				FADCNT = v.VCTFAD + 1;
        				if (XX >= 0.0 && XX < 256.0 &&
        					YY >= 0.0 && YY < 152.0)
        				{
                            // TODO: add high-res option here

                            v.plotPoint(XX, YY);
        				}
        			}
        			XX += DX;
        			YY += DY;
        			--L;
                } while (L > 0);
            },

            plotPoint: function(X, Y) {
                // Locals
                var v = dod.game.viewer;
                var g = dod.phaser.graphics;

                var x0 = v.newX(X);
                var y0 = v.newY(Y);
                var x1 = v.newX(X + 1);
                var y1 = v.newY(Y + 1);
                var w = x1 - x0;
                var h = y1 - y0;
                g.drawRect(x0, y0, w, h);
            },

            newX: function(origX) {
                return origX / dod.game.constants.origWidth * dod.phaser.width;
            },

            newY: function(origY) {
                return origY / dod.game.constants.origHeight * dod.phaser.height;
            },

            scaleXf: function(x) {
                // Locals
                var v = dod.game.viewer;

                return (((x - v.VCNTRX) * v.VXSCAL) / 127);
            },

            scaleYf: function(y) {
                // Locals
                var v = dod.game.viewer;

                return (((y - v.VCNTRY) * v.VYSCAL) / 127);
            },

            setFade: function() {
                // Locals
                var v = dod.game.viewer;
                var a, b;

                a = v.RLIGHT;
                if (v.MAGFLG != 0) {
                    a = v.MLIGHT;
                    v.MAGFLG = 0;
                }
                b = 0;
                a = ((a - 7) & 255);
                a = ((a - v.RANGE) & 255);
                if ((a & 128) != 0) {
                    b = ((b - 1) & 255);
                    if ((((a & 128) != 0) && a > 0xF9) || ((a & 128) == 0)) {  // if (a > -7)
                        b = ((1 << (-1 - a)) & 255);
                    }
                }
                v.VCTFAD = b;
            },

            setScale: function() {
                // Locals
                var v = dod.game.viewer;
                var idx = v.HLFSCL;
                if (v.HLFSTP === 0) {
                    ++idx;
                    if (v.BAKSTP === 0) {
                        idx = 0;
                    }
                }
                v.VXSCAL = v.Scale[idx + v.RANGE];
                v.VYSCAL = v.Scale[idx + v.RANGE];
            },

            // This draws the dungeon map.
            // It is only a temporary version right now,
            // for the walk-through. It needs updated to
            // the full version still.
            drawMap: function() {
                console.log('in draw map');
                // Locals
                var g = dod.phaser.graphics;
                var v = dod.game.viewer;
                var d = dod.game.state.dungeon;
                var w = dod.phaser.width;
                var h = dod.phaser.height;

                g.beginFill(0xFFFFFF);
                var width = (w / 32 | 0);
                var height = (h / 32 | 0);
                for(var idx = 0; idx < 1024; ++idx) {
                    var row = (idx / 32 | 0);
                    var col = idx % 32;
                    var x = col * width;
                    var y = row * height;
                    if (d.levels[v.mapLevel][idx] === 0xFF) {
                        g.drawRect(x, y, width, height);
                    }
                }
                g.endFill();
            },

            // Temp functions
            setMapLevel: function(level) {
                dod.game.viewer.mapLevel = level;
                dod.game.viewer.update = true;
            }
        },

        utils: {
            loadFromHex: function(arr, hex) {
                for (var i = 0; i < hex.length; i += 2) {
                    arr.push(parseInt(hex.substr(i, 2), 16));
                }
            },

            rc2idx: function(R, C) {
                R &= 31;
            	C &= 31;
            	return (R * 32 + C);
            },

            idx2rc: function(idx) {
                return {
                    row: ((idx / 32) | 0),
                    col: idx % 32
                }
            },

            getAdjoiningIdx: function(r, c, d) {
                switch (d) {
                    case 0:
                        --r;
                        break;
                    case 1:
                        ++c;
                        break;
                    case 2:
                        ++r;
                        break;
                    case 3:
                        --c;
                        break;
                }
                if (r >= 0 && r <=31 && c >=0 && c <= 31) {
                    return dod.game.utils.rc2idx(r, c);
                }
                return -1;
            },

            checkBounds: function(dir) {
                // Locals
                var p = dod.game.state.players[0];

                switch (dir) {
                    case 0:
                        return p.row > 0;
                        break;
                    case 1:
                        return p.col < 31;
                        break;
                    case 2:
                        return p.row < 31;
                        break;
                    case 3:
                        return p.col > 0;
                        break;
                }
            },

            vfind: function(row, col) {
                // Locals
                var utils = dod.game.utils;
                var v = dod.game.viewer;
                var c = dod.game.constants;
                var u = v.VFTPTR;
                var a = 0, res;

                res = utils.vfindSub(u, row, col);
                if (res.found) {
                    return res.a;
                }

                res = utils.vfindSub(res.u, row, col);
                if (res.found) {
                    return res.a + 2;
                } else {
                    return c.dungeon.VF_NULL;
                }
            },

            vfindSub: function(u, row, col) {
                // Locals
                var vfttab = dod.game.state.dungeon.vfttab;
                var r, c;
                var res = {
                    found: false,
                    u: u
                };

                do {
                    res.a = vfttab[res.u++];
                    if (res.a === -1) {
                        return res;
                    }
                    r = vfttab[res.u++];
                    c = vfttab[res.u++];
                } while ( !((r === row) && (c === col)) );
                res.found = true;
                return res;
            },

            calcVFI: function() {
                // Locals
                var vfttab = dod.game.state.dungeon.vfttab;
                var v = dod.game.viewer;
                var lvl = v.mapLevel;
                var idx = 0;

                do {
                    v.VFTPTR = idx;
                    while (vfttab[idx++] !== -1) {
                        ; // Loop !!!
                    }
                    --lvl;
                } while (lvl !== -1);
            }
        },

        control: {
            initGame: function() {
                dod.game.viewer.init();
            },

            resetGame: function() {
                dod.game.state.dungeon = {};
                dod.game.state.players = {};
                dod.game.state.viewer = undefined;
                dod.game.state.ready = false;
                dod.game.viewer.reset();
            },

            setBackgroundColor: function() {
                dod.phaser.game.stage.backgroundColor = dod.game.viewer.bgColor;
            },

            getDungeon: function() {
                dod.server.socket.emit('getDungeon')
            },

            addPlayer: function(position) {
                dod.server.socket.emit('addPlayer', {
                    position: position,
                    items: []
                });
            },

            moveForward: function() {
                var dir = dod.game.state.players[0].dir;
                dod.game.control.doMove(dir);
            },

            moveBackward: function() {
                var dir = dod.game.state.players[0].dir + 2;
                if (dir > 3) {
                    dir -= 4;
                }
                dod.game.control.doMove(dir);
            },

            doMove: function(dir) {
                //Locals
                var v = dod.game.viewer;
                var u = dod.game.utils;
                var p = dod.game.state.players[0];
                var idx, map, rc;

                if (u.checkBounds(dir)) {
                    idx = u.getAdjoiningIdx(p.row, p.col, dir);
                    map = dod.game.state.dungeon.levels[v.mapLevel];
                    if (map[idx] != 0xFF) {
                        rc = u.idx2rc(idx);
                        p.row = rc.row;
                        p.col = rc.col;
                        v.update = true;
                    }
                }
            }
        },

        handlers: {
            onDungeon: function(dungeon) {
                console.log('RCVD: dungeon')
                dod.game.state.dungeon = dungeon;
            },

            onPlayers: function(players) {
                console.log('RCVD: players');
                dod.game.state.players = players;
            }
        }
    }
}
