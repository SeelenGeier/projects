class splashScene extends Phaser.Scene {

    constructor() {
        super({key: 'splash'});
    }

    preload() {
        this.load.image("red","../assets/mockup/64x64/red.png");
    }

    create() {
        //TODO: replace mockup image with splash screen
        this.splashImage = this.add.sprite(0,0,"red").setOrigin(0,0);

        this.time.delayedCall(2000, this.activatePointer, [], this);
    }

    fadeSplash() {
        this.fadeSplashTween = this.tweens.add({
            targets: this.splashImage,
            alpha: 0,
            ease: 'Power1',
            duration: 1500,
            onComplete: splashScene.loadProfileManagement
        });
    }

    static loadProfileManagement() {
        game.scene.start('profileManagement');
    }

    activatePointer() {
        this.input.on('pointerdown', this.fadeSplash, this);
    }
}