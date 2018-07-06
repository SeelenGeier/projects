class shopScene extends Phaser.Scene {

    constructor() {
        super({key: 'shop'});
    }

    preload() {

    }

    create() {
        saveObject.profiles[saveObject.currentProfile].scene = 'shop';
        saveData();

        // add button to exit the shop
        this.addNavigationExit(this.sys.game.config.width - 30, this.sys.game.config.height / 2);
    }

    update() {

    }

    addNavigationExit(x, y) {
        new Button('buttonExit', ['gameicons_white', 'door.png'], x, y, this);
        this.buttonExit.on('pointerup', this.exitShop, this);
    }

    exitShop() {
        // hide current scene and start config scene
        this.scene.sleep();
        this.scene.start('profileOverview');
    }
}