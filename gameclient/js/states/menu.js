var Menu = function(game) {};

Menu.prototype = {
    preload: function() {},
    create: function() {
        this.game.state.start('Game');
    },
    update: function() {}
};