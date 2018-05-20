/* global Phaser */

let splashScene = new Phaser.Scene('Splash');

let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: splashScene // the starting scene
};

let game = new Phaser.Game(config);
