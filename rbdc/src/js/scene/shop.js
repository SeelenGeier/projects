class shopScene extends Phaser.Scene {

    constructor() {
        super({key: 'shop'});
    }

    preload() {

    }

    create() {
        this.maxItemsDisplayed = 5;
        this.itemsOffset = 0;
        this.itemsDisplayed = {};

        // add background image
        this.addBackground();

        // add button to exit the shop
        this.addNavigationExit(this.sys.game.config.width * 0.9, this.sys.game.config.height * 0.5);

        // show buy/sell button at the top
        this.addTabNavigation(this.sys.game.config.width * 0.4, this.sys.game.config.height * 0.1);

        // add background image for tabs to use as orientation for tab content
        this.addTabBackground(this.sys.game.config.width * 0.07, this.sys.game.config.height * 0.2);
    }

    addBackground() {
        // add background image in the center of the screen
        this.backgroundImage = this.add.sprite(this.sys.game.config.width * 0.5, this.sys.game.config.height * 0.5, 'backgroundBeige');

        // scale background to screen size and add a few more pixels to prevent flickering
        this.backgroundImage.setScale((this.sys.game.config.width + 10) / this.backgroundImage.width, (this.sys.game.config.height + 10) / this.backgroundImage.height);
    }

    addTabBackground(x, y) {
        // add background image for tabs
        this.backgroundTabImage = this.add.sprite(x, y, 'backgroundTab');
        this.backgroundTabImage.setOrigin(0, 0);

        // scale tab background to fit tab content
        this.backgroundTabImage.setScale(this.sys.game.config.width * 0.75 / this.backgroundTabImage.width, this.sys.game.config.height * 0.75 / this.backgroundTabImage.height);
    }

    addNavigationExit(x, y) {
        // add navigation button to return to profile overview and register corresponding function
        new Button('buttonExit', ['gameicons', 'door.png'], x, y, this);
        this.buttonExit.on('pointerup', this.exitShop, this);
        this.buttonExit.setTint(0x996666);
    }

    exitShop() {
        // hide current scene and start config scene
        this.scene.sleep();
        this.scene.start('profileOverview');
    }

    addTabNavigation(x, y) {
        // add button to switch to sell tab
        this.addSellTabButton(x - 50, y);

        // add text for sell button
        this.addSellTabText(x - 50, y + 40);

        // add button to switch to buy tab
        this.addBuyTabButton(x + 50, y);

        // add text for buy button
        this.addBuyTabText(x + 50, y + 40);
    }

    openSellTab() {
        let processedItemsCounter = 0;

        // go through all items in inventory
        for (let itemId in saveObject.profiles[saveObject.currentProfile].inventory.items) {
            // check if max amount of items are already displayed
            if (this.itemsDisplayed.length >= this.maxItemsDisplayed) {
                // abort the loop
                break;
            }

            // check if the offset has been reached (position to start when scrolled down or up)
            if (processedItemsCounter >= this.itemsOffset) {
                // display the item in a new row depending on the item position
                this.displayItemRow(getItem(itemId), this.itemsDisplayed);
            }

            // increment the counter of processed Items and continue loop
            processedItemsCounter++;
        }
    }

    openBuyTab() {

    }

    displayItemRow(item) {
        console.log(item.itemType + '/' + item.itemName + ' (' + item.durability + ')');
    }

    addSellTabButton(x, y) {
        // add sell button
        new Button('buttonSellTab', ['gameicons', 'export.png'], x, y, this);
        this.buttonSellTab.on('pointerup', this.openSellTab, this);
        this.buttonSellTab.setTint(0xcc0000);
    }

    addSellTabText(x, y) {
        // add text 'sell' below sell button
        this.textSellTab = this.add.text(x, y, 'SELL', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#cc0000'
        });
        this.textSellTab.setOrigin(0.5, 0.5);

        // enable text to be clickable as well
        this.textSellTab.setInteractive();
        this.textSellTab.on('pointerup', this.openSellTab, this);
    }

    addBuyTabButton(x, y) {
        // add buy button
        new Button('buttonBuyTab', ['gameicons', 'import.png'], x, y, this);
        this.buttonBuyTab.on('pointerup', this.openBuyTab, this);
        this.buttonBuyTab.setTint(0x00cc00);
    }

    addBuyTabText(x, y) {
        // add text 'buy' below buy button
        this.textBuyTab = this.add.text(x, y, 'BUY', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#00cc00'
        });
        this.textBuyTab.setOrigin(0.5, 0.5);

        // enable text to be clickable as well
        this.textBuyTab.setInteractive();
        this.textBuyTab.on('pointerup', this.openBuyTab, this);
    }
}