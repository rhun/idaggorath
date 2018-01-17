var Boot = function(game) {};

Boot.prototype = {
    preload: function() {},
    create: function() {
        this.game.stage.smoothed = false;
        this.game.scale.minWidth = dod.width;
        this.game.scale.minHeight = dod.height;
        this.game.scale.maxWidth = dod.width;
        this.game.scale.maxHeight = dod.height;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.canvas.oncontextmenu = function(e) { e.preventDefault(); };
        this.game.state.start('Preloader');
    }
};