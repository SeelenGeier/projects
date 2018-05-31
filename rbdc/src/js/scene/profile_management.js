class profileManagementScene extends Phaser.Scene {

    constructor() {
        super({key: 'profileManagement'});
    }

    preload() {
        this.load.spritesheet('buttonNew', '../assets/mockup/64x64/button.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('buttonSelect', '../assets/mockup/64x64/button.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('buttonDelete', '../assets/buttonDelete.png', { frameWidth: 38, frameHeight: 36 });
    }

    create() {
        //add input field for new profile name
        this.addProfileNameField();
        
        //add button for creating new profile
        new Button('newProfile', 'buttonNew', 200, 70, this);
        this.newProfile.on('pointerup', this.createNewProfile, this);
        
        //show all profiles in a list
        this.showAllProfiles();
    }

    update() {
        
    }
    
    addProfileNameField(){
        var input = document.createElement('input');
        input.type = 'text';
        input.id = 'newProfileName';
        input.style = 'position: fixed';
        document.getElementById('gameForms').appendChild(input);
    }
    
    hideProfileNameField(){
        document.getElementById('newProfileName').style.visibility = "hidden";
    }
    
    showAllProfiles() {
        var counter;
        var x = 80;
        var y = 100;
        
        //clear previous profiles
        counter = 0;
        for(var profile in this.profileText) {
            this.profileText[counter].destroy();
            this['profile'+counter+'_select'].destroy();
            this['profile'+counter+'_delete'].destroy();
            counter++;
        }
        
        this.profileText = {};
        
        //add each profile individually to list
        counter = 0;
        for(var profile in saveObject.profiles) {
            //add profile name
            this.profileText[counter] = this.add.text(x, y+64*counter+6, profile, { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
            this.profileText[counter].on('pointerup', this.selectProfile, this['profile'+counter+'_select']);
            
            //add select profile button
            new Button('profile'+counter+'_select', 'buttonSelect', x+200, y+64*counter, this);
            this['profile'+counter+'_select'].setOrigin(0,0);
            this['profile'+counter+'_select'].profile = profile;
            this['profile'+counter+'_select'].on('pointerup', this.selectProfile, this['profile'+counter+'_select']);
            
            //add delete profile button
            new Button('profile'+counter+'_delete', 'buttonDelete', x-50, y+64*counter, this);
            this['profile'+counter+'_delete'].setOrigin(0,0);
            this['profile'+counter+'_delete'].profile = profile;
            this['profile'+counter+'_delete'].on('pointerup', this.deleteProfile, this['profile'+counter+'_delete']);
            
            counter++;
        }
    }
    
    createNewProfile(){
        //get profile name from DOM input
        var newProfileName = document.getElementById('newProfileName').value;
        document.getElementById('newProfileName').value = '';
        
        //check for input
        if(newProfileName !== '') {
            //check if profile already exists
            if(saveObject.profiles[newProfileName] == undefined) {
                //create new profile
                saveObject.profiles[newProfileName] = {
                    scene: 'profileOverview' //always start new profiles in overview scene
                };
                
                //save new data
                saveData();
            }
        }
        
        //update profile list
        this.showAllProfiles();
    }
    
    deleteProfile(){
        //delete profile from saveObject
        delete saveObject.profiles[this.profile];
        
        //save data
        saveData();
        
        //update profile list
        this.scene.showAllProfiles();
    }
    
    selectProfile(){
        //delete profile from saveObject
        saveObject.currentProfile = this.profile;
        
        //save data
        saveData();
        
        //hide input field and load profile overview
        this.scene.hideProfileNameField();
        this.scene.scene.setVisible(false);
        this.scene.scene.start(saveObject.profiles[saveObject.currentProfile].scene);
    }
}