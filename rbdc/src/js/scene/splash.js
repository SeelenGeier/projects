class splashScene extends Phaser.Scene {

    constructor() {
        super({key: 'splash'});
    }

    preload() {
        this.load.image("red","../assets/mockup/64x64/red.png");
    }

    create() {
        //TODO: replace with splash screen
        this.splashImage = this.add.sprite(0,0,"red").setOrigin(0,0);

        this.fadeSplashTween = this.tweens.add({
            targets: this.splashImage,
            alpha: 0,
            ease: 'Power1',
            duration: 1000,
            delay: 3000
        });

        this.time.delayedCall(4000, this.loadProfileManagement, [], this);
    }

    loadProfileManagement() {
        this.scene.start('profileManagement');
    }
}