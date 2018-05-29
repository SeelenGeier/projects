
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

//define global variables
var groups = {};
var inputter;
var player;
var entityManager;
var stateManager;
var bmd;
var i = 0;

function preload() {
	//load all necessary sprites used in the game
	game.load.spritesheet('background', 'assets/background.png', 16, 16);
	game.load.spritesheet('player', 'assets/player.png', 32, 32);
	game.load.image('turret_base', 'assets/turret_base.png');
	game.load.image('turret_gun', 'assets/turret_gun.png');
	game.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);
	game.load.spritesheet('enemy', 'assets/enemy.png', 32, 32);
	
	//create sprite for drawing colored rectangles (see turret health bars)
    bmd = game.add.bitmapData(game.world.width, game.world.height);
	bmd.clear();
    bmd.ctx.beginPath();
    bmd.ctx.fillStyle = '#FFFFFF';
    bmd.ctx.rect(0, 0, game.world.width, game.world.height);
    bmd.ctx.fill();
	bmd.generateTexture('blank');
}

function create() {
	//generate groups for easier handling
	groups.map = game.add.group();
	groups.turret = {
		base: game.add.group(),
		gun: game.add.group(),
		hp: game.add.group(),
	};
	groups.explosion = game.add.group();
	groups.enemy = {
		alien: game.add.group(),
		hp: game.add.group(),
	};
	groups.enemy.alien.enableBody = true;
	groups.projectile = game.add.group();
	groups.projectile.enableBody = true;
	
	inputter = new Inputter();
	stateManager = new StateManager();
	stateManager.gameStart();
}

function update() {
	inputter.update();
	if(stateManager.state == 'play'){
		stateManager.update();
		player.update();
		entityManager.update();
		entityManager.generateRandomTurret();
		entityManager.generateRandomEnemy();
		
		//draw background and static elements
		game.world.bringToTop(groups.map);
		
		//draw all dynamic entities
		entityManager.draw();
		
		//always draw player on top
		game.world.bringToTop(player.sprite);
		
		stateManager.checkGameOver();
	}else if(stateManager.state == 'pause'){
		stateManager.update();
		game.world.bringToTop(stateManager.sprite);
		
		//show controls and explain game
		stateManager.showHelp();
	}else if(stateManager.state == 'gameover'){
		stateManager.update();
		game.world.bringToTop(stateManager.sprite);
		
		//show controls and explain game
		stateManager.showGameOver();
	}
}