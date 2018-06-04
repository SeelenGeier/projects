class splashScene extends Phaser.Scene {

    constructor() {
        super({key: 'splash'});
    }

    preload() {
        this.load.image('splash','../assets/splash.jpg');
    }

    create() {
        // TODO: replace mockup image with splash screen
        this.splashTitle = this.add.text(this.sys.game.config.width/2-165, this.sys.game.config.height/2-128, config.default.setting.title, { fontFamily: config.default.setting.fontFamily, fontSize: 24, color: '#ffffff' });
        this.splashImage = this.add.sprite(this.sys.game.config.width/2,this.sys.game.config.height/2,'splash');
        this.splashBy = this.add.text(this.sys.game.config.width/2-12, this.sys.game.config.height/2+100, 'by', { fontFamily: config.default.setting.fontFamily, fontSize: 24, color: '#ffffff' });
        this.splashAuthor = this.add.text(this.sys.game.config.width/2-64, this.sys.game.config.height/2+132, config.default.setting.author, { fontFamily: config.default.setting.fontFamily, fontSize: 24, color: '#ffffff' });

        this.time.delayedCall(2000, this.activatePointer, [], this);
    }

    fadeSplash() {
        this.fadeSplashTween = this.tweens.add({
            targets: [this.splashImage,this.splashTitle,this.splashBy,this.splashAuthor],
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