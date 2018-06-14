class profileOverviewScene extends Phaser.Scene {

    constructor() {
        super({key: 'profileOverview'});
    }

    preload() {
        // TODO: replace button images
        this.load.image('buttonConfig', '../assets/button/options.png');
        this.load.image('buttonShop', '../assets/button/menu.png');
        this.load.image('buttonDungeon', '../assets/button/menu.png');
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
    }

    addNavigationShop(x, y) {
        new Button('buttonShop', 'buttonShop', x, y, this);
        this.buttonShop.on('pointerup', this.goToShop, this);
    }

    addNavigationDungeon(x, y) {
        new Button('buttonDungeon', 'buttonDungeon', x, y, this);
        this.buttonDungeon.on('pointerup', this.goToDungeon, this);
    }
}