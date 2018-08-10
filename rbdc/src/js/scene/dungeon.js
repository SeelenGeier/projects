class dungeonScene extends Phaser.Scene {

    constructor() {
        super({key: 'dungeon'});
    }

    preload() {
        // TODO: replace background
        // load background image for profile overview
        this.load.image('backgroundDungeon', '../assets/background/dungeon_mockup.png');
    }

    create() {
        // save new current scene in saveObject
        saveObject.profiles[saveObject.currentProfile].scene = 'dungeon';
        saveData();

        // add button to navigate to config
        this.addBackground();

        // add button to exit the shop
        this.addNavigationExit(this.sys.game.config.width * 0.5, this.sys.game.config.height * 0.9);

        // add button to exit the shop
        this.addNavigationAction(this.sys.game.config.width * 0.5, this.sys.game.config.height * 0.3);

        // add button to exit the shop
        this.addNavigationNextRoom(this.sys.game.config.width * 0.9, this.sys.game.config.height * 0.5);

        // add button to exit the shop
        this.addNavigationInventory(this.sys.game.config.width * 0.1, this.sys.game.config.height * 0.5);

        // add character to the left center of the screen
        this.addCharacter(this.sys.game.config.width * 0.25, this.sys.game.config.height * 0.62);
    }

    addBackground() {
        this.backgroundImage = this.add.sprite(this.sys.game.config.width * 0.5, this.sys.game.config.height * 0.5, 'backgroundDungeon');
        // scale background to screen size and add a few more pixels to prevent flickering
        this.backgroundImage.setScale((this.sys.game.config.width + 10) / this.backgroundImage.width, (this.sys.game.config.height + 10) / this.backgroundImage.height);
    }

    addNavigationExit(x, y) {
        // add navigation button to return to profile overview and register corresponding function
        new Button('buttonExit', ['gameicons', 'exitLeft.png'], x, y, this);
        this.buttonExit.on('pointerup', this.exitDungeon, this);
        this.buttonExit.setTint(0xcc0000);
    }

    exitDungeon() {
        // hide current scene and start config scene
        this.scene.sleep();
        this.scene.start('profileOverview');
    }

    addNavigationAction(x, y) {
        // add navigation button to perform action based on room contents
        new Button('buttonAction', ['gameicons_exp', 'fightFist.png'], x, y, this);
        this.buttonAction.on('pointerup', this.performAction, this);
        this.buttonAction.setTint(0xcc0000);
    }

    performAction() {

    }

    addNavigationNextRoom(x, y) {
        // add navigation button to perform action based on room contents
        new Button('buttonNextRoom', ['gameicons', 'arrowRight.png'], x, y, this);
        this.buttonNextRoom.on('pointerup', this.goToNextRoom, this);
        this.buttonNextRoom.setTint(0x009966);
    }

    goToNextRoom() {

    }

    addNavigationInventory(x, y) {
        // add navigation button to perform action based on room contents
        new Button('buttonInventory', ['gameicons', 'video.png'], x, y, this);
        this.buttonInventory.on('pointerup', this.openInventory, this);
        this.buttonInventory.setTint(0xeeaa00);
    }

    openInventory() {

    }

    addCharacter(x, y) {
        // add character outside of view
        this.character = this.add.sprite(-100, y, 'character');
        this.character.setOrigin(0.5, 1);

        // load animations if not done already
        addCharacterAnimations('character');

        // set character animation as running
        this.character.anims.play('characterRun');

        // have the sword drawn during the entire run
        this.character.swordDrawn = true;

        // add moving motion to the center of the screen and switch to idle animation after arrival
        this.characterEnterTween = this.tweens.add({
            targets: [this.character],
            x: x,
            duration: (x - this.character.x) * 5,
            onComplete: this.characterIdle
        });
    }

    characterIdle() {
        // deactivate any event trigger when completing an animation as precaution
        this.parent.scene.character.off('animationcomplete');

        // start idle animation with sword
        this.parent.scene.character.anims.play('characterIdleWithSword');
    }
}