class dungeonScene extends Phaser.Scene {

    constructor() {
        super({key: 'dungeon'});
    }

    preload() {

    }

    create() {
        saveObject.profiles[saveObject.currentProfile].scene = 'dungeon';
        saveData();

        // TODO: remove exit since it is not wanted in dungeon
        // add button to exit the shop
        this.addNavigationExit(30, this.sys.game.config.height / 2);
    }

    update() {

    }

    addNavigationExit(x, y) {
        new Button('buttonExit', ['gameicons_white', 'door.png'], x, y, this);
        this.buttonExit.on('pointerup', this.exitDungeon, this);
    }

    exitDungeon() {
        // hide current scene and start config scene
        this.scene.sleep();
        this.scene.start('profileOverview');
    }
}