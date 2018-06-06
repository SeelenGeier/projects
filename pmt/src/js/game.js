let gameConfig = {
    type: Phaser.AUTO,
    width: 384,
    height: 512,
    parent: 'pmtGame',
    backgroundColor: '#000000',
    scene: [{
        preload: preload,
        create: create
    }, splashScene, profileManagementScene, profileOverviewScene, configScene]
};

// always keep the screen centered in the browser
let canvas = document.getElementById(gameConfig.parent);
canvas.style.maxWidth = gameConfig.width+'px';
canvas.style.margin = '50px auto';

let game = new Phaser.Game(gameConfig);

// global config (e.g. config.weapons[config.default.equipment.weapon])
let config;

// global save object for storage
let saveObject;

function preload() {

    // load configuration files
    this.load.json('default', 'config/default.json');

    // load dialog background and buttons
    this.load.image('blackBackground', '../assets/blackBackground.png');
    this.load.image('dialogBackground', '../assets/dialogBackground.png');
    this.load.spritesheet('buttonYes', '../assets/buttonNew.png', {frameWidth: 21, frameHeight: 20});
    this.load.spritesheet('buttonNo', '../assets/buttonDelete.png', {frameWidth: 18, frameHeight: 18});
}

function create() {
    // register configuration for easier access
    config = {
        default: this.cache.json.get('default')
    };

    // load possible save data
    loadData();

    // always start splash screen first
    this.scene.start('splash');
}

function saveData() {
    // save data as json in local storage
    localStorage.setItem(config.default.setting.saveName, JSON.stringify(saveObject));
}

function loadData() {
    // check for existing save data
    if (localStorage.getItem(config.default.setting.saveName) !== null) {
        try {
            saveObject = JSON.parse(localStorage.getItem(config.default.setting.saveName));
        } catch (e) {
            console.log('Save data is no valid JSON.');
        }
    }
    // if validation fails build new saveObject and save it in local storage
    if (!validateSaveData()) {
        initializeSaveObject();
        saveData();
    }
}

function initializeSaveObject() {
    saveObject = {
        profiles: {},
        currentProfile: undefined
    };

    // backup found data before overwriting
    if(localStorage.getItem(config.default.setting.saveName) != undefined) {
        console.log('Invalid data saved as _BACKUP.');
        localStorage.setItem(config.default.setting.saveName+'_BACKUP', localStorage.getItem(config.default.setting.saveName));
    }

    saveData();
}

function validateSaveData() {
    var checkSuccesful = true;

    // skip validation if saveObject does not even exist
    if (saveObject == undefined) {
        console.log('No save found, skipping validation.');
        return false;
    }

    // check if saveObject is indeed an object
    if (typeof saveObject != 'object') {
        console.log('Save is not an object.');
        checkSuccesful = false;
    }

    // check if saveObject has an attribute called profiles
    if (saveObject.hasOwnProperty('profiles') == -1) {
        console.log('Save does not have profiles property.');
        checkSuccesful = false;
    }

    // check if the attribute profiles is an object
    if (typeof saveObject.profiles != 'object') {
        console.log('Profiles are not saved as an object.');
        checkSuccesful = false;
    }

    // check if a current profile is set
    if (saveObject.currentProfile != undefined) {

        //check if the current profile contains a string
        if (typeof saveObject.currentProfile != 'string') {
            console.log('Current profile is not saved as a string.');
            checkSuccesful = false;
        }

        // check if the current profile exists within the saved profiles list
        if (saveObject.profiles.hasOwnProperty(saveObject.currentProfile) == -1) {
            console.log('Current profile does not exist in profiles.');
            checkSuccesful = false;
        }
    }
    // check if at least one profile exists
    if (Object.keys(saveObject.profiles).length > 0) {
        //check all profiles
        for (profile in saveObject.profiles) {

            // check if the profile is an object
            if (typeof saveObject.profiles[profile] != 'object') {
                console.log('Profile is not saved as an object.');
                checkSuccesful = false;
            }

            // check if the profile contains a scene
            if (saveObject.profiles[profile].hasOwnProperty('scene') == -1) {
                console.log('Profile does not have scene property.');
                checkSuccesful = false;
            } else {
                // check if the provided scene exists
                if (game.scene.getScene(saveObject.profiles[profile].scene) == null ) {
                    console.log('Profile references an invalid scene.');
                    checkSuccesful = false;
                }
            }

            // check if the profile contains a sound setting
            if (saveObject.profiles[profile].hasOwnProperty('sound') == -1) {
                console.log('Profile does not have sound property.');
                checkSuccesful = false;
            } else {
                //check if the current profile contains a string
                if (typeof saveObject.profiles[profile].sound != 'boolean') {
                    console.log('Sound setting is not boolean.');
                    checkSuccesful = false;
                }
            }

            // check if the profile contains a music setting
            if (saveObject.profiles[profile].hasOwnProperty('music') == -1) {
                console.log('Profile does not have music property.');
                checkSuccesful = false;
            } else {
                //check if the current profile contains a string
                if (typeof saveObject.profiles[profile].music != 'boolean') {
                    console.log('Music setting is not boolean.');
                    checkSuccesful = false;
                }
            }
        }
    }

    if (checkSuccesful) {
        return true;
    } else {
        console.log('Save data validation failed!');
        return false;
    }
}