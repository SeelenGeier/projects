class profileOverviewScene extends Phaser.Scene {

    constructor() {
        super({key: 'profileOverview'});
    }

    preload() {
        // TODO: replace button images
        this.load.spritesheet('buttonProfileManagement', '../assets/buttonDelete.png', {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.spritesheet('buttonConfig', '../assets/mockup/button.png', {frameWidth: 64, frameHeight: 64});
    }

    create() {
        saveObject.profiles[saveObject.currentProfile].scene = 'profileOverview';
        saveData();

        // add button to navigate to config
        this.addNavigationConfig(this.sys.game.config.width / 2, 30);

        // add profile name in the top center
        this.addProfileName(this.sys.game.config.width / 2, 100);
    }

    update() {

    }

    goToConfig() {
        // hide current scene and start config scene
        this.scene.setVisible(false);
        this.scene.start('config');
    }

    addProfileName(x, y) {
        // show profile name in top center of the screen
        this.profileName = this.add.text(x, y, saveObject.currentProfile, {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.profileName.setOrigin(0.5, 0.5);
    }

    addNavigationConfig(x, y) {
        new Button('buttonConfig', 'buttonConfig', x, y, this);
        this.buttonConfig.on('pointerup', this.goToConfig, this);
        this.buttonConfig.setScale(0.5, 0.5);
    }
}