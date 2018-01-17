var Game = function(game) {};

Game.prototype = {
    preload: function() {},
    create: function() {
        console.log('Hello, World!');

        var graphics = this.game.add.graphics();
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(100,100,3,3);
        graphics.endFill();

    },
    update: function() {}
};