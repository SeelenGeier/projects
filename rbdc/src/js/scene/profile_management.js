class profileManagementScene extends Phaser.Scene {

    constructor() {
        super({key: 'profileManagement'});
    }

    preload() {
        this.load.image('background', '../assets/background/brownLight.png');
        this.load.spritesheet('buttonNew', '../assets/button/check.png', {frameWidth: 21, frameHeight: 20});
        this.load.spritesheet('buttonDelete', '../assets/button/cross.png', {frameWidth: 18, frameHeight: 18});
    }

    create() {
        // add background image
        this.addBackground();

        // add headline
        this.addProfileHeadline(40, 30);

        // add new profile button, label and input field
        this.addNewProfileButton(245, 120);
        this.addNewProfileNameLabel(this.buttonNewProfile.x - 190, this.buttonNewProfile.y - 30);
        this.addNewProfileNameField(this.buttonNewProfile.x - 190, this.sys.game.config.height - this.buttonNewProfile.y + 13);

        // show all profiles in a list
        this.profileListPosition = {x: 80, y: 150};
        this.showAllProfiles();
    }

    update() {

    }

    addProfileHeadline(x, y) {
        this.add.text(x, y, 'Select a Profile', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 32,
            color: '#000000'
        });
    }

    addNewProfileNameLabel(x, y) {
        this.add.text(x, y, 'New Profile:', {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 16,
            color: '#000000'
        });
    }

    addNewProfileNameField(x, y) {
        // check if input field already exists
        if (document.getElementById('newProfileName') !== null) {
            this.showProfileNameField();
        } else {
            // create input field
            var input = document.createElement('input');
            input.type = 'text';
            input.id = 'newProfileName';
            input.style = 'position: relative; left: ' + x + 'px; bottom: ' + y + 'px; width: 165px;';
            document.getElementById(gameConfig.parent).appendChild(input);
        }
    }

    hideProfileNameField() {
        document.getElementById('newProfileName').style.visibility = "hidden";
    }

    showProfileNameField() {
        document.getElementById('newProfileName').style.visibility = "";
    }

    showAllProfiles() {
        this.clearProfileList();

        this.profileText = {};
        this.profileNameBackground = {};

        // add each profile individually to list
        var counter = 0;
        for (var profile in saveObject.profiles) {
            // add profile name
            this.addProfileNameList(this.profileListPosition.x, this.profileListPosition.y, counter, profile);

            // add delete profile button
            this.addProfileDeleteButtonList(this.profileListPosition.x, this.profileListPosition.y, counter, profile);

            counter++;
        }
    }

    createNewProfile() {
        // get profile name from DOM input
        var newProfileName = document.getElementById('newProfileName').value;
        document.getElementById('newProfileName').value = '';

        // check for input
        if (newProfileName !== '') {
            // check if profile already exists
            if (saveObject.profiles[newProfileName] == undefined) {
                // create new profile
                saveObject.profiles[newProfileName] = {
                    scene: 'profileOverview', // always start new profiles in overview scene
                    sound: true,
                    music: true
                };

                saveData();

                // update profile list
                this.showAllProfiles();
            } else {
                new Dialog('Name Invalid', 'Profile \'' + newProfileName + '\' already exists.', this.scene);
            }
        }
    }

    confirmDeleteProfile() {
        new Dialog('Delete Profile', 'Do you want to delete \'' + this.profile + '\'?', this, true);
        this.scene.buttonYES.on('pointerup', this.scene.deleteProfile, this);
    }

    deleteProfile() {
        // delete profile from saveObject
        delete saveObject.profiles[this.profile];
        saveData();

        // update profile list
        this.scene.showAllProfiles();
    }

    selectProfile() {
        // set selected profile as current profile
        saveObject.currentProfile = this.profile;
        saveData();

        // hide input field and load profile overview
        this.scene.hideProfileNameField();
        this.scene.scene.setVisible(false);
        this.scene.scene.start(saveObject.profiles[saveObject.currentProfile].scene);
    }

    addProfileNameList(x, y, counter, profile) {
        // add background for profile
        this.profileNameBackground[counter] = this.add.sprite(x, y, 'uipack_rpg').setFrame('buttonLong_grey.png');
        this.profileNameBackground[counter].setOrigin(0,0);

        this.profileText[counter] = this.add.text(x, y + 52 * counter + 6, profile, {
            fontFamily: config.default.setting.fontFamily,
            fontSize: 24,
            color: '#000000'
        });
        this.profileText[counter].setInteractive();
        this.profileText[counter].profile = profile;
        this.profileText[counter].on('pointerup', this.selectProfile, this.profileText[counter]);

        this.profileNameBackground[counter].setX(this.profileText[counter].x-10);
        this.profileNameBackground[counter].setY(this.profileText[counter].y-10);
        this.profileNameBackground[counter].setScale((this.profileText[counter].width+20)/this.profileNameBackground[counter].width, (this.profileText[counter].height+20)/this.profileNameBackground[counter].height);
    }

    addProfileDeleteButtonList(x, y, counter, profile) {
        new Button('profile' + counter + '_delete', 'buttonDelete', x - 36, y + 52 * counter + 18, this);
        this['profile' + counter + '_delete'].profile = profile;
        this['profile' + counter + '_delete'].on('pointerup', this.confirmDeleteProfile, this['profile' + counter + '_delete']);
    }

    clearProfileList() {
        // clear previous profiles
        var counter = 0;
        for (var profile in this.profileText) {
            this.profileText[counter].destroy();
            this.profileNameBackground[counter].destroy();
            this['profile' + counter + '_delete'].destroy();
            counter++;
        }
    }

    addBackground() {
        this.backgroundImage = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'background');

        // scale background to screen size and add a few more pixels to prevent flickering
        this.backgroundImage.setScale(this.sys.game.config.width + 10 / this.backgroundImage.width, this.sys.game.config.height + 10 / this.backgroundImage.height);
    }

    addNewProfileButton(x, y) {
        new Button('buttonNewProfile', 'buttonNew', x, y, this);
        this.buttonNewProfile.on('pointerup', this.createNewProfile, this);
        this.input.keyboard.on('keydown_ENTER', this.createNewProfile, this);
    }
}