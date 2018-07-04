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

// global config (e.g. config.weapon[config.default.equipment.weapon])
let config;

// global save object for storage
let saveObject;

function preload() {

    // load configuration files
    this.load.json('default', 'config/default.json');
    this.load.json('damage_type', 'config/damage_type.json');
    this.load.json('trap_type', 'config/trap_type.json');
    this.load.json('monster', 'config/monster.json');
    this.load.json('trap', 'config/trap.json');
    this.load.json('weapon', 'config/weapon.json');
    this.load.json('armor', 'config/armor.json');
    this.load.json('offhand', 'config/offhand.json');
    this.load.json('trinket', 'config/trinket.json');
    this.load.json('valuable', 'config/valuable.json');

    // load backgrounds
    this.load.image('backgroundBlack', '../assets/background/black.png');
    this.load.image('backgroundBeige', '../assets/background/beige.png');
    this.load.image('backgroundParchment', '../assets/background/parchment.png');

    // load texture atlases
    this.load.atlasXML('uipack_blue', '../assets/spritesheet/uipack_blue.png', '../assets/spritesheet/uipack_blue.xml');
    this.load.atlasXML('uipack_green', '../assets/spritesheet/uipack_green.png', '../assets/spritesheet/uipack_green.xml');
    this.load.atlasXML('uipack_grey', '../assets/spritesheet/uipack_grey.png', '../assets/spritesheet/uipack_grey.xml');
    this.load.atlasXML('uipack_red', '../assets/spritesheet/uipack_red.png', '../assets/spritesheet/uipack_red.xml');
    this.load.atlasXML('uipack_rpg', '../assets/spritesheet/uipack_rpg.png', '../assets/spritesheet/uipack_rpg.xml');
    this.load.atlasXML('uipack_yellow', '../assets/spritesheet/uipack_yellow.png', '../assets/spritesheet/uipack_yellow.xml');
    this.load.atlasXML('gameicons_white', '../assets/spritesheet/gameicons_white.png', '../assets/spritesheet/gameicons_white.xml');
    this.load.atlasXML('gameicons_exp_white', '../assets/spritesheet/gameicons_exp_white.png', '../assets/spritesheet/gameicons_exp_white.xml');
    this.load.atlasXML('gameicons_black', '../assets/spritesheet/gameicons_black.png', '../assets/spritesheet/gameicons_black.xml');
    this.load.atlasXML('gameicons_exp_black', '../assets/spritesheet/gameicons_exp_black.png', '../assets/spritesheet/gameicons_exp_black.xml');
}

function create() {
    // register configuration for easier access
    config = {
        default: this.cache.json.get('default'),
        damage_type: this.cache.json.get('damage_type'),
        trap_type: this.cache.json.get('trap_type'),
        monster: this.cache.json.get('monster'),
        trap: this.cache.json.get('trap'),
        weapon: this.cache.json.get('weapon'),
        armor: this.cache.json.get('armor'),
        offhand: this.cache.json.get('offhand'),
        trinket: this.cache.json.get('trinket'),
        valuable: this.cache.json.get('valuable')
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

function validateSaveData() {
    // skip validation if saveObject does not even exist
    if (saveObject == undefined) {
        this.exitValidation('No save found, skipping validation.');
    }

    // check if saveObject is indeed an object
    if (typeof saveObject != 'object') {
        return this.exitValidation('Save is not an object.');
    }

    // check if saveObject has an attribute called profiles
    if (!saveObject.hasOwnProperty('profiles')) {
        return this.exitValidation('Save does not have profiles property.');
    }

    // check if the attribute profiles is an object
    if (typeof saveObject.profiles != 'object') {
        return this.exitValidation('Profiles are not saved as an object.');
    }

    // check if a current profile is set
    if (saveObject.currentProfile != undefined) {

        // check if the current profile contains a string
        if (typeof saveObject.currentProfile != 'string') {
            return this.exitValidation('Current profile is not saved as a string.');
        }

        // check if the current profile exists within the saved profiles list
        if (!saveObject.profiles.hasOwnProperty(saveObject.currentProfile)) {
            return this.exitValidation('Current profile does not exist in profiles.');
        }
    }
    // check if at least one profile exists
    if (Object.keys(saveObject.profiles).length > 0) {
        // check all profiles
        for (profile in saveObject.profiles) {
            // check if the profile is an object
            if (typeof saveObject.profiles[profile] != 'object') {
                return this.exitValidation('Profile is not saved as an object.');
            }

            // check if the profile contains a scene
            if (!saveObject.profiles[profile].hasOwnProperty('scene')) {
                return this.exitValidation('Profile does not have scene property.');
            } else {
                // check if the provided scene exists
                if (game.scene.getScene(saveObject.profiles[profile].scene) == null) {
                    return this.exitValidation('Profile references an invalid scene.');
                }
            }

            // check if the profile contains a sound setting
            if (!saveObject.profiles[profile].hasOwnProperty('sound')) {
                return this.exitValidation('Profile does not have sound property.');
            } else {
                // check if the sound setting contains a boolean
                if (typeof saveObject.profiles[profile].sound != 'boolean') {
                    return this.exitValidation('Sound setting is not boolean.');
                }
            }

            // check if the profile contains a music setting
            if (!saveObject.profiles[profile].hasOwnProperty('music')) {
                return this.exitValidation('Profile does not have music property.');
            } else {
                // check if the music setting contains a boolean
                if (typeof saveObject.profiles[profile].music != 'boolean') {
                    return this.exitValidation('Music setting is not boolean.');
                }
            }

            // check if the profile contains an inventory
            if (!saveObject.profiles[profile].hasOwnProperty('inventory')) {
                return this.exitValidation('Profile does not have inventory property.');
            } else {
                // check if the inventory is an object
                if (typeof saveObject.profiles[profile].inventory != 'object') {
                    return this.exitValidation('Inventory is not an object.');
                }
            }
            // check if the inventory of the current profile contains a currency value
            if (!saveObject.profiles[profile].inventory.hasOwnProperty('currency')) {
                return this.exitValidation('Inventory does not have currency property.');
            } else {
                // check if the currency is a number
                if (typeof saveObject.profiles[profile].inventory.currency != 'number') {
                    return this.exitValidation('Currency is not a number.');
                }
            }
            if (!saveObject.profiles[profile].inventory.hasOwnProperty('items')) {
                return this.exitValidation('Inventory does not have items property.');
            }
            // check all inventory items
            for (item in saveObject.profiles[profile].inventory.items) {
                // check if durability is a number
                if (saveObject.profiles[profile].inventory.items[item].durability != null && typeof saveObject.profiles[profile].inventory.items[item].durability != 'number') {
                    console.log('Item durability is not a number');
                    return false;
                }
                // check if item type exists
                if (!config.hasOwnProperty(saveObject.profiles[profile].inventory.items[item].itemType)) {
                    console.log('Item type does not exist');
                    return false;
                }
                // check if item exists in item type
                if (!config[saveObject.profiles[profile].inventory.items[item].itemType].hasOwnProperty(saveObject.profiles[profile].inventory.items[item].itemName)) {
                    console.log('Item does not exist in item type');
                    return false;
                }
                // check if item has id property
                // check if item id is unique
                // check if item has type property
                // check if item type exists
                // check if item has durability property
                // check if durability is a number
                // check if item has equipped property
                // check if item equipped status is boolean
            }
        }
    }
    return this.exitValidation();
}

function exitValidation(error_message = undefined) {
    if (error_message == undefined) {
        return true;
    } else {
        console.log(error_message);
        return false;
    }
}