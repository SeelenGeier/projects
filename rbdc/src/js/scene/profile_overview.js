class profileOverviewScene extends Phaser.Scene {

    constructor() {
        super({key: 'profileOverview'});
    }

    preload() {
        this.load.image('background', '../assets/background.png');
        // TODO: replace button with return button
        this.load.spritesheet('buttonProfileManagement', '../assets/buttonDelete.png', { frameWidth: 18, frameHeight: 18 });
    }

    create() {
        // add background
        this.backgroundImage = this.add.sprite(this.sys.game.config.width/2,this.sys.game.config.height/2,'background');
        this.backgroundImage.setScale(this.sys.game.config.width+10/this.backgroundImage.width, this.sys.game.config.height+10/this.backgroundImage.height);
        
        new Button('buttonProfileManagement', 'buttonProfileManagement', this.sys.game.config.width-30, 30, this);
        this.buttonProfileManagement.on('pointerup', this.goToProfileManagement, this);

        this.showProfileName(this.sys.game.config.width/2, 100);
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

    showProfileName(x, y) {
        this.profileName = this.add.text(x, y, saveObject.currentProfile, { fontFamily: config.default.setting.fontFamily, fontSize: 24, color: '#ffffff' });
        this.profileName.setOrigin(0.5, 0.5);
    }
}