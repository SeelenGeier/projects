
let game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

//define global variables
let cursor;
let room;
let player;
let enemies;
let pauseKeyPressed;
let freshExits;
let showTitle;

function preload() {
    //load room assets
	game.load.image('cursorMenu', 'assets/cursorMenu.png');
	game.load.image('cursorCrosshair', 'assets/cursorCrosshair.png');
	game.load.image('cursorMenuRed', 'assets/cursorMenuRed.png');
    
	game.load.image('player_bottom', 'assets/player_bottom.png');
	game.load.image('player_top', 'assets/player_top.png');
	game.load.image('player_tracks', 'assets/player_tracks.png');
	game.load.image('player_bullet', 'assets/player_bullet.png');
	game.load.image('player_missile', 'assets/player_missile.png');
    
	game.load.image('room_floor', 'assets/room_floor.png');
	game.load.image('room_wall', 'assets/room_wall.png');
    
	game.load.image('object_crate_1', 'assets/object_crate_1.png');
	game.load.image('object_crate_2', 'assets/object_crate_2.png');
	game.load.image('object_crate_3', 'assets/object_crate_3.png');
	game.load.image('object_crate_4', 'assets/object_crate_4.png');
	game.load.image('object_wreckage_1', 'assets/object_wreckage_1.png');
	game.load.image('object_wreckage_2', 'assets/object_wreckage_2.png');
	game.load.image('object_wreckage_3', 'assets/object_wreckage_3.png');
	game.load.image('object_wreckage_4', 'assets/object_wreckage_4.png');
    
	game.load.image('pickup_scrap', 'assets/pickup_scrap.png');
    
	game.load.image('enemy_turret_base', 'assets/enemy_turret_base.png');
	game.load.image('enemy_turret_gun', 'assets/enemy_turret_gun.png');
	game.load.image('enemy_suicide', 'assets/enemy_suicide.png');
    
	game.load.spritesheet('explosion', 'assets/explosion.png', 64, 64);
	game.load.spritesheet('explosion_missile', 'assets/explosion_missile.png', 32, 32);
	game.load.spritesheet('smoke', 'assets/smoke.png', 64, 64);
    
	game.load.image('button_repair', 'assets/button_repair.png');
	game.load.image('button_gun', 'assets/button_gun.png');
	game.load.image('button_missile', 'assets/button_missile.png');
    
	game.load.image('decal_1', 'assets/decal_1.png');
	game.load.image('decal_2', 'assets/decal_2.png');
	game.load.image('decal_3', 'assets/decal_3.png');
	game.load.image('decal_4', 'assets/decal_4.png');
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //deactivate right click menu to enable use of right mouse button
	game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
    game.time.advancedTiming = true;
    
    pauseKeyPressed = false;
}

