
function Enemy(position_x, position_y, id) {
	this.id = id;
	this.target = null;
	this.hp = 10;
	this.hpMax = 10;
	this.isDead = 0;
	this.state = 'walk';
	this.speed = Math.random() * 100;
	this.damage = 1;
	
	this.loadSprite(position_x, position_y);
}

Enemy.prototype.loadSprite = function(x, y){
	//add drone sprite to player
	this.sprite = game.add.sprite(x, y, 'enemy');
	
	//register enemy animations
	this.sprite.animations.add('enemy_idle', [0, 1], 2, true);
	this.sprite.animations.add('enemy_walk', [2, 4, 3, 4], 6, true);
	this.sprite.animations.add('enemy_attack', [14, 15, 16, 15], 8, true);
	this.sprite.animations.add('enemy_die', [9, 10, 11, 12], 8, true);
	this.sprite.animations.add('enemy_dead', [12], null, true);
	
	//set drone anchor to its center for it to be able to rotate
	this.sprite.anchor.setTo(0.5, 0.5);
	
	//add sprite to its corresponding group
	groups.enemy.alien.add(this.sprite);
	
	//add HP bar
	this.sprite.hp = game.add.sprite(this.sprite.x - this.sprite.width / 2 + 1, this.sprite.y + this.sprite.height / 2 + 1, 'blank');
	groups.enemy.hp.add(this.sprite.hp);
	this.sprite.hp.width = this.sprite.width * this.hp / this.hpMax - 2;
	if(this.sprite.hp.width < 0)
	{
		this.sprite.hp.width = 0;
	}
	this.sprite.hp.height = 3;
}

Enemy.prototype.update = function(){
	//keep running the animation for the current state
	this.sprite.animations.play('enemy_'+this.state, this.sprite.animations.getAnimation('enemy_'+this.state).frameRate, false, false);
	
	//check if enemy died
	if(this.state == 'die')
	{
		//check if dying animation is done
		if(this.sprite.animations.currentAnim.frame == 11)
		{
			this.state = 'dead';
		}
	}
	
	this.targetClosestTurret();
	this.moveToTarget();
	this.hitTurret();
	this.handleHP();
	this.updateSprite();
}

Enemy.prototype.updateSprite = function(){
	//update sprite position with turret position
	this.sprite.hp.x = this.sprite.x - this.sprite.width / 2 + 1;
	this.sprite.hp.y = this.sprite.y + this.sprite.height / 2 + 1;
}

Enemy.prototype.moveToTarget = function(){
	//only move if any target has been selected
	if(typeof this.target != "undefined" && this.target != null && this.isDead == 0 && !entityManager.checkOverlap(this.sprite, this.target.sprite) && stateManager.state == 'play')
	{
		game.physics.arcade.moveToXY(this.sprite, this.target.sprite.x, this.target.sprite.y, this.speed, 0);
        this.state = 'walk';
	}else{
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
	}
}

Enemy.prototype.handleHP = function(){
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

Enemy.prototype.die = function(){
	//remove sprites
	this.sprite.hp.kill();
	
	//set dying state
	this.state = 'die';
	
	//set time when animation is done for entityManager cleanup
	this.isDead = Date.now();
}

Enemy.prototype.getHit = function(amount){
	this.hp -= amount;
	if(this.hp < 0)
	{
		this.hp = 0;
	}
}

Enemy.prototype.targetClosestTurret = function(){
	var currentDistance = -1;
	var dx;
	var dy;
	this.target = null;
	
	for(var key in entityManager.turret.list)
	{
		if(entityManager.turret.list[key].isDead)
		{
			continue;
		}
        dx = this.sprite.x - entityManager.turret.list[key].sprite.x;
        dy = this.sprite.y - entityManager.turret.list[key].sprite.y;

        newDistance = Math.sqrt(dx * dx + dy * dy);
		
		if((currentDistance == -1) || (newDistance < currentDistance))
		{
			this.target = entityManager.turret.list[key];
			currentDistance = newDistance;
		}
	}
    if(this.target == null && !this.isDead){
        this.state = 'idle';
    }
}

Enemy.prototype.hitTurret = function(){
	if(!this.isDead){
		for(var key in entityManager.turret.list)
		{
			if(entityManager.checkOverlap(this.sprite, entityManager.turret.list[key].sprite) && !entityManager.turret.list[key].isDead)
			{
				this.state = 'attack';
				entityManager.turret.list[key].getHit(this.damage);
			}
		}
		
	}
}