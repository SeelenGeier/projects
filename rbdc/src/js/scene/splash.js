class splashScene extends Phaser.Scene {

    constructor() {
        super({key: 'splash'});
    }

    preload() {
        this.load.image('red','../assets/mockup/64x64/red.png');
    }

    create() {
        //TODO: replace mockup image with splash screen
        this.splashImage = this.add.sprite(this.sys.game.config.width/2,this.sys.game.config.height/2,'red');

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
        this.parent.scene.scene.setVisible(false);
        this.parent.scene.scene.start('profileManagement');
    }

    activatePointer() {
        this.input.on('pointerdown', this.fadeSplash, this);
    }
}