function create() {
    room = new Room();
    
    //create floor
    room.fill_floor();
    
    //place player in empty room
    player = new Player();
    
    //create enemy handler
    enemies = new Enemies();
    
    //start with new room
    room.restart();
    
    //add welcome screen with info about pause
    textTitle = game.add.text(game.world.centerX,game.world.centerY-100, 'Junkyard Survival', { font: "bold 32px Arial", fill: "#ffffff" });
    textTitle.anchor.setTo(0.5, 0.5);
    textTitleStart = game.add.text(game.world.centerX,game.world.centerY-60, 'Press SPACEBAR to start and pause the game.', { font: "bold 16px Arial", fill: "#ffffff" });
    textTitleStart.anchor.setTo(0.5, 0.5);
    textTitleUpgrades = game.add.text(game.world.centerX,game.world.centerY-40, 'Upgrades are available in the pause menu.', { font: "bold 16px Arial", fill: "#ffffff" });
    textTitleUpgrades.anchor.setTo(0.5, 0.5);
    textTitleControls = game.add.text(game.world.centerX,game.world.centerY-20, 'WASD to move, fire gun with left and missiles with right mouse button.', { font: "bold 16px Arial", fill: "#ffffff" });
    textTitleControls.anchor.setTo(0.5, 0.5);
    showTitle = true;
    
    //add gameover screen with info about restart
    textGameover = game.add.text(game.world.centerX,game.world.centerY-100, 'GAME OVER', { font: "bold 32px Arial", fill: "#ffffff" });
    textGameover.anchor.setTo(0.5, 0.5);
    textGameoverRestart = game.add.text(game.world.centerX,game.world.centerY-60, 'Press F5 to restart the game.', { font: "bold 16px Arial", fill: "#ffffff" });
    textGameoverRestart.anchor.setTo(0.5, 0.5);
    showGameover = false;
    textGameover.kill();
    textGameoverRestart.kill();
    
    //add player stats
    textHealth = game.add.text(64,32, 'Health: ' + player.hp + ' / ' + player.maxHealth, { font: "bold 16px Arial", fill: "#ffffff" });
    textScrap = game.add.text(64,64, 'Scrap: ' + player.scrap, { font: "bold 16px Arial", fill: "#ffffff" });
    textMissiles = game.add.text(64,96, 'Missiles: ' + player.missileAmmo, { font: "bold 16px Arial", fill: "#ffffff" });
    textBullets = game.add.text(64,128, 'Bullets: ' + player.gunAmmo, { font: "bold 16px Arial", fill: "#ffffff" });
    
    //add pause text to identify pause mode
    textPause = game.add.text(game.world.centerX,game.world.centerY-120, 'PAUSE', { font: "bold 16px Arial", fill: "#ffffff" });
    textPause.anchor.setTo(0.5, 0.5);
    
    //add button for repairs
    buttonRepair = game.add.button(200, 200, 'button_repair', player.repair, player);
    textRepair = game.add.text(240,205, 'Repair up to 20 health for ' + player.repairCost + ' scrap', { font: "bold 16px Arial", fill: "#ffffff" });
    buttonRepair.inputEnabled = true;
    buttonRepair.input.useHandCursor = false;
    buttonRepair.events.onInputOver.add(function(){
        cursor.loadTexture('cursorMenuRed');
    }, this);
    buttonRepair.events.onInputOut.add(function(){
        cursor.loadTexture('cursorMenu');
    }, this);
    
    //add button for gun upgrades
    buttonUpgradeGun = game.add.button(200, 240, 'button_gun', player.upgradeGun, player);
    textUpgradeGun = game.add.text(240,245, 'Get 1000 bullets for ' + player.upgradeGunCost + ' scrap', { font: "bold 16px Arial", fill: "#ffffff" });
    buttonUpgradeGun.inputEnabled = true;
    buttonUpgradeGun.input.useHandCursor = false;
    buttonUpgradeGun.events.onInputOver.add(function(){
        cursor.loadTexture('cursorMenuRed');
    }, this);
    buttonUpgradeGun.events.onInputOut.add(function(){
        cursor.loadTexture('cursorMenu');
    }, this);
    
    //add button for missile upgrades
    buttonUpgradeMissile = game.add.button(200, 280, 'button_missile', player.upgradeMissile, player);
    textUpgradeMissile = game.add.text(240,285, 'Get 10 missiles for ' + player.upgradeMissileCost + ' scrap', { font: "bold 16px Arial", fill: "#ffffff" });
    buttonUpgradeMissile.inputEnabled = true;
    buttonUpgradeMissile.input.useHandCursor = false;
    buttonUpgradeMissile.events.onInputOver.add(function(){
        cursor.loadTexture('cursorMenuRed');
    }, this);
    buttonUpgradeMissile.events.onInputOut.add(function(){
        cursor.loadTexture('cursorMenu');
    }, this);
    
    
    //hide pause menu on start
    textPause.kill();
    buttonRepair.kill();
    textRepair.kill();
    buttonUpgradeGun.kill();
    textUpgradeGun.kill();
    buttonUpgradeMissile.kill();
    textUpgradeMissile.kill();
    
    //replace mouse cursor with crosshair
    cursor = game.add.sprite(0, 0, 'cursorCrosshair');
    cursor.anchor.setTo(0.5, 0.5);
    game.input.addMoveCallback( function(pointer, x, y) {
        cursor.x = x;
        cursor.y = y;
    });
}

function update() {
    if(showTitle)
    {
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            game.physics.arcade.isPaused = true;
            showTitle = false;
            textTitle.kill();
            textTitleStart.kill();
            textTitleUpgrades.kill();
            textTitleControls.kill();
        }
    }else{
        //check if player pauses the game
        if((pauseKeyPressed == false) && (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)))
        {
            pauseKeyPressed = true;
            if(game.physics.arcade.isPaused)
            {
                game.physics.arcade.isPaused = false;
                cursor.loadTexture('cursorCrosshair');
                //hide pause menu
                textPause.kill();
                //hide upgrade menu
                buttonRepair.kill();
                textRepair.kill();
                buttonUpgradeGun.kill();
                textUpgradeGun.kill();
                buttonUpgradeMissile.kill();
                textUpgradeMissile.kill();
            }else{
                game.physics.arcade.isPaused = true;
                cursor.loadTexture('cursorMenu');
                cursor.rotation = 0;
                //show pause menu
                textPause.revive();
                //show upgrade menu
                buttonRepair.revive();
                textRepair.revive();
                buttonUpgradeGun.revive();
                textUpgradeGun.revive();
                buttonUpgradeMissile.revive();
                textUpgradeMissile.revive();
            }
        }
        if((pauseKeyPressed == true) && (!game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)))
        {
            pauseKeyPressed = false;
        }
        
        if(!game.physics.arcade.isPaused && player.bottom.alive)
        {
            //handle player actions
            player.update();
            
            //rotate cursor depending on the turret rotation to match both weapons
            cursor.rotation = player.top.rotation + player.bottom.rotation;
            
            //handle all actions in the room
            room.update();
            
            //handle actions of all enemies
            enemies.update();
        }
        
        textHealth.setText('Health: ' + player.hp + ' / ' + player.maxHealth);
        textScrap.setText('Scrap: ' + player.scrap);
        textMissiles.setText('Missiles: ' + player.missileAmmo);
        textBullets.setText('Bullets: ' + player.gunAmmo);
        
        if(!player.bottom.alive)
        {
            textGameover.revive();
            textGameoverRestart.revive();
        }
    }
}

function render() {
}