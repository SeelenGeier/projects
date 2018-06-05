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
        saveData();

        // add button to navigate to config
        this.addNavigationConfig(this.sys.game.config.width / 2, 30);

        // add button to navigate to the shop
        this.addNavigationShop(30, this.sys.game.config.height / 2);

        // add button to navigate to the dungeon
        this.addNavigationDungeon(this.sys.game.config.width - 30, this.sys.game.config.height / 2);

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

    addNavigationShop(x, y) {
        new Button('buttonShop', 'buttonShop', x, y, this);
        this.buttonShop.on('pointerup', this.goToShop, this);
        this.buttonShop.setScale(0.5, 0.5);
    }

    addNavigationDungeon(x, y) {
        new Button('buttonDungeon', 'buttonDungeon', x, y, this);
        this.buttonDungeon.on('pointerup', this.goToDungeon, this);
        this.buttonDungeon.setScale(0.5, 0.5);
    }
}