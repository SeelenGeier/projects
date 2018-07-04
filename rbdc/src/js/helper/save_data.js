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
        return this.exitValidation('No save found, skipping validation.');
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
                // check if item has durability property
                if (!saveObject.profiles[profile].inventory.items[item].hasOwnProperty('durability')) {
                    return this.exitValidation('Item does not have durability property.');
                }
                // check if durability is a number
                if (saveObject.profiles[profile].inventory.items[item].durability != null && typeof saveObject.profiles[profile].inventory.items[item].durability != 'number') {
                    return this.exitValidation('Item durability is not a number or null');
                }
                // check if item has itemType property
                if (!saveObject.profiles[profile].inventory.items[item].hasOwnProperty('itemType')) {
                    return this.exitValidation('Item does not have item type property.');
                }
                // check if item type exists
                if (!config.hasOwnProperty(saveObject.profiles[profile].inventory.items[item].itemType)) {
                    return this.exitValidation('Item type does not exist');
                }
                // check if item exists in item type
                if (!config[saveObject.profiles[profile].inventory.items[item].itemType].hasOwnProperty(saveObject.profiles[profile].inventory.items[item].itemName)) {
                    return this.exitValidation('Item does not exist in item type');
                }
                // check if item has equipped property
                if (!saveObject.profiles[profile].inventory.items[item].hasOwnProperty('equipped')) {
                    return this.exitValidation('Item does not have equipped property.');
                }
                // check if item equipped status is boolean
                if (typeof saveObject.profiles[profile].inventory.items[item].equipped != 'boolean') {
                    return this.exitValidation('Item equipped property is not a boolean');
                }
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