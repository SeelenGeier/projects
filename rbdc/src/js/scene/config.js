class configScene extends Phaser.Scene {

    constructor() {
        super({key: 'config'});
    }

    preload() {
        this.load.image('background', '../assets/background.png');
        // TODO: replace button images
        this.load.spritesheet('buttonProfileManagement', '../assets/buttonDelete.png', {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.spritesheet('buttonProfileOverview', '../assets/buttonSelect.png', {frameWidth: 39, frameHeight: 28});
        this.load.spritesheet('buttonToggleSoundOn', '../assets/buttonNew.png', {frameWidth: 21, frameHeight: 20});
        this.load.spritesheet('buttonToggleSoundOff', '../assets/buttonDelete.png', {frameWidth: 18, frameHeight: 18});
        this.load.spritesheet('buttonToggleMusicOn', '../assets/buttonNew.png', {frameWidth: 21, frameHeight: 20});
        this.load.spritesheet('buttonToggleMusicOff', '../assets/buttonDelete.png', {frameWidth: 18, frameHeight: 18});
    }

    create() {
        saveObject.profiles[saveObject.currentProfile].scene = 'config';

        // add background
        this.backgroundImage = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'background');
        this.backgroundImage.setScale(this.sys.game.config.width + 10 / this.backgroundImage.width, this.sys.game.config.height + 10 / this.backgroundImage.height);

        // add option to log out of profile
        this.buttonProfileManagementLabel = this.add.text(70, 300, 'return to profiles', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.buttonProfileManagementLabel.setInteractive();
        this.buttonProfileManagementLabel.on('pointerup', this.goToProfileManagement, this);
        new Button('buttonProfileManagement', 'buttonProfileManagement', this.buttonProfileManagementLabel.x - 22, this.buttonProfileManagementLabel.y + 7, this);
        this.buttonProfileManagement.on('pointerup', this.goToProfileManagement, this);
        this.buttonProfileManagement.setOrigin(0, 0);

        // add button to return to overview
        new Button('buttonProfileOverview', 'buttonProfileOverview', this.sys.game.config.width - 40, 30, this);
        this.buttonProfileOverview.on('pointerup', this.goToProfileOverview, this);

        // add button to toggle Sound
        this.buttonToggleSoundLabel = this.add.text(70, 200, 'Sound', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.buttonToggleSoundLabel.setInteractive();
        this.buttonToggleSoundLabel.on('pointerup', this.toggleSound, this);
        if (saveObject.profiles[saveObject.currentProfile].sound == true) {
            new Button('buttonToggleSound', 'buttonToggleSoundOn', this.buttonToggleSoundLabel.x + 80, this.buttonToggleSoundLabel.y + 3, this);
        } else {
            new Button('buttonToggleSound', 'buttonToggleSoundOff', this.buttonToggleSoundLabel.x + 80, this.buttonToggleSoundLabel.y + 3, this);
        }
        this.buttonToggleSound.on('pointerup', this.toggleSound, this);
        this.buttonToggleSound.setOrigin(0, 0);

        // add button to toggle Music
        this.buttonToggleMusicLabel = this.add.text(70, 250, 'Music', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#ffffff'
        });
        this.buttonToggleMusicLabel.setInteractive();
        this.buttonToggleMusicLabel.on('pointerup', this.toggleMusic, this);
        if (saveObject.profiles[saveObject.currentProfile].music == true) {
            new Button('buttonToggleMusic', 'buttonToggleMusicOn', this.buttonToggleMusicLabel.x + 80, this.buttonToggleMusicLabel.y + 3, this);
        } else {
            new Button('buttonToggleMusic', 'buttonToggleMusicOff', this.buttonToggleMusicLabel.x + 80, this.buttonToggleMusicLabel.y + 3, this);
        }
        this.buttonToggleMusic.on('pointerup', this.toggleMusic, this);
        this.buttonToggleMusic.setOrigin(0, 0);
    }

    update() {

    }

    goToProfileManagement() {
        // unset current profile
        saveObject.currentProfile = undefined;

        // save data
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
}