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
        //add button for creating new profile
        new Button('buttonNewProfile', 'buttonNew', 210, 70, this);
        this.buttonNewProfile.on('pointerup', this.createNewProfile, this);
        this.input.keyboard.on('keydown_ENTER', this.createNewProfile, this);

        //add label and input field for new profile name
        this.addProfileNameLabel();
        this.addProfileNameField();
        
        //show all profiles in a list
        this.showAllProfiles();
    }

    update() {
        
    }

    addProfileNameLabel(){
        this.buttonNewProfileLabel = this.add.text(this.buttonNewProfile.x-155, this.buttonNewProfile.y-30, 'New Profile:', { fontFamily: 'Arial', fontSize: 16, color: '#ffffff' });
    }

    addProfileNameField(){
        //check if input field already exists
        if(document.getElementById('newProfileName') !== null) {
            this.showProfileNameField();
        }else{
            //create input field
            var input = document.createElement('input');
            input.type = 'text';
            input.id = 'newProfileName';
            //set position relative to confirmation button
            input.style = 'position: relative; left: '+(this.buttonNewProfile.x-155)+'px; bottom: '+(this.sys.game.config.height-this.buttonNewProfile.y+13)+'px;';
            document.getElementById('rbdcGame').appendChild(input);
        }
    }

    hideProfileNameField(){
        document.getElementById('newProfileName').style.visibility = "hidden";
    }

    showProfileNameField(){
        document.getElementById('newProfileName').style.visibility = "";
    }

    showAllProfiles() {
        var x = 80;
        var y = 100;

        this.clearProfileList();

        this.profileText = {};
        
        //add each profile individually to list
        var counter = 0;
        for(var profile in saveObject.profiles) {
            //add profile name
            this.addProfileNameList(x, y, counter, profile);
            
            //add select profile button
            this.addProfileSelectButtonList(x, y, counter, profile);
            
            //add delete profile button
            this.addProfileDeleteButtonList(x, y, counter, profile);
            
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

                //update profile list
                this.showAllProfiles();
            }else{
                new Dialog('Delete Profile', 'Profile \''+newProfileName+'\' already exists?', this.scene);
            }
        }
    }

    confirmDeleteProfile(){
        new Dialog('Delete Profile', 'Do you want to delete \''+this.profile+'\'?', this, true);
        this.scene.buttonYES.on('pointerup', this.scene.deleteProfile, this);
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
        //set selected profile as current profile
        saveObject.currentProfile = this.profile;

        //save data
        saveData();

        //hide input field and load profile overview
        this.scene.hideProfileNameField();
        this.scene.scene.setVisible(false);
        this.scene.scene.start(saveObject.profiles[saveObject.currentProfile].scene);
    }

    addProfileNameList(x, y, counter, profile) {
        this.profileText[counter] = this.add.text(x, y+52*counter+6, profile, { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        this.profileText[counter].setInteractive();
        this.profileText[counter].profile = profile;
        this.profileText[counter].on('pointerup', this.selectProfile, this.profileText[counter]);
    }

    addProfileSelectButtonList(x, y, counter, profile) {
        new Button('profile'+counter+'_select', 'buttonSelect', x+this.profileText[counter].width+5, y+52*counter+5, this);
        this['profile'+counter+'_select'].setOrigin(0,0);
        this['profile'+counter+'_select'].profile = profile;
        this['profile'+counter+'_select'].on('pointerup', this.selectProfile, this['profile'+counter+'_select']);
    }

    addProfileDeleteButtonList(x, y, counter, profile) {
        new Button('profile'+counter+'_delete', 'buttonDelete', x-28, y+52*counter+10, this);
        this['profile'+counter+'_delete'].setOrigin(0,0);
        this['profile'+counter+'_delete'].profile = profile;
        this['profile'+counter+'_delete'].on('pointerup', this.confirmDeleteProfile, this['profile'+counter+'_delete']);
    }

    clearProfileList() {
        //clear previous profiles
        var counter = 0;
        for(var profile in this.profileText) {
            this.profileText[counter].destroy();
            this['profile'+counter+'_select'].destroy();
            this['profile'+counter+'_delete'].destroy();
            counter++;
        }
    }
}