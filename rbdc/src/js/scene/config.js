class configScene extends Phaser.Scene {

    constructor() {
        super({key: 'config'});
    }

    preload() {
    }

    create() {
        // add background image
        this.addBackground();

        // add option to return to profile overview in top right corner
        this.addReturnButton(this.sys.game.config.width * 0.90, this.sys.game.config.height * 0.05);

        // add button to toggle music setting
        this.addCredits(this.sys.game.config.width * 0.25, this.sys.game.config.height * 0.2);

        // add button to toggle sound setting
        this.addToggleSound(this.sys.game.config.width * 0.25, this.sys.game.config.height * 0.3);

        // add button to toggle music setting
        this.addToggleMusic(this.sys.game.config.width * 0.25, this.sys.game.config.height * 0.4);

        // add button to return to profile management
        this.addLogout(this.sys.game.config.width * 0.25, this.sys.game.config.height * 0.6);
    }

    goToProfileManagement() {
        // unset current profile
        saveObject.currentProfile = undefined;
        saveData();

        // hide current scene and start profile management scene
        this.scene.sleep();
        this.scene.start('profileManagement');
    }

    goToProfileOverview() {
        // hide current scene and start profile overview scene
        this.scene.sleep();
        this.scene.start('profileOverview');
    }

    toggleSound() {
        // check if sound is currently activated
        if (saveObject.profiles[saveObject.currentProfile].sound == true) {
            // set sound to deactivated in profile
            saveObject.profiles[saveObject.currentProfile].sound = false;
            saveData();

            // switch image for button to black
            this.buttonToggleSound.setTexture('gameicons_black');
            this.buttonToggleSound.setFrame('audioOff.png');

            // switch color for text to black
            this.buttonToggleSoundLabel.setColor('#000000');
        } else {
            // set sound to activated in profile
            saveObject.profiles[saveObject.currentProfile].sound = true;
            saveData();

            // switch image for button to white
            this.buttonToggleSound.setTexture('gameicons_white');
            this.buttonToggleSound.setFrame('audioOn.png');

            // switch color for text to white
            this.buttonToggleSoundLabel.setColor('#ffffff');
        }
    }

    toggleMusic() {
        // check if music is currently activated
        if (saveObject.profiles[saveObject.currentProfile].music == true) {
            // set music to deactivated in profile
            saveObject.profiles[saveObject.currentProfile].music = false;
            saveData();

            // switch image for button to black
            this.buttonToggleMusic.setTexture('gameicons_black');
            this.buttonToggleMusic.setFrame('musicOff.png');

            // switch color for text to black
            this.buttonToggleMusicLabel.setColor('#000000');
        } else {
            // set music to activated in profile
            saveObject.profiles[saveObject.currentProfile].music = true;
            saveData();

            // switch image for button to black
            this.buttonToggleMusic.setTexture('gameicons_white');
            this.buttonToggleMusic.setFrame('musicOn.png');

            // switch color for text to black
            this.buttonToggleMusicLabel.setColor('#ffffff');
        }
    }

    addLogout(x, y) {
        // add option to log out and return to profile management scene
        this.buttonProfileManagementLabel = this.add.text(x, y, 'log out', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });

        // make text clickable as well
        this.buttonProfileManagementLabel.setInteractive();
        this.buttonProfileManagementLabel.on('pointerup', this.goToProfileManagement, this);

        // add button next to logout text with the same functionality
        new Button('buttonProfileManagement', ['gameicons_white', 'menuList.png'], this.buttonProfileManagementLabel.x - 35, this.buttonProfileManagementLabel.y + this.buttonProfileManagementLabel.height/2, this);
        this.buttonProfileManagement.on('pointerup', this.goToProfileManagement, this);
    }

    addToggleSound(x, y) {
        // add text to toggle Sound
        this.buttonToggleSoundLabel = this.add.text(x, y, 'Sound', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });

        // make text clickable as well
        this.buttonToggleSoundLabel.setInteractive();
        this.buttonToggleSoundLabel.on('pointerup', this.toggleSound, this);

        // check if sound is active initially
        if (saveObject.profiles[saveObject.currentProfile].sound == true) {
            // add white button next to sound toggle text if sound is activated
            new Button('buttonToggleSound', ['gameicons_white', 'audioOn.png'], this.buttonToggleSoundLabel.x - 35, this.buttonToggleSoundLabel.y + this.buttonToggleSoundLabel.height/2, this);
        } else {
            // add black button next to sound toggle text if sound is deactivated
            new Button('buttonToggleSound', ['gameicons_black', 'audioOff.png'], this.buttonToggleSoundLabel.x -35, this.buttonToggleSoundLabel.y + this.buttonToggleSoundLabel.height/2, this);

            // change text color to black (since white was default)
            this.buttonToggleSoundLabel.setColor('#000000');
        }

        // add same toggle functionality to button just like the text
        this.buttonToggleSound.on('pointerup', this.toggleSound, this);
    }

    addToggleMusic(x, y) {
        // add text to toggle Music
        this.buttonToggleMusicLabel = this.add.text(x, y, 'Music', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });

        // make text clickable as well
        this.buttonToggleMusicLabel.setInteractive();
        this.buttonToggleMusicLabel.on('pointerup', this.toggleMusic, this);

        // check if music is active initially
        if (saveObject.profiles[saveObject.currentProfile].music == true) {
            // add white button next to music toggle text if music is activated
            new Button('buttonToggleMusic', ['gameicons_white', 'musicOn.png'], this.buttonToggleMusicLabel.x - 35, this.buttonToggleMusicLabel.y + this.buttonToggleMusicLabel.height/2, this);
        } else {
            // add black button next to music toggle text if music is deactivated
            new Button('buttonToggleMusic', ['gameicons_black', 'musicOff.png'], this.buttonToggleMusicLabel.x - 35, this.buttonToggleMusicLabel.y + this.buttonToggleMusicLabel.height/2, this);

            // change text color to black (since white was default)
            this.buttonToggleMusicLabel.setColor('#000000');
        }

        // add same toggle functionality to button just like the text
        this.buttonToggleMusic.on('pointerup', this.toggleMusic, this);
    }

    addReturnButton(x, y) {
        // add button to return to overview
        new Button('buttonProfileOverview', ['gameicons_white', 'return.png'], x, y, this);
        this.buttonProfileOverview.on('pointerup', this.goToProfileOverview, this);
    }

    addBackground() {
        // add background image and scale to fit the screen (a few pixel more to prevent flickering)
        this.backgroundImage = this.add.sprite(this.sys.game.config.width * 0.5, this.sys.game.config.height * 0.5, 'backgroundBeige');
        this.backgroundImage.setScale((this.sys.game.config.width + 10) / this.backgroundImage.width, (this.sys.game.config.height + 10) / this.backgroundImage.height);
    }

    addCredits(x, y) {
        // add text to show credits
        this.buttonCreditsLabel = this.add.text(x, y, 'Credits', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });

        // make text clickable as well
        this.buttonCreditsLabel.setInteractive();
        this.buttonCreditsLabel.on('pointerup', this.showCredits, this);

        // add button next to logout text with the same functionality
        new Button('buttonCredits', ['gameicons_white', 'massiveMultiplayer.png'], this.buttonCreditsLabel.x - 35, this.buttonCreditsLabel.y + this.buttonCreditsLabel.height/2, this);
        this.buttonCredits.on('pointerup', this.showCredits, this);
    }

    showCredits() {
        // TODO: add necessary credits in config json
        // show credits in dialog box
        this.credits = new Dialog('Credits', config.default.setting.credits, this.scene);
    }
}