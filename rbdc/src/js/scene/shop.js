class shopScene extends Phaser.Scene {

    constructor() {
        super({key: 'shop'});
    }

    preload() {

    }

    create() {
        saveObject.profiles[saveObject.currentProfile].scene = 'shop';
        saveData();
    }

    update() {

    }
}