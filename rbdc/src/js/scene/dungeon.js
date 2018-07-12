class dungeonScene extends Phaser.Scene {

    constructor() {
        super({key: 'dungeon'});
    }

    preload() {

    }

    create() {
        // save new current scene in saveObject
        saveObject.profiles[saveObject.currentProfile].scene = 'dungeon';
        saveData();

        // TODO: remove exit since it is not wanted in dungeon
        // add button to exit the shop
        this.addNavigationExit(this.sys.game.config.width * 0.1, this.sys.game.config.height * 0.5);
    }

    addNavigationExit(x, y) {
        // add navigation button to return to profile overview and register corresponding function
        new Button('buttonExit', ['gameicons', 'door.png'], x, y, this);
        this.buttonExit.on('pointerup', this.exitDungeon, this);
    }

    exitDungeon() {
        // hide current scene and start config scene
        this.scene.sleep();
        this.scene.start('profileOverview');
    }
}