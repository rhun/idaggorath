/*
    Main entry point for iDaggorath UI
*/

window.onload = function() {
    createDodGame();
    connectWithDodServer();
}

function createDodGame() {
    dod.game = new Phaser.Game(dod.width, dod.height, Phaser.AUTO, 'dodgame');
    dod.game.state.add('Boot', Boot);
    dod.game.state.add('Preloader', Preloader);
    dod.game.state.add('Menu', Menu);
    dod.game.state.add('Game', Game);
    dod.game.state.start('Boot');
}

function connectWithDodServer() {
    if (!dod.io) {
        dod.io = io();
    }
}