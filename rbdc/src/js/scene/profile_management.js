class profileManagementScene extends Phaser.Scene {

    constructor() {
        super({key: 'profileManagement'});
    }

    preload() {
        this.load.image('red','../assets/mockup/64x64/red.png');
        this.load.image('green','../assets/mockup/64x64/green.png');
        this.load.image('blue','../assets/mockup/64x64/blue.png');
        this.load.spritesheet('button', '../assets/mockup/64x64/button.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        this.addProfileNameField();
        new Button('newProfile', 'button', 200, 70, this);
        this.newProfile.on('pointerup', this.createNewProfile, this);
    }

    update() {
        
    }
    
    createNewProfile(){
        //get profile name from DOM input
        var newProfileName = document.getElementById('newProfileName').value;
        
        if(newProfileName !== '') {
            //check if profile already exists
            if(saveObject.profiles[newProfileName] == undefined) {
                //create new profile
                saveObject.profiles[newProfileName] = {
                    scene: 'projectOverview' //always start new profiles in overview scene
                };
                
                //save new data
                saveData();
            }
        }
    }
    
    addProfileNameField(){
        var input = document.createElement('input');
        input.type = 'text';
        input.id = 'newProfileName';
        input.style = 'position: fixed';
        document.getElementById('gameForms').appendChild(input);
    }
}