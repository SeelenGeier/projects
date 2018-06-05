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
        this.load.spritesheet('buttonShop', '../assets/mockup/button.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('buttonDungeon', '../assets/mockup/button.png', {frameWidth: 64, frameHeight: 64});
    }

    create() {
        saveObject.profiles[saveObject.currentProfile].scene = 'profileOverview';
        new Button('buttonConfig', 'buttonConfig', this.sys.game.config.width / 2, 30, this);
        this.buttonConfig.on('pointerup', this.goToConfig, this);
        this.buttonConfig.setScale(0.5, 0.5);

        new Button('buttonShop', 'buttonShop', 30, this.sys.game.config.height / 2, this);
        this.buttonShop.on('pointerup', this.goToShop, this);
        this.buttonShop.setScale(0.5, 0.5);

        new Button('buttonDungeon', 'buttonDungeon', this.sys.game.config.width - 30, this.sys.game.config.height / 2, this);
        this.buttonDungeon.on('pointerup', this.goToDungeon, this);
        this.buttonDungeon.setScale(0.5, 0.5);

        this.showProfileName(this.sys.game.config.width / 2, 100);
    }

    update() {

    }

    goToConfig() {
        // hide current scene and start config scene
        this.scene.setVisible(false);
        this.scene.start('config');
    }

    goToShop() {
        // hide current scene and start config scene
        this.scene.setVisible(false);
        this.scene.start('shop');
    }

    goToDungeon() {
        // hide current scene and start config scene
        this.scene.setVisible(false);
        this.scene.start('dungeon');
    }

    showProfileName(x, y) {
        this.profileName = this.add.text(x, y, saveObject.currentProfile, {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.profileName.setOrigin(0.5, 0.5);
    }
}