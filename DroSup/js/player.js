
function Player(position_x, position_y, angle = 0) {
	this.rotation_speed = 3;
	this.movement_speed = 0.3;
	this.velocity = {x:0,y:0,max:3,slowdown:0.1};
	this.angle = angle;
	this.move = {up:false,down:false,left:false,right:false};
	
	this.loadSprite(position_x, position_y);
}

Player.prototype.loadSprite = function(x, y){
	//add drone sprite to player
	this.sprite = game.add.sprite(x, y, 'player');
	
	//register drone fly animation
	this.sprite.animations.add('fly', null, 200, true);
	
	//set drone anchor to its center for it to be able to rotate
	this.sprite.anchor.setTo(0.5, 0.5);
	this.sprite.angle = this.angle;
}

Player.prototype.update = function(){
	//keep running the fly animation for the drone
	this.sprite.animations.play('fly');
	
	this.handleInput();
	this.movePlayer();
	this.healTurret();
}

Player.prototype.handleInput = function(){
	//handle movement input
	this.move.up = false;
	this.move.down = false;
	this.move.left = false;
	this.move.right = false;
	
	if (inputter.control.left)
	{
		//move left
		this.velocity.x -= this.movement_speed;
		this.move.left = true;
	}
	if (inputter.control.right)
	{
		//move right
		this.velocity.x += this.movement_speed;
		this.move.right = true;
	}
	if (inputter.control.up)
	{
		//move up
		this.velocity.y -= this.movement_speed;
		this.move.up = true;
	}
	if (inputter.control.down)
	{
		//move down
		this.velocity.y += this.movement_speed;
		this.move.down = true;
	}
}

Player.prototype.movePlayer = function(){
	this.moveForward();
	this.limitVelocity();
	this.stopTooSlow();
	this.rotateToDirection();
	this.keepOnScreen();
}

Player.prototype.moveForward = function(){
	//move player towards his velocity
	if(this.velocity.x != 0 || this.velocity.y != 0)
	{
		//total velocity in all directions
		total_x = Math.abs(this.velocity.x);
		total_y = Math.abs(this.velocity.y);
		
		//percentage of velocity
		dx = total_x / (total_x + total_y);
		dy = total_y / (total_x + total_y);
		
		//add velocity to position based on percentage in all directions
		this.sprite.x += this.velocity.x * dx;
		this.sprite.y += this.velocity.y * dy;
		
		//gradually slow down player
		this.velocity.x -= Math.sign(this.velocity.x) * this.velocity.slowdown * dx;
		this.velocity.y -= Math.sign(this.velocity.y) * this.velocity.slowdown * dy;
	}
}

Player.prototype.rotateToDirection = function(){
	//rotate drone towards movement direction
	if(this.velocity.x != 0 || this.velocity.y != 0)
	{
		this.angle = Math.atan2(this.move.down-this.move.up,this.move.right-this.move.left)*180/Math.PI;
	}
	if((this.sprite.angle != this.angle) && (this.move.up || this.move.down || this.move.left || this.move.right))
	{
		wantDir = this.angle;
		currDir = this.sprite.angle;
		if (wantDir >= (currDir + 180))
		{
			currDir += 360;
		}else{
			if (wantDir < (currDir - 180))
			{
				wantDir += 360;
			}
		}
		
		direction = wantDir - currDir;
		
		this.sprite.angle += Math.sign(direction)*this.rotation_speed;
	}
}

Player.prototype.keepOnScreen = function(){
	//keep player on screen
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

Player.prototype.limitVelocity = function(){
	//limit player top speed
	if(this.velocity.x < -this.velocity.max)
	{
		this.velocity.x = -this.velocity.max;
	}
	if(this.velocity.x > this.velocity.max)
	{
		this.velocity.x = this.velocity.max;
	}
	if(this.velocity.y < -this.velocity.max)
	{
		this.velocity.y = -this.velocity.max;
	}
	if(this.velocity.y > this.velocity.max)
	{
		this.velocity.y = this.velocity.max;
	}
}

Player.prototype.stopTooSlow = function(){
	//stop drone if velocity drops to the slowdown threshold
	if((this.velocity.x < this.velocity.slowdown) && (this.velocity.x > -this.velocity.slowdown))
	{
		this.velocity.x = 0;
	}
	if((this.velocity.y < this.velocity.slowdown) && (this.velocity.y > -this.velocity.slowdown))
	{
		this.velocity.y = 0;
	}
}

Player.prototype.healTurret = function(){
	for(var key in entityManager.turret.list)
	{
		//repair turret if he is under player and not carried by player
		if(entityManager.checkOverlap(entityManager.turret.list[key].sprite, this.sprite)){
			entityManager.turret.list[key].repair();
		}
	}
}
