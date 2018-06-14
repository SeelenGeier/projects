class splashScene extends Phaser.Scene {

    constructor() {
        super({key: 'splash'});
    }

    preload() {
        this.load.image('splash', '../assets/splash.jpg');
    }

    create() {
        this.splashTitle = this.add.text(0, this.sys.game.config.height / 2 - 128, config.default.setting.title, {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.splashTitle.x = this.sys.game.config.width / 2 - this.splashTitle.width / 2;

        this.splashImage = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'splash');

        this.splashBy = this.add.text(0, this.sys.game.config.height / 2 + 100, 'by', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.splashBy.x = this.sys.game.config.width / 2 - this.splashBy.width / 2;

        this.splashAuthor = this.add.text(0, this.sys.game.config.height / 2 + 132, config.default.setting.author, {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.splashAuthor.x = this.sys.game.config.width / 2 - this.splashAuthor.width / 2;

        this.time.delayedCall(20, this.activatePointer, [], this);
    }

    fadeSplash() {
        this.fadeSplashTween = this.tweens.add({
            targets: [this.splashImage, this.splashTitle, this.splashBy, this.splashAuthor],
            alpha: 0,
            ease: 'Power1',
            duration: 1500,
            onComplete: splashScene.loadNextScene
        });
    }

    static loadNextScene() {
        this.parent.scene.scene.setVisible(false);
        if (saveObject.currentProfile != undefined) {
            this.parent.scene.scene.start(saveObject.profiles[saveObject.currentProfile].scene);
        } else {
            this.parent.scene.scene.start('profileManagement');
        }
    }

    activatePointer() {
        this.input.on('pointerdown', this.fadeSplash, this);
    }
}