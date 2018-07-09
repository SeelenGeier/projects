function giveItem(itemType, itemName, durability, profile = saveObject.currentProfile) {
    if (profile == null) {
        console.log('No current profile to give Item to');
        return false;
    }
    // check if inventory is not full
    if (Object.keys(saveObject.profiles[profile].inventory.items).length >= config.default.status.inventorySize) {
        console.log('Inventory full, maximum of ' + config.default.status.inventorySize + ' reached');
        return false;
    }
    // check if durability is a number
    if (durability != null && typeof durability != 'number') {
        console.log('Item durability is not a number');
        return false;
    }
    // check if item type exists
    if (!config.hasOwnProperty(itemType)) {
        console.log('Item type does not exist');
        return false;
    }
    // check if item exists in item type
    if (!config[itemType].hasOwnProperty(itemName)) {
        console.log('Item does not exist in item type');
        return false;
    }
    let newId = this.generateItemId(profile);
    // add item to items in inventory
    saveObject.profiles[profile].inventory.items[newId] = {
        itemType: itemType,
        itemName: itemName,
        durability: durability
    };

    saveData();
    return newId;
}

function removeItem(id, profile = saveObject.currentProfile) {
    if (!saveObject.profiles[profile].inventory.items.hasOwnProperty(id)) {
        console.log('Item id not in inventory');
        return false;
    }
    // unequip item if equipped (and not valuable)
    if (getItem(id, profile).itemType != 'valuable' &&
        saveObject.profiles[profile].character[getItem(id, profile).itemType] == id) {
        saveObject.profiles[profile].character[getItem(id, profile).itemType] = null;
    }
    delete saveObject.profiles[profile].inventory.items[id];
    return true;
}

function generateItemId(profile = saveObject.currentProfile) {
    let id = 0;
    while (saveObject.profiles[profile].inventory.items.hasOwnProperty(id)) {
        id++;
    }
    return id;
}

function equipItem(id, profile = saveObject.currentProfile) {
    if (getItem(id, profile).itemType != 'valuable') {
        saveObject.profiles[profile].character[getItem(id, profile).itemType] = id;
    }
}

function unequipItemtype(type, profile = saveObject.currentProfile) {
    if (type != 'valuable') {
        saveObject.profiles[profile].character[type] = null;
    }
}

function getItem(id, profile = saveObject.currentProfile) {
    return saveObject.profiles[profile].inventory.items[id];
}