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