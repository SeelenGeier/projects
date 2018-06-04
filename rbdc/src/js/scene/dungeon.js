class dungeonScene extends Phaser.Scene {

    constructor() {
        super({key: 'dungeon'});
    }

    preload() {

    }

    create() {
        saveObject.profiles[saveObject.currentProfile].scene = 'dungeon';
    }

    update() {

    }
}