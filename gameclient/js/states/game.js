var Game = function(game) {};

Game.prototype = {
    init: function() {
        dod.game.control.resetGame();
    },
    preload: function() {
        // Locals
        var ctr = dod.game.control
        var c = dod.game.constants
        var v = dod.game.viewer

        // Init dungeon for walkthrough
        ctr.getDungeon();
        ctr.addPlayer(c.position.CLASSIC_START);
        v.setMode(c.view.MAP)
    },
    create: function() {
        dod.phaser.graphics = this.game.add.graphics();
        this.game.input.keyboard.addCallbacks(this, null, null, dod.phaser.onKeyPress);
    },
    update: function() {
        // Process keys ???

        // Call main render routine
        dod.game.viewer.drawGame();

    }
};

