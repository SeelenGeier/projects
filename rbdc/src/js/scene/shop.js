class shopScene extends Phaser.Scene {

    constructor() {
        super({key: 'shop'});
    }

    preload() {

    }

    create() {
        // save new current scene in saveObject
        saveObject.profiles[saveObject.currentProfile].scene = 'shop';
        saveData();

        // add background image
        this.addBackground();

        // add button to exit the shop
        this.addNavigationExit(this.sys.game.config.width * 0.9, this.sys.game.config.height * 0.5);

        // show buy/sell button at the top
        this.addTabNavigation(this.sys.game.config.width * 0.3, this.sys.game.config.height * 0.1);
    }

    addBackground() {
        // add background image in the center of the screen
        this.backgroundImage = this.add.sprite(this.sys.game.config.width * 0.5, this.sys.game.config.height * 0.5, 'backgroundBeige');

        // scale background to screen size and add a few more pixels to prevent flickering
        this.backgroundImage.setScale((this.sys.game.config.width + 10) / this.backgroundImage.width, (this.sys.game.config.height + 10) / this.backgroundImage.height);
    }

    addNavigationExit(x, y) {
        // add navigation button to return to profile overview and register corresponding function
        new Button('buttonExit', ['gameicons_white', 'door.png'], x, y, this);
        this.buttonExit.on('pointerup', this.exitShop, this);
    }

    exitShop() {
        // hide current scene and start config scene
        this.scene.sleep();
        this.scene.start('profileOverview');
    }

    addTabNavigation(x, y) {
        // add sell button
        new Button('buttonSellTab', ['gameicons_white', 'export.png'], x - 50, y, this);
        this.buttonSellTab.on('pointerup', this.openSellTab, this);

        // add text 'sell' below sell button
        this.textSellTab = this.add.text(x - 50, y + 40, 'SELL', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.textSellTab.setOrigin(0.5, 0.5);

        // add buy button
        new Button('buttonBuyTab', ['gameicons_white', 'import.png'], x + 50, y, this);
        this.buttonBuyTab.on('pointerup', this.openBuyTab, this);

        // add text 'buy' below buy button
        this.textBuyTab = this.add.text(x + 50, y + 40, 'BUY', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.textBuyTab.setOrigin(0.5, 0.5);
    }

    openSellTab() {

    }

    openBuyTab() {

    }
}