
function Explosion(x, y, attachTo = null) {
	this.attachedTo = attachTo;
	this.isDone = 0;
	
	this.loadSprite(x, y);
}

Explosion.prototype.loadSprite = function(x, y){
	//add sprite to explosion
	this.sprite = game.add.sprite(x, y, 'explosion');
	
	//register animation
	this.sprite.animations.add('explode');
	
	//set center for explosion sprite
	this.sprite.anchor.setTo(0.5, 0.5);
	
	//add sprite to its corresponding group
	groups.explosion.add(this.sprite);
}

Explosion.prototype.update = function(){
	if(typeof this.attachedTo != "undefined")
	{
		//if explosion is attached to another object move with the object
		this.sprite.x = this.attachedTo.sprite.x;
		this.sprite.y = this.attachedTo.sprite.y;
	}
	
	//play animation for explosion
	this.sprite.animations.play('explode', 13, false, true);
	
	//set time when animation is done for entityManager cleanup
	if(this.isDone == 0 && this.sprite.animations.currentAnim.frame == 12)
	{
		this.isDone = Date.now();
	}
}

Explosion.prototype.draw = function(){
	game.world.bringToTop(groups.turret);
}