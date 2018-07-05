class profileOverviewScene extends Phaser.Scene {

    constructor() {
        super({key: 'profileOverview'});
    }

    preload() {
        // TODO: replace background
        this.load.image('backgroundProfileOverview', '../assets/background/profile_overview_mockup.png');
    }

    create() {
        saveObject.profiles[saveObject.currentProfile].scene = 'profileOverview';
        saveData();

        // add button to navigate to config
        this.addBackground();

        // add button to navigate to config
        this.addNavigationConfig(this.sys.game.config.width / 2, 30);

        // add button to navigate to the shop
        this.addNavigationShop(30, this.sys.game.config.height / 2);

        // add button to navigate to the dungeon
        this.addNavigationDungeon(this.sys.game.config.width - 30, this.sys.game.config.height / 2);

        // add profile name in the top center
        this.addProfileName(this.sys.game.config.width / 2, 150);

        // add profile name in the top center
        this.addEquipment(this.sys.game.config.width / 2, (this.sys.game.config.height / 2) + 200);
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
        new Button('buttonConfig', ['gameicons_white', 'gear.png'], x, y, this);
        this.buttonConfig.on('pointerup', this.goToConfig, this);
    }

    addNavigationShop(x, y) {
        new Button('buttonShop', ['gameicons_white', 'cart.png'], x, y, this);
        this.buttonShop.on('pointerup', this.goToShop, this);
    }

    addNavigationDungeon(x, y) {
        new Button('buttonDungeon', ['gameicons_exp_white', 'fightFist.png'], x, y, this);
        this.buttonDungeon.on('pointerup', this.goToDungeon, this);
    }

    addBackground() {
        this.backgroundImage = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'backgroundProfileOverview');
        // scale background to screen size and add a few more pixels to prevent flickering
        this.backgroundImage.setScale((this.sys.game.config.width + 10) / this.backgroundImage.width, (this.sys.game.config.height + 10) / this.backgroundImage.height);
    }

    addEquipment(x, y) {
        if(saveObject.profiles[saveObject.currentProfile].character.weapon != null) {
            this.addEquippedWeapon(x - 90, y);
        }
        if(saveObject.profiles[saveObject.currentProfile].character.armor != null) {
            this.addEquippedArmor(x - 30, y);
        }
        if(saveObject.profiles[saveObject.currentProfile].character.offhand != null) {
            this.addEquippedOffhand(x + 30, y);
        }
        if(saveObject.profiles[saveObject.currentProfile].character.trinket != null) {
            this.addEquippedTrinket(x + 90, y);
        }
    }

    addEquippedWeapon(x, y) {
        // get image from weapon config
        let image = config.weapon[getItem(saveObject.profiles[saveObject.currentProfile].character.weapon).itemName].image;
        // add image for weapon
        this.equippedWeapon = this.add.sprite(x, y, image);
        // add up button to equip next weapon
        // add down button to equip previous weapon
    }

    addEquippedArmor(x, y) {
        // add image for armor
        let image = config.armor[getItem(saveObject.profiles[saveObject.currentProfile].character.armor).itemName].image;
        // add image for armor
        console.log(image);
        this.equippedArmor = this.add.sprite(x, y, image);
        // add up button to equip next armor
        // add down button to equip previous armor
    }

    addEquippedOffhand(x, y) {
        // add image for offhand
        let image = config.offhand[getItem(saveObject.profiles[saveObject.currentProfile].character.offhand).itemName].image;
        // add image for offhand
        this.equippedOffhand = this.add.sprite(x, y, image);
        // add up button to equip next offhand
        // add down button to equip previous offhand

    }

    addEquippedTrinket(x, y) {
        // add image for trinket
        let image = config.trinket[getItem(saveObject.profiles[saveObject.currentProfile].character.trinket).itemName].image;
        // add image for trinket
        this.equippedTrinket = this.add.sprite(x, y, image);
        // add up button to equip next trinket
        // add down button to equip previous trinket

    }

    equipItem(type, next) {
        if (next) {
            // get id for next item of given type
        } else {
            // get id for previous item of given type
        }
    }
}