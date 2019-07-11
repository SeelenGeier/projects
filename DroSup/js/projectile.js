
function Projectile(x, y, angle, id, speed = 1, damage = 1) {
	this.id = id;
	this.speed = speed;
	this.hit = false;
	this.damage = damage;
	this.angle = angle;
	
	this.loadSprite(x, y);
}

Projectile.prototype.loadSprite = function(x, y){
	//add sprite to explosion
	this.sprite = game.add.sprite(x, y, 'blank');
    this.sprite.tint = 0xffbb00;
	this.sprite.width = 1;
	this.sprite.height = 5;
	this.sprite.angle = this.angle-90;
	
	//move projectile to border of the gun
	this.sprite.x += Math.cos(this.angle*Math.PI/180)*16;
	this.sprite.y += Math.sin(this.angle*Math.PI/180)*16;
	
	//set center for explosion sprite
	this.sprite.anchor.setTo(0.5, 0.5);
	
	//add sprite to its corresponding group
	groups.projectile.add(this.sprite);
	
	this.sprite.enableBody = true;
}

Projectile.prototype.update = function(){
	this.moveForward();
}

Projectile.prototype.moveForward = function(){
	if(!this.hit)
	{
		this.sprite.x += Math.cos(this.angle*Math.PI/180)*this.speed*10;
		this.sprite.y += Math.sin(this.angle*Math.PI/180)*this.speed*10;
		for(var key in entityManager.enemy.list)
		{
			if(entityManager.checkOverlap(this.sprite, entityManager.enemy.list[key].sprite) && !entityManager.enemy.list[key].isDead)
			{
				this.hit = true;
				entityManager.enemy.list[key].getHit(this.damage);
			}
		}
	}
}