
function Turret(position_x, position_y, rotation_speed, angle, id) {
	this.rotation_speed = rotation_speed;
	this.angle = angle;
	this.id = id;
	this.target = null;
	this.hp = 100;
	this.hpMax = 200;
	this.isDead = false;
	this.shotFrequency = 100;
	this.lastShot = 0;
	
	this.loadSprite(position_x, position_y);
}

Turret.prototype.loadSprite = function(x, y){
	//add sprite to turret
	this.sprite = game.add.sprite(x, y, 'turret_base');
	this.sprite.gun = game.add.sprite(this.sprite.x, this.sprite.y, 'turret_gun');
	
	//set turret anchor to its center for it to be able to rotate
	this.sprite.anchor.setTo(0.5, 0.5);
	this.sprite.gun.anchor.setTo(0.5, 0.5);
	
	//add sprites to their corresponding group
	groups.turret.base.add(this.sprite);
	groups.turret.gun.add(this.sprite.gun);
	
	//add HP bar
	this.sprite.hp = game.add.sprite(this.sprite.x - this.sprite.width / 2 + 1, this.sprite.y + this.sprite.height / 2 + 1, 'blank');
	groups.turret.hp.add(this.sprite.hp);
	this.sprite.hp.width = this.sprite.width * this.hp / this.hpMax - 2;
	if(this.sprite.hp.width < 0)
	{
		this.sprite.hp.width = 0;
	}
	this.sprite.hp.height = 3;
}

Turret.prototype.update = function(){
	this.updateSprite();
	this.handleCollision();
	this.handleHP();
	this.targetClosestEnemy();
	this.shootContinuously();
	this.keepOnScreen();
}

Turret.prototype.keepOnScreen = function(){
	//keep turret on screen
	if(this.sprite.x < 16)
	{
		this.sprite.x = 16;
	}
	if(this.sprite.x > game.world.width-16)
	{
		this.sprite.x = game.world.width-16;
	}
	if(this.sprite.y < 16)
	{
		this.sprite.y = 16;
	}
	if(this.sprite.y > game.world.height-16)
	{
		this.sprite.y = game.world.height-16;
	}
}

Turret.prototype.updateSprite = function(){
	//point to target with turret
	this.faceTarget();
	
	//update sprite position with turret position
	this.sprite.gun.x = this.sprite.x;
	this.sprite.gun.y = this.sprite.y;
	this.sprite.hp.x = this.sprite.x - this.sprite.width / 2 + 1;
	this.sprite.hp.y = this.sprite.y + this.sprite.height / 2 + 1;
	
	//update sprite rotation with turret rotation
	this.sprite.gun.angle = this.angle;
}

Turret.prototype.faceTarget = function(){
	//rotate turret to face target if target is set and available
	if((this.target != null) || (typeof this.target == "undefined")){
		this.angle = Math.atan2(this.target.sprite.y-this.sprite.y,this.target.sprite.x-this.sprite.x)*180/Math.PI;
	}else{
		//rotate turret while no target is selected
		this.angle++;
	}
}

Turret.prototype.handleCollision = function(){
	//check for collision with other turrets
	for(var key in entityManager.turret.list)
	{
		if(key != this.id)
		{
			if (entityManager.checkOverlap(entityManager.turret.list[key].sprite, this.sprite)){
				//move both partys away from each other to resolve collision
				this.moveAwayFrom(entityManager.turret.list[key]);
			}
		}
	}
}

Turret.prototype.moveAwayFrom = function(otherTurret){
	//move current position one pixel right and down away from the object if they are in the same position
	if((this.sprite.x == otherTurret.sprite.x) && (this.sprite.y == otherTurret.sprite.y))
	{
		this.sprite.x += 1;
		this.sprite.y += 1;
	}
	
	//move current position one pixel horizontal and vertical away from the object
	this.sprite.x += Math.sign(this.sprite.x - otherTurret.sprite.x);
	this.sprite.y += Math.sign(this.sprite.y - otherTurret.sprite.y);
}

Turret.prototype.die = function(){
	//remove gun
	this.sprite.gun.kill();
	
	//spawn explosion
	entityManager.spawnExplosion(this.sprite.x, this.sprite.y, this);
	
	this.isDead = true;
}

Turret.prototype.setTarget = function(object){
	this.target = object;
}

Turret.prototype.repair = function(){
	if(this.hp >= this.hpMax){
		this.hp = this.hpMax;
		
		//revive gun on turret
		this.sprite.gun.revive();
		
		this.isDead = false;
	}else{
		this.hp += this.hpMax/100;
		if(this.hp > this.hpMax)
		{
			this.hp = this.hpMax;
		}
	}
}

Turret.prototype.handleHP = function(){
	if((this.hp <= 0) && !this.isDead){
		this.die();
		this.hp = 0;
	}
	this.sprite.hp.width = this.sprite.width * this.hp / this.hpMax - 2;
	if(this.sprite.hp.width < 0)
	{
		this.sprite.hp.width = 0;
	}
	this.sprite.hp.height = 3;
    
	//HACK: interpolating with (this.hp - 1) is necessary for PHASER.AUTO (WEBGL) to run correctly. otherwise with only this.hp, the color of the full HP bar would be black. Dunno why :(
    this.sprite.hp.tint = Phaser.Color.interpolateColor(0xff0000, 0x00ff00, this.hpMax, this.hp - 1, 1);
}

Turret.prototype.targetClosestEnemy = function(){
	var currentDistance = -1;
	var dx;
	var dy;
	this.target = null;
	
	//only retarget if under player
	if(entityManager.checkOverlap(player.sprite, this.sprite))
	{
		return false;
	}
	
	for(var key in entityManager.enemy.list)
	{
		if(entityManager.enemy.list[key].isDead)
		{
			continue;
		}
        dx = this.sprite.x - entityManager.enemy.list[key].sprite.x;
        dy = this.sprite.y - entityManager.enemy.list[key].sprite.y;

        newDistance = Math.sqrt(dx * dx + dy * dy);
		
		if((currentDistance == -1) || (newDistance < currentDistance))
		{
			this.target = entityManager.enemy.list[key];
			currentDistance = newDistance;
		}
	}
}

Turret.prototype.shoot = function(angle){
	
	//add new projectile
	entityManager.projectile.list[entityManager.projectile.idCounter] = new Projectile(this.sprite.x, this.sprite.y, this.angle, entityManager.projectile.idCounter);
	
	//increase counter for ids to make sure an id has only been added once
	entityManager.projectile.idCounter++;
	
}

Turret.prototype.shootContinuously = function(){
	//only shoot if any target has been selected
	if(typeof this.target == "undefined" || this.target == null)
	{
		return false;
	}
    
	//do not shoot if dead or under player
	if(this.isDead || entityManager.checkOverlap(player.sprite, this.sprite))
	{
		return false;
	}
	
	if(Date.now() > this.lastShot + this.shotFrequency)
	{
		this.shoot(this.angle);
		this.lastShot = Date.now();
        
        //lose health for shooting (ammunition)
		this.hp -= 1;
	}
}

Turret.prototype.getHit = function(amount){
	this.hp -= amount;
	if(this.hp < 0){
		this.hp = 0;
	}
	this.handleHP();
}
