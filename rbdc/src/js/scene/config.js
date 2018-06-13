class configScene extends Phaser.Scene {

    constructor() {
        super({key: 'config'});
    }

    preload() {
        this.load.image('background', '../assets/background/brownLight.png');
        // TODO: replace button images
        this.load.spritesheet('buttonProfileManagement', '../assets/button/cross.png', {frameWidth: 18, frameHeight: 18});
        this.load.spritesheet('buttonProfileOverview', '../assets/button/cross.png', {frameWidth: 18, frameHeight: 18});
        this.load.spritesheet('buttonToggleSoundOn', '../assets/button/check.png', {frameWidth: 21, frameHeight: 20});
        this.load.spritesheet('buttonToggleSoundOff', '../assets/button/cross.png', {frameWidth: 18, frameHeight: 18});
        this.load.spritesheet('buttonToggleMusicOn', '../assets/button/check.png', {frameWidth: 21, frameHeight: 20});
        this.load.spritesheet('buttonToggleMusicOff', '../assets/button/cross.png', {frameWidth: 18, frameHeight: 18});
        this.load.spritesheet('buttonCredits', '../assets/button/check.png', {frameWidth: 21, frameHeight: 20});
    }

    create() {
        // add background image
        this.addBackground();

        // add button to return to profile management
        this.addLogout(70, 300);

        // add option to return to profile overview in top right corner
        this.addReturnButton(this.sys.game.config.width - 40, 30);

        // add button to toggle music setting
        this.addCredits(70, 150);

        // add button to toggle sound setting
        this.addToggleSound(70, 200);

        // add button to toggle music setting
        this.addToggleMusic(70, 250);
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
            this.buttonToggleSound.setTexture('buttonToggleSoundOff');
        } else {
            saveObject.profiles[saveObject.currentProfile].sound = true;
            saveData();
            this.buttonToggleSound.setTexture('buttonToggleSoundOn');
        }
    }

    toggleMusic() {
        if (saveObject.profiles[saveObject.currentProfile].music == true) {
            saveObject.profiles[saveObject.currentProfile].music = false;
            saveData();
            this.buttonToggleMusic.setTexture('buttonToggleMusicOff');
        } else {
            saveObject.profiles[saveObject.currentProfile].music = true;
            saveData();
            this.buttonToggleMusic.setTexture('buttonToggleMusicOn');
        }
    }

    addLogout(x, y) {
        // add option to log out of profile
        this.buttonProfileManagementLabel = this.add.text(x, y, 'return to profiles', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.buttonProfileManagementLabel.setInteractive();
        this.buttonProfileManagementLabel.on('pointerup', this.goToProfileManagement, this);
        new Button('buttonProfileManagement', 'buttonProfileManagement', this.buttonProfileManagementLabel.x - 22, this.buttonProfileManagementLabel.y + 7, this);
        this.buttonProfileManagement.on('pointerup', this.goToProfileManagement, this);
        this.buttonProfileManagement.setOrigin(0, 0);
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
            new Button('buttonToggleSound', 'buttonToggleSoundOn', this.buttonToggleSoundLabel.x + this.buttonToggleSoundLabel.width + 5, this.buttonToggleSoundLabel.y + 3, this);
        } else {
            new Button('buttonToggleSound', 'buttonToggleSoundOff', this.buttonToggleSoundLabel.x + this.buttonToggleSoundLabel.width + 5, this.buttonToggleSoundLabel.y + 3, this);
        }
        this.buttonToggleSound.on('pointerup', this.toggleSound, this);
        this.buttonToggleSound.setOrigin(0, 0);
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
            new Button('buttonToggleMusic', 'buttonToggleMusicOn', this.buttonToggleMusicLabel.x + this.buttonToggleMusicLabel.width + 5, this.buttonToggleMusicLabel.y + 3, this);
        } else {
            new Button('buttonToggleMusic', 'buttonToggleMusicOff', this.buttonToggleMusicLabel.x + this.buttonToggleMusicLabel.width + 5, this.buttonToggleMusicLabel.y + 3, this);
        }
        this.buttonToggleMusic.on('pointerup', this.toggleMusic, this);
        this.buttonToggleMusic.setOrigin(0, 0);
    }

    addReturnButton(x, y) {
        // add button to return to overview
        new Button('buttonProfileOverview', 'buttonProfileOverview', x, y, this);
        this.buttonProfileOverview.on('pointerup', this.goToProfileOverview, this);
    }

    addBackground() {
        this.backgroundImage = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'background');
        this.backgroundImage.setScale(this.sys.game.config.width + 10 / this.backgroundImage.width, this.sys.game.config.height + 10 / this.backgroundImage.height);
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
        new Button('buttonCredits', 'buttonCredits', this.buttonCreditsLabel.x + this.buttonCreditsLabel.width + 5, this.buttonCreditsLabel.y + 3, this);
        this.buttonCredits.on('pointerup', this.showCredits, this);
        this.buttonCredits.setOrigin(0, 0);
    }

    showCredits() {
        // TODO: add necessary credits in config json
        // show credits in dialog box
        this.credits = new Dialog('Credits', config.default.setting.credits, this.scene);
    }
}