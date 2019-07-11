
function EntityManager() {
	this.turret = {
		idCounter: 0,
		list: [],
		spawnRate: 10,
		nextSpawn: 0,
		lastSpawn: 0,
		maxAmount: 10,
	};
	this.explosion = {
		idCounter: 0,
		list: [],
	};
	this.enemy = {
		idCounter: 0,
		list: [],
		spawnRate: 1,
		nextSpawn: 0,
		lastSpawn: 0,
		maxAmount: 30,
	};
	this.projectile = {
		idCounter: 0,
		list: [],
	};
	this.cleanup = 3;
}

EntityManager.prototype.countEnemies = function(){
	var amount = 0;
	
	for(var key in this.enemy.list)
	{
		if(!this.enemy.list[key].isDead){
			amount++;
		}
	}
	
	return amount;
}

EntityManager.prototype.countTurrets = function(){
	var amount = 0;
	
	for(var key in this.turret.list)
	{
		if(!this.turret.list[key].isDead){
			amount++;
		}
	}
	
	return amount;
}

EntityManager.prototype.spawnTurret = function(x, y){
	//add new turret
	this.turret.list[this.turret.idCounter] = new Turret(x, y, 0.1, 0, this.turret.idCounter);
	
	//increase counter for ids to make sure an id has only been added once
	this.turret.idCounter++;
}

EntityManager.prototype.spawnEnemy = function(x, y){
	//add new explosion
	this.enemy.list[this.enemy.idCounter] = new Enemy(x, y, this.turret.idCounter);
	
	//increase counter for ids to make sure an id has only been added once
	this.enemy.idCounter++;
}

EntityManager.prototype.generateRandomTurret = function(){
	if((Date.now() > this.turret.lastSpawn + this.turret.nextSpawn) && (this.turret.list.length < this.turret.maxAmount))
	{
		this.spawnTurret((game.world.width/4)+Math.random()*(game.world.width/2), (game.world.height/4)+Math.random()*(game.world.height/2));
		this.turret.lastSpawn = Date.now();
		this.turret.nextSpawn = 1000/(this.turret.spawnRate * (this.countTurrets() / this.turret.maxAmount) * (this.enemy.maxAmount / this.countEnemies()));
	}
}

EntityManager.prototype.generateRandomEnemy = function(){
	if((Date.now() > this.enemy.lastSpawn + this.enemy.nextSpawn) && (this.countEnemies() < this.enemy.maxAmount))
	{
		this.spawnEnemy(game.world.randomX, game.world.randomY);
		this.spawnEnemy(game.world.randomX, game.world.randomY);
		this.spawnEnemy(game.world.randomX, game.world.randomY);
		this.enemy.lastSpawn = Date.now();
		this.enemy.nextSpawn = 1000/(this.enemy.spawnRate + (Date.now() - stateManager.timeStart) / 30000);
	}
}

EntityManager.prototype.update = function(){
	//run update function on every turret
	for(var key in this.turret.list)
	{
		this.turret.list[key].update();
	}
	
	//run update function on every enemy
	for(var key in this.enemy.list)
	{
		this.enemy.list[key].update();
		if((this.enemy.list[key].state == 'dead') && (Date.now() > this.enemy.list[key].isDead + this.cleanup*1000))
		{
			this.enemy.list[key].sprite.destroy();
			delete this.enemy.list[key];
		}
	}
	
	//run update function on every explosion
	for(var key in this.explosion.list)
	{
		this.explosion.list[key].update();
		if((this.explosion.list[key].isDone != 0) && (Date.now() > this.explosion.list[key].isDone + this.cleanup*1000))
		{
			this.explosion.list[key].sprite.destroy();
			this.explosion.list[key] = undefined;
			delete this.explosion.list[key];
		}
	}
	
	//run update function on every projectile
	for(var key in this.projectile.list)
	{
		this.projectile.list[key].update();
		if(!this.onScreen(this.projectile.list[key].sprite) || this.projectile.list[key].hit)
		{
			this.projectile.list[key].sprite.destroy();
			this.projectile.list[key] = undefined;
			delete this.projectile.list[key];
		}
	}
}

EntityManager.prototype.removeAll = function(){
	//run update function on every turret
	for(var key in this.turret.list)
	{
		this.turret.list[key].sprite.destroy();
		this.turret.list[key].sprite.gun.destroy();
		this.turret.list[key].sprite.hp.destroy();
		this.turret.list[key] = undefined;
		delete this.turret.list[key];
	}
	
	//run update function on every enemy
	for(var key in this.enemy.list)
	{
		this.enemy.list[key].sprite.destroy();
		this.enemy.list[key].sprite.hp.destroy();
		this.enemy.list[key] = undefined;
		delete this.enemy.list[key];
	}
	
	//run update function on every explosion
	for(var key in this.explosion.list)
	{
		this.explosion.list[key].sprite.destroy();
		this.explosion.list[key] = undefined;
		delete this.explosion.list[key];
	}
	
	//run update function on every projectile
	for(var key in this.projectile.list)
	{
		this.projectile.list[key].sprite.destroy();
		this.projectile.list[key] = undefined;
		delete this.projectile.list[key];
	}
}

EntityManager.prototype.draw = function(){
	//draw every turret
	game.world.bringToTop(groups.turret.hp);
	game.world.bringToTop(groups.turret.base);
	game.world.bringToTop(groups.turret.gun);
	
	//draw every enemy
	game.world.bringToTop(groups.enemy.hp);
	game.world.bringToTop(groups.enemy.alien);
	
	//draw every explosion
	game.world.bringToTop(groups.explosion);
	
	//draw all projectiles
	game.world.bringToTop(groups.projectile);
}

EntityManager.prototype.spawnExplosion = function(x, y, attachTo){
	//add new explosion
	this.explosion.list[this.explosion.idCounter] = new Explosion(x, y, attachTo);
	
	//increase counter for ids to make sure an id has only been added once
	this.explosion.idCounter++;
}

EntityManager.prototype.checkOverlap = function(spriteA, spriteB){
	//check if spriteA and spriteB overlap (anchor of sprite has to be centered)
	if(spriteA.x + spriteA.width/2 > spriteB.x - spriteB.width/2 &&
		spriteA.x - spriteA.width/2 < spriteB.x + spriteB.width/2 &&
		spriteA.y + spriteA.height/2 > spriteB.y - spriteB.height/2 &&
		spriteA.y - spriteA.height/2 < spriteB.y + spriteB.height/2){
		return true;
	}
	return false;
}

EntityManager.prototype.onScreen = function(sprite){
	//check if sprite is still within the screen boundaries
	if(sprite.x < sprite.width/2)
	{
		return false;
	}
	if(sprite.x > game.world.width-sprite.width/2)
	{
		return false;
	}
	if(sprite.y < sprite.height/2)
	{
		return false;
	}
	if(sprite.y > game.world.height-sprite.height/2)
	{
		return false;
	}
	return true;
}