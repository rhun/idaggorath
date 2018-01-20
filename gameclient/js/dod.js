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

        onKeyPress: function(key, keyEvent) {
            if (keyEvent.keyCode >= 49 && keyEvent.keyCode <= 53) {
                dod.game.viewer.setMapLevel(keyEvent.keyCode - 49);
            }
        }
    },

    // iDaggorath Game
    game: {
        constants: {
            view: {
                MAP: 1,
                PORT: 2,
                EXAMINE: 3,
                TITLE: 4
            },
            position: {
                CLASSIC_START: {
                    level: 1,
                    row: 12,
                    col: 22,
                    dir: 0
                }
            },
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
            tlen: 0;
            RLIGHT: 0,
            MLIGHT: 0,
            VCTFAD: 32,
            delay: 0,
            done: false,
            fadeVal: -2,

            // Temp fields
            mapLevel: 0,

            reset: function() {
                // Locals
                var v = dod.game.viewer;
                var c = dod.game.constants;

                // Reset values
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
                v.delay = 0;
                v.done = false;
                v.fadeVal = -2;

/*
setVidInv(false);
clearArea(&TXTPRI);
clearArea(&TXTEXA);
clearArea(&TXTSTS);
*/
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

                // Make sure initial state is ready
                if (dod.game.state.isReady()) {
                    // Check if update is needed
                    if (v.update) {
                        g.clear();
                        if (v.mode === c.view.MAP) {
                            v.drawMap();
                        } else {
                            if (v.mode === c.view.PORT) {
                                //
                            } else if (v.mode === c.view.EXAMINE) {
                                //
                            } else if (v.mode === c.view.TITLE) {
                                //
                            } else {
                                // ?????
                            }
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
                var range = 0;
                var row = dod.game.state.players[0].position.row;
                var col = dod.game.state.players[0].position.col;

                do {
                    //
                } while (range <= 9);
            },

            // This draws the dungeon map.
            // It is only a temporary version right now,
            // for the walk-through. It needs updated to
            // the full version still.
            drawMap: function() {
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

        control: {
            resetGame: function() {
                dod.game.state.dungeon = {};
                dod.game.state.players = {};
                dod.game.state.viewer = undefined;
                dod.game.state.ready = false;
                dod.game.viewer.reset();
            },

            getDungeon: function() {
                dod.server.socket.emit('getDungeon')
            },

            addPlayer: function(position) {
                dod.server.socket.emit('addPlayer', {
                    position: position,
                    items: []
                });
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
