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

        // add equipment at the bottom of the screen
        this.addEquipment(this.sys.game.config.width / 2, (this.sys.game.config.height / 2) + 200);

        // add character to the center of the screen
        this.addCharacter(this.sys.game.config.width / 2, (this.sys.game.config.height / 2));
    }

    update() {

    }

    goToConfig() {
        // hide current scene and start config scene
        this.scene.sleep();
        this.scene.start('config');
    }

    goToShop() {
        this.character.off('animationcomplete');
        this.characterEnterTween.stop();
        if (this.characterMovingTween != undefined) {
            this.characterMovingTween.stop();
        }
        // flip character to face the correct direction
        if (this.character.scaleX == 1) {
            this.character.setScale(-1, 1);
        }
        this.character.anims.play('characterRun');

        this.characterMovingTween = this.tweens.add({
            targets: [this.character],
            x: -100,
            duration: (100 + this.character.x) * 5,
            onComplete: this.loadShopScene
        });
    }

    loadShopScene() {
        // hide current scene and start config scene
        this.parent.scene.scene.sleep();
        this.parent.scene.scene.start('shop');
    }

    goToDungeon() {
        this.character.off('animationcomplete');
        this.characterEnterTween.stop();
        if (this.characterMovingTween != undefined) {
            this.characterMovingTween.stop();
        }
        // flip character to face the correct direction
        if (this.character.scaleX == -1) {
            this.character.setScale(1, 1);
        }
        this.character.anims.play('characterRun');

        this.characterMovingTween = this.tweens.add({
            targets: [this.character],
            x: this.sys.game.config.width + 100,
            duration: (this.sys.game.config.width + 100 - this.character.x) * 5,
            onComplete: this.loadDungeonScene
        });
    }

    loadDungeonScene() {
        // hide current scene and start config scene
        this.parent.scene.scene.sleep();
        this.parent.scene.scene.start('dungeon');
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
        this.equippedItems = {};
        if (saveObject.profiles[saveObject.currentProfile].character.weapon != null) {
            this.addEquipped(x - 90, y, 'weapon');
        }
        if (saveObject.profiles[saveObject.currentProfile].character.armor != null) {
            this.addEquipped(x - 30, y, 'armor');
        }
        if (saveObject.profiles[saveObject.currentProfile].character.offhand != null) {
            this.addEquipped(x + 30, y, 'offhand');
        }
        if (saveObject.profiles[saveObject.currentProfile].character.trinket != null) {
            this.addEquipped(x + 90, y, 'trinket');
        }
    }

    addEquipped(x, y, type) {
        // get image from item config
        let image = config[type][getItem(saveObject.profiles[saveObject.currentProfile].character[type]).itemName].image;
        // add image for item
        this.equippedItems[type] = this.add.sprite(x, y, image);
        // add durability info below item
        let durabilityText = getItem(saveObject.profiles[saveObject.currentProfile].character[type]).durability != null ? getItem(saveObject.profiles[saveObject.currentProfile].character[type]).durability + '' : 'X';
        this.equippedItems[type].durability = this.add.text(x - (durabilityText.length * 4), y + 40, durabilityText, {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 16,
            color: '#ffdddd'
        });
        // add up button to equip next item
        new Button('buttonItemNext' + type[0].toUpperCase() + type.substring(1), ['gameicons_white', 'up.png'], x, y - 50, this);
        this['buttonItemNext' + type[0].toUpperCase() + type.substring(1)].on('pointerup', this.changeItemNext, [type, this]);
        // add down button to equip previous item
        new Button('buttonItemPrev' + type[0].toUpperCase() + type.substring(1), ['gameicons_white', 'down.png'], x, y + 80, this);
        this['buttonItemPrev' + type[0].toUpperCase() + type.substring(1)].on('pointerup', this.changeItemPrev, [type, this]);
    }

    updateEquipped(type) {
        // change image of this item type to current item image
        this.equippedItems[type].setTexture(config[type][getItem(saveObject.profiles[saveObject.currentProfile].character[type]).itemName].image);
        let durabilityText = getItem(saveObject.profiles[saveObject.currentProfile].character[type]).durability != null ? getItem(saveObject.profiles[saveObject.currentProfile].character[type]).durability + '' : 'X';
        this.equippedItems[type].durability.setText(durabilityText);
        this.equippedItems[type].durability.x = this.equippedItems[type].x - (durabilityText.length * 4);
    }

    changeItemNext() {
        let type = this[0];
        let firstItem = null;
        let previousItem = null;
        // get id of current item
        let currentItemId = saveObject.profiles[saveObject.currentProfile].character[type];
        // loop through all items of this type in inventory
        for (let item in saveObject.profiles[saveObject.currentProfile].inventory.items) {
            if (getItem(item).itemType == type) {
                // set first item of array for future checks
                if (firstItem == null) {
                    firstItem = item;
                }
                // check if the item before this item was the current item
                if (previousItem == currentItemId) {
                    // equip new item
                    equipItem(item);
                    this[1].updateEquipped(type);
                    return true;
                } else {
                    // set previous item to current item and continue loop
                    previousItem = item;
                }
            }
        }
        // if no previous item has been found check if the last item is not the current item
        if (firstItem != currentItemId) {
            // otherwise equip the first item
            equipItem(firstItem);
            this[1].updateEquipped(type);
            return true;
        }
    }

    changeItemPrev() {
        let type = this[0];
        let firstItem = null;
        let previousItem = null;
        // get id of current item
        let currentItemId = saveObject.profiles[saveObject.currentProfile].character[type];
        // loop through all items of this type in inventory
        for (let item in saveObject.profiles[saveObject.currentProfile].inventory.items) {
            if (getItem(item).itemType == type) {
                // set first item of array for future checks
                if (firstItem == null) {
                    firstItem = item;
                    previousItem = item;
                    continue;
                }
                // check if the item before this item was the current item
                if (item == currentItemId) {
                    // equip new item
                    equipItem(previousItem);
                    this[1].updateEquipped(type);
                    return true;
                } else {
                    // set previous item to current item and continue loop
                    previousItem = item;
                }
            }
        }
        // if no previous item has been check if the first item is not the current item
        if (previousItem != currentItemId) {
            // otherwise equip the first item
            equipItem(previousItem);
            this[1].updateEquipped(type);
            return true;
        }
    }

    addCharacter(x, y) {
        this.character = this.add.sprite(-100, y, 'character');
        addCharacterAnimations('character');
        this.character.anims.play('characterRun');
        this.character.swordDrawn = false;

        this.characterEnterTween = this.tweens.add({
            targets: [this.character],
            x: x,
            duration: (x - this.character.x) * 5,
            onComplete: this.characterIdle
        });
    }

    characterIdle() {
        this.parent.scene.character.off('animationcomplete');
        if (this.parent.scene.character.swordDrawn) {
            this.parent.scene.character.anims.play('characterIdleWithSword');
        } else {
            this.parent.scene.character.anims.play('characterIdleNoSword');
        }

        this.parent.scene.time.delayedCall(5000 + (5000 * Math.random()), this.parent.scene.switchIdle, [], this);
    }

    switchIdle() {
        if (this.parent.scene.character.swordDrawn) {
            this.parent.scene.character.anims.play('characterSheatheSword');
            this.parent.scene.character.swordDrawn = false;
            this.parent.scene.character.on('animationcomplete', this.parent.scene.characterIdle, this);
        } else {
            this.parent.scene.character.anims.play('characterDrawSword');
            this.parent.scene.character.swordDrawn = true;
            this.parent.scene.character.on('animationcomplete', this.parent.scene.attack1, this);
        }
    }

    attack1() {
        this.parent.scene.character.off('animationcomplete');
        this.parent.scene.character.anims.play('characterAttack1');
        this.parent.scene.character.on('animationcomplete', this.parent.scene.attack2, this);
    }

    attack2() {
        this.parent.scene.character.off('animationcomplete');
        this.parent.scene.character.anims.play('characterAttack2');
        this.parent.scene.character.on('animationcomplete', this.parent.scene.attack3, this);
    }

    attack3() {
        this.parent.scene.character.off('animationcomplete');
        this.parent.scene.character.anims.play('characterAttack3');
        this.parent.scene.character.on('animationcomplete', this.parent.scene.characterIdle, this);
    }
}