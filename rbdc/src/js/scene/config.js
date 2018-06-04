class configScene extends Phaser.Scene {

    constructor() {
        super({key: 'config'});
    }

    preload() {
        this.load.image('background', '../assets/background.png');
        // TODO: replace button
        this.load.spritesheet('buttonProfileManagement', '../assets/buttonDelete.png', { frameWidth: 18, frameHeight: 18 });
    }

    create() {
        saveObject.profiles[saveObject.currentProfile].scene = 'config';

        // add background
        this.backgroundImage = this.add.sprite(this.sys.game.config.width/2,this.sys.game.config.height/2,'background');
        this.backgroundImage.setScale(this.sys.game.config.width+10/this.backgroundImage.width, this.sys.game.config.height+10/this.backgroundImage.height);

        // add option to log out of profile
        this.buttonProfileManagementLabel = this.add.text(70, 300, 'return to profiles', { fontFamily: config.default.setting.fontFamily, fontSize: 24, color: '#ffffff' });
        this.buttonProfileManagementLabel.setInteractive();
        this.buttonProfileManagementLabel.on('pointerup', this.goToProfileManagement, this);
        new Button('buttonProfileManagement', 'buttonProfileManagement', this.buttonProfileManagementLabel.x-22, this.buttonProfileManagementLabel.y+7, this);
        this.buttonProfileManagement.on('pointerup', this.goToProfileManagement, this);
        this.buttonProfileManagement.setOrigin(0,0);
    }

    update() {

    }

    goToProfileManagement(){
        // unset current profile
        saveObject.currentProfile = undefined;

        // save data
        saveData();

        // hide current scene and start profile management scene
        this.scene.setVisible(false);
        this.scene.start('profileManagement');
    }
}