class profileOverviewScene extends Phaser.Scene {

    constructor() {
        super({key: 'profileOverview'});
    }

    preload() {
        this.load.image('green','../assets/mockup/64x64/green.png');
    }

    create() {
        
        this.mockImage = this.add.sprite(this.sys.game.config.width/2,this.sys.game.config.height/2,'green');
        console.log(saveObject.currentProfile);
    }

    update() {

    }
}