/* global Phaser */

//load config

$startingScene = splashScene

//load save data and change starting scene accordingly

let config = {
    type: Phaser.AUTO,
    width: 720,
    height: 1280,
    backgroundColor: '#000000',
    parent: "RBDC",
    scene: [splashScene, profileManagementScene, profileOverviewScene, configScene, shopScene, dungeonScene, resultScene]
};

let game = new Phaser.Game(config);

//this.scene.start('sceneA');
