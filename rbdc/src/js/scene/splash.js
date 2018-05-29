class splashScene extends Phaser.Scene {

    constructor() {
        super({key: 'splash'});
    }

    preload() {
        this.load.image("splash","../assets/background/splash.jpg");
    }

    create() {
        this.add.sprite(0,0,"splash").setOrigin(0,0);
        this.time.delayedCall(4000, this.loadProfileManagement, [], this);
    }

    loadProfileManagement() {
        this.scene.start('profileManagement');
    }
}