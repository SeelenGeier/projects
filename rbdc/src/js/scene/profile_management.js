class profileManagementScene extends Phaser.Scene {

    constructor() {
        super({key: 'profileManagement'});
    }

    preload() {
        this.load.spritesheet('buttonNew', '../assets/buttonNew.png', { frameWidth: 21, frameHeight: 20 });
        this.load.spritesheet('buttonSelect', '../assets/buttonSelect.png', { frameWidth: 39, frameHeight: 28 });
        this.load.spritesheet('buttonDelete', '../assets/buttonDelete.png', { frameWidth: 18, frameHeight: 18 });
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
        input.style = 'position: fixed'; //has to be changed to correct position
        document.getElementById('rbdcGame').appendChild(input);
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
            this.profileText[counter] = this.add.text(x, y+52*counter+6, profile, { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
            this.profileText[counter].on('pointerup', this.selectProfile, this['profile'+counter+'_select']);
            
            //add select profile button
            new Button('profile'+counter+'_select', 'buttonSelect', x+this.profileText[counter].width+5, y+52*counter+5, this);
            this['profile'+counter+'_select'].setOrigin(0,0);
            this['profile'+counter+'_select'].profile = profile;
            this['profile'+counter+'_select'].on('pointerup', this.selectProfile, this['profile'+counter+'_select']);
            
            //add delete profile button
            new Button('profile'+counter+'_delete', 'buttonDelete', x-28, y+52*counter+10, this);
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