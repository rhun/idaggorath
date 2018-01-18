var Game = function(game) {};

Game.prototype = {
    init: function() {
        // Set up flags
        this.drawMap = false;
        this.mapData = null;

        dod.getMapHandler = function(map) {
            //console.log('GetMapHandler: ' + map);
            dod.mapData = map;
            dod.drawMap = true;
        };
        dod.socket.on('getMap', dod.getMapHandler);
    },
    preload: function() {},
    create: function() {
        // var graphics = this.game.add.graphics();
        // graphics.beginFill(0xFFFFFF);
        // graphics.drawRect(100,100,3,3);
        // graphics.endFill();

        dod.socket.emit('getMap', 2)
    },
    update: function() {
        if (dod.drawMap && dod.mapData) {
            //console.log('in update draw map: data.length = ' + dod.mapData.length);
            //this.game.stage.removeChildren();
            var graphics = this.game.add.graphics();
            graphics.beginFill(0xFFFFFF);

            var width = (dod.width / 32 | 0);
            var height = (dod.height / 32 | 0);
            for(var idx = 0; idx < 1024; ++idx) {
                var row = (idx / 32 | 0);
                var col = idx % 32;
                var x = col * width;
                var y = row * height;
                if (dod.mapData[idx] === 0xFF) {
                    //console.log('in drawRect: datum = ' + dod.mapData[idx]);
                    graphics.drawRect(x, y, width, height);
                }
            }

            graphics.endFill();
            dod.drawMap = false;
            dod.mapData = null;
        } else {
            //
        }
    }
};

