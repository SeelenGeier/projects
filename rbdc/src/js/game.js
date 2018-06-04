let gameConfig = {
    type: Phaser.AUTO,
    width: 360,
    height: 480,
    parent: 'rbdcGame',
    backgroundColor: '#000000',
    scene: [{preload: preload, create: create},splashScene,profileManagementScene,profileOverviewScene,configScene,shopScene,dungeonScene,resultScene]
};

let game = new Phaser.Game(gameConfig);

// global config (e.g. config.weapons[config.default.equipment.weapon])
let config;

// global save object for storage
let saveObject;

function saveData() {
    // save data as json in local storage
    localStorage.setItem(config.default.setting.saveName, JSON.stringify(saveObject));
}

function loadData() {
    // check for existing save data
    if(localStorage.getItem(config.default.setting.saveName) !== null) {
        // TODO: validate save data
        saveObject = JSON.parse(localStorage.getItem(config.default.setting.saveName));
    }else{
        // initialize saveObject and save in local storage
        saveObject = {
            profiles: {}
        };
        saveData();
    }
}

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

    // load dialog background and buttons
    this.load.image('blackBackground','../assets/blackBackground.png');
    this.load.image('dialogBackground','../assets/dialogBackground.png');
    this.load.spritesheet('buttonYes', '../assets/buttonNew.png', { frameWidth: 21, frameHeight: 20 });
    this.load.spritesheet('buttonNo', '../assets/buttonDelete.png', { frameWidth: 18, frameHeight: 18 });
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

    // load save data and change starting scene accordingly
    loadData();

    // start splash screen as default
    // this.scene.start('splash'); // SKIP DURING DEVELOPMENT
    this.scene.start('profileManagement');
}