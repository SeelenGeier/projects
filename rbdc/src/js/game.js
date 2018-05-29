/* global Phaser */

//load configuration files

//load save data and change starting scene accordingly

let config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    backgroundColor: '#000000',
    //game starts with first provided scene (splashScene)
    scene: [splashScene, profileManagementScene, profileOverviewScene, configScene, shopScene, dungeonScene, resultScene]
};

let game = new Phaser.Game(config);
