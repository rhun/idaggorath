var Preloader = function(game) {};

Preloader.prototype = {
    preload: function() {},
    create: function() {
        this.game.state.start('Menu');
    }
};