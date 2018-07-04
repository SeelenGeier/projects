class configScene extends Phaser.Scene {

    constructor() {
        super({key: 'config'});
    }

    preload() {
    }

    create() {
        // add background image
        this.addBackground();

        // add button to return to profile management
        this.addLogout(80, 350);

        // add option to return to profile overview in top right corner
        this.addReturnButton(this.sys.game.config.width - 40, 30);

        // add button to toggle music setting
        this.addCredits(80, 150);

        // add button to toggle sound setting
        this.addToggleSound(80, 200);

        // add button to toggle music setting
        this.addToggleMusic(80, 250);
    }

    update() {

    }

    goToProfileManagement() {
        // unset current profile
        saveObject.currentProfile = undefined;
        saveData();

        // hide current scene and start profile management scene
        this.scene.setVisible(false);
        this.scene.start('profileManagement');
    }

    goToProfileOverview() {
        // hide current scene and start profile overview scene
        this.scene.setVisible(false);
        this.scene.start('profileOverview');
    }

    toggleSound() {
        if (saveObject.profiles[saveObject.currentProfile].sound == true) {
            saveObject.profiles[saveObject.currentProfile].sound = false;
            saveData();
            this.buttonToggleSound.setTexture('gameicons_black');
            this.buttonToggleSound.setFrame('audioOff.png');
            this.buttonToggleSoundLabel.setColor('#000000');
        } else {
            saveObject.profiles[saveObject.currentProfile].sound = true;
            saveData();
            this.buttonToggleSound.setTexture('gameicons_white');
            this.buttonToggleSound.setFrame('audioOn.png');
            this.buttonToggleSoundLabel.setColor('#ffffff');
        }
    }

    toggleMusic() {
        if (saveObject.profiles[saveObject.currentProfile].music == true) {
            saveObject.profiles[saveObject.currentProfile].music = false;
            saveData();
            this.buttonToggleMusic.setTexture('gameicons_black');
            this.buttonToggleMusic.setFrame('musicOff.png');
            this.buttonToggleMusicLabel.setColor('#000000');
        } else {
            saveObject.profiles[saveObject.currentProfile].music = true;
            saveData();
            this.buttonToggleMusic.setTexture('gameicons_white');
            this.buttonToggleMusic.setFrame('musicOn.png');
            this.buttonToggleMusicLabel.setColor('#ffffff');
        }
    }

    addLogout(x, y) {
        // add option to log out of profile
        this.buttonProfileManagementLabel = this.add.text(x, y, 'log out', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.buttonProfileManagementLabel.setInteractive();
        this.buttonProfileManagementLabel.on('pointerup', this.goToProfileManagement, this);
        new Button('buttonProfileManagement', ['gameicons_white', 'menuList.png'], this.buttonProfileManagementLabel.x - 35, this.buttonProfileManagementLabel.y + this.buttonProfileManagementLabel.height/2, this);
        this.buttonProfileManagement.on('pointerup', this.goToProfileManagement, this);
    }

    addToggleSound(x, y) {
        // add button to toggle Sound
        this.buttonToggleSoundLabel = this.add.text(x, y, 'Sound', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.buttonToggleSoundLabel.setInteractive();
        this.buttonToggleSoundLabel.on('pointerup', this.toggleSound, this);
        if (saveObject.profiles[saveObject.currentProfile].sound == true) {
            new Button('buttonToggleSound', ['gameicons_white', 'audioOn.png'], this.buttonToggleSoundLabel.x - 35, this.buttonToggleSoundLabel.y + this.buttonToggleSoundLabel.height/2, this);
        } else {
            new Button('buttonToggleSound', ['gameicons_black', 'audioOff.png'], this.buttonToggleSoundLabel.x -35, this.buttonToggleSoundLabel.y + this.buttonToggleSoundLabel.height/2, this);
            this.buttonToggleSoundLabel.setColor('#000000');
        }
        this.buttonToggleSound.on('pointerup', this.toggleSound, this);
    }

    addToggleMusic(x, y) {
        // add button to toggle Music
        this.buttonToggleMusicLabel = this.add.text(x, y, 'Music', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.buttonToggleMusicLabel.setInteractive();
        this.buttonToggleMusicLabel.on('pointerup', this.toggleMusic, this);
        if (saveObject.profiles[saveObject.currentProfile].music == true) {
            new Button('buttonToggleMusic', ['gameicons_white', 'musicOn.png'], this.buttonToggleMusicLabel.x - 35, this.buttonToggleMusicLabel.y + this.buttonToggleMusicLabel.height/2, this);
        } else {
            new Button('buttonToggleMusic', ['gameicons_black', 'musicOff.png'], this.buttonToggleMusicLabel.x - 35, this.buttonToggleMusicLabel.y + this.buttonToggleMusicLabel.height/2, this);
            this.buttonToggleMusicLabel.setColor('#000000');
        }
        this.buttonToggleMusic.on('pointerup', this.toggleMusic, this);
    }

    addReturnButton(x, y) {
        // add button to return to overview
        new Button('buttonProfileOverview', ['gameicons_white', 'return.png'], x, y, this);
        this.buttonProfileOverview.on('pointerup', this.goToProfileOverview, this);
    }

    addBackground() {
        this.backgroundImage = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'backgroundBeige');
        this.backgroundImage.setScale((this.sys.game.config.width + 10) / this.backgroundImage.width, (this.sys.game.config.height + 10) / this.backgroundImage.height);
    }

    addCredits(x, y) {
        // add label
        this.buttonCreditsLabel = this.add.text(x, y, 'Credits', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.buttonCreditsLabel.setInteractive();
        this.buttonCreditsLabel.on('pointerup', this.showCredits, this);

        // add button
        new Button('buttonCredits', ['gameicons_white', 'massiveMultiplayer.png'], this.buttonCreditsLabel.x - 35, this.buttonCreditsLabel.y + this.buttonCreditsLabel.height/2, this);
        this.buttonCredits.on('pointerup', this.showCredits, this);
    }

    showCredits() {
        // TODO: add necessary credits in config json
        // show credits in dialog box
        this.credits = new Dialog('Credits', config.default.setting.credits, this.scene);
    }
}