let gameConfig = {
    type: Phaser.AUTO,
    width: 750 / 2,
    height: 1334 / 2,
    parent: 'rbdcGame',
    backgroundColor: '#000000',
    scene: [{
        preload: preload,
        create: create
    }, splashScene, profileManagementScene, profileOverviewScene, configScene, shopScene, dungeonScene, resultScene]
};

// always keep the screen centered in the browser
let canvas = document.getElementById(gameConfig.parent);
canvas.style.maxWidth = gameConfig.width + 'px';
canvas.style.margin = '50px auto';

let game = new Phaser.Game(gameConfig);

// global config (e.g. config.weapons[config.default.equipment.weapon])
let config;

// global save object for storage
let saveObject;

function preload() {

    // load configuration files
    this.load.json('default', 'config/default.json');
    this.load.json('damage_types', 'config/damage_types.json');
    this.load.json('trap_types', 'config/trap_types.json');
    this.load.json('monsters', 'config/monsters.json');
    this.load.json('traps', 'config/traps.json');
    this.load.json('weapons', 'config/weapons.json');
    this.load.json('armors', 'config/armors.json');
    this.load.json('offhands', 'config/offhands.json');
    this.load.json('trinkets', 'config/trinkets.json');
    this.load.json('valuables', 'config/valuables.json');

    // load backgrounds
    this.load.image('backgroundBlack', '../assets/background/black.png');
    this.load.image('backgroundParchment', '../assets/background/parchment.png');

    // load texture atlases
    this.load.atlasXML('uipack_blue', '../assets/spritesheet/uipack_blue.png', '../assets/spritesheet/uipack_blue.xml');
    this.load.atlasXML('uipack_green', '../assets/spritesheet/uipack_green.png', '../assets/spritesheet/uipack_green.xml');
    this.load.atlasXML('uipack_grey', '../assets/spritesheet/uipack_grey.png', '../assets/spritesheet/uipack_grey.xml');
    this.load.atlasXML('uipack_red', '../assets/spritesheet/uipack_red.png', '../assets/spritesheet/uipack_red.xml');
    this.load.atlasXML('uipack_rpg', '../assets/spritesheet/uipack_rpg.png', '../assets/spritesheet/uipack_rpg.xml');
    this.load.atlasXML('uipack_yellow', '../assets/spritesheet/uipack_yellow.png', '../assets/spritesheet/uipack_yellow.xml');
}

function create() {
    // register configuration for easier access
    config = {
        default: this.cache.json.get('default'),
        damage_types: this.cache.json.get('damage_types'),
        trap_types: this.cache.json.get('trap_types'),
        monsters: this.cache.json.get('monsters'),
        traps: this.cache.json.get('traps'),
        weapons: this.cache.json.get('weapons'),
        armors: this.cache.json.get('armors'),
        offhands: this.cache.json.get('offhands'),
        trinkets: this.cache.json.get('trinkets'),
        valuables: this.cache.json.get('valuables')
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
    if (localStorage.getItem(config.default.setting.saveName) != undefined) {
        console.log('Invalid data saved as _BACKUP.');
        localStorage.setItem(config.default.setting.saveName + '_BACKUP', localStorage.getItem(config.default.setting.saveName));
    }

    saveData();
}

function addItemToInventory(itemId) {

}

function validateSaveData() {
    // skip validation if saveObject does not even exist
    if (saveObject == undefined) {
        console.log('No save found, skipping validation.');
        this.exitValidation(true);
    }

    // check if saveObject is indeed an object
    if (typeof saveObject != 'object') {
        console.log('Save is not an object.');
        return this.exitValidation(false);
    }

    // check if saveObject has an attribute called profiles
    if (!saveObject.hasOwnProperty('profiles')) {
        console.log('Save does not have profiles property.');
        return this.exitValidation(false);
    }

    // check if the attribute profiles is an object
    if (typeof saveObject.profiles != 'object') {
        console.log('Profiles are not saved as an object.');
        return this.exitValidation(false);
    }

    // check if a current profile is set
    if (saveObject.currentProfile != undefined) {

        //check if the current profile contains a string
        if (typeof saveObject.currentProfile != 'string') {
            console.log('Current profile is not saved as a string.');
            return this.exitValidation(false);
        }

        // check if the current profile exists within the saved profiles list
        if (!saveObject.profiles.hasOwnProperty(saveObject.currentProfile)) {
            console.log('Current profile does not exist in profiles.');
            return this.exitValidation(false);
        }
    }
    if(saveObject.profiles == undefined) {
        console.log('Save data validation failed!');
        return false;
    }
    // check if at least one profile exists
    if (Object.keys(saveObject.profiles).length > 0) {
        //check all profiles
        for (profile in saveObject.profiles) {

            // check if the profile is an object
            if (typeof saveObject.profiles[profile] != 'object') {
                console.log('Profile is not saved as an object.');
                return this.exitValidation(false);
            }

            // check if the profile contains a scene
            if (!saveObject.profiles[profile].hasOwnProperty('scene')) {
                console.log('Profile does not have scene property.');
                return this.exitValidation(false);
            } else {
                // check if the provided scene exists
                if (game.scene.getScene(saveObject.profiles[profile].scene) == null) {
                    console.log('Profile references an invalid scene.');
                    return this.exitValidation(false);
                }
            }

            // check if the profile contains a sound setting
            if (!saveObject.profiles[profile].hasOwnProperty('sound')) {
                console.log('Profile does not have sound property.');
                return this.exitValidation(false);
            } else {
                //check if the sound setting contains a boolean
                if (typeof saveObject.profiles[profile].sound != 'boolean') {
                    console.log('Sound setting is not boolean.');
                    return this.exitValidation(false);
                }
            }

            // check if the profile contains a music setting
            if (!saveObject.profiles[profile].hasOwnProperty('music')) {
                console.log('Profile does not have music property.');
                return this.exitValidation(false);
            } else {
                //check if the music setting contains a boolean
                if (typeof saveObject.profiles[profile].music != 'boolean') {
                    console.log('Music setting is not boolean.');
                    return this.exitValidation(false);
                }
            }

            // check if the profile contains a music setting
            if (!saveObject.profiles[profile].hasOwnProperty('inventory')) {
                console.log('Profile does not have inventory property.');
                return this.exitValidation(false);
            } else {
                //check if the inventory contains an object
                if (typeof saveObject.profiles[profile].inventory != 'object') {
                    console.log('Inventory is not an object.');
                    return this.exitValidation(false);
                }
            }
            // check if the inventory of the current profile contains a currency value
            if (!saveObject.profiles[profile].inventory.hasOwnProperty('currency')) {
                console.log('Inventory does not have currency property.');
                return this.exitValidation(false);
            } else {
                //check if the inventory contains an object
                if (typeof saveObject.profiles[profile].inventory.currency != 'number') {
                    console.log('Currency is not a number.');
                    return this.exitValidation(false);
                }
            }
            if (!saveObject.profiles[profile].inventory.hasOwnProperty('items')) {
                console.log('Inventory does not have items property.');
                return this.exitValidation(false);
            }
            //check if inventory contains more items than possible
            if(Object.keys(saveObject.profiles[profile].inventory.items).length > config.default.status.inventorySize) {
                console.log('Inventory contains more than ' + config.default.status.inventorySize + ' Items.');
                return this.exitValidation(false);
            }
            //check all inventory items
            for (profile in saveObject.profiles[profile].inventory.items) {
            }
        }
    }
    return this.exitValidation(true);
}

function exitValidation(success) {
    if (success) {
        return true;
    } else {
        console.log('Save data validation failed!');
        return false;
    }
}