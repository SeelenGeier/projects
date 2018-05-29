class profileManagementScene extends Phaser.Scene {

    constructor() {
        super({key: 'profileManagement'});
    }

    preload() {
        this.load.image("blue","../assets/mockup/64x64/blue.png");
    }

    create() {
        this.mockImage = this.add.sprite(200,70,"blue").setOrigin(0,0);
    }

    update() {

    }
}