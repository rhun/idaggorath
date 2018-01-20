/*
    Main entry point for iDaggorath UI
*/

window.onload = function() {
    initPhaserGame();
    initDodSocket();
}

function initPhaserGame() {
    // Locals
    var g = dod.phaser.game;
    var w = dod.phaser.width;
    var h = dod.phaser.height;

    // Create phaser.io game
    g = new Phaser.Game(w, h, Phaser.AUTO, 'phasergame');

    // Add phaser states
    g.state.add('Boot', Boot);
    g.state.add('Preloader', Preloader);
    g.state.add('Menu', Menu);
    g.state.add('Game', Game);

    // Start first state
    g.state.start('Boot');
}

function initDodSocket() {
    // Locals
    var s = dod.server

    // Create the client-side socket object
    s.socket = io();

    // Set up socket handlers
    s.initSocketHandlers();
}