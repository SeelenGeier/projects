class resultScene extends Phaser.Scene {

    constructor() {
        super({key: 'result'});
    }

    preload() {

    }

    create() {
        saveObject.profiles[saveObject.currentProfile].scene = 'result';
        saveData();
    }

    update() {

    }
}