
function Inputter() {
	this.pauseDown = false;
	
	this.control = {
		up: false,
		down: false,
		left: false,
		right: false,
		pause: false,
		rightClick: false,
		leftClick: false,
		middleClick: false,
	};
	
	//disable context menu on right click
	game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
}

Inputter.prototype.update = function(){
	this.control.up = this.up();
	this.control.down = this.down();
	this.control.left = this.left();
	this.control.right = this.right();
	this.control.pause = this.pause();
	this.control.rightClick = this.rightClick();
	this.control.leftClick = this.leftClick();
	this.control.middleClick = this.middleClick();
}

Inputter.prototype.up = function(){
	if(game.input.keyboard.isDown(Phaser.KeyCode.W)){
		return true;
	}
	if(game.input.keyboard.isDown(Phaser.KeyCode.UP)){
		return true;
	}
	if(game.input.keyboard.isDown(Phaser.KeyCode.NUMPAD_8)){
		return true;
	}
	if(game.input.activePointer.isDown && (game.input.activePointer.y < game.world.height/4)){
		return true;
	}
	return false;
}

Inputter.prototype.down = function(){
	if(game.input.keyboard.isDown(Phaser.KeyCode.S)){
		return true;
	}
	if(game.input.keyboard.isDown(Phaser.KeyCode.DOWN)){
		return true;
	}
	if(game.input.keyboard.isDown(Phaser.KeyCode.NUMPAD_2)){
		return true;
	}
	if(game.input.activePointer.isDown && (game.input.activePointer.y > 3*game.world.height/4)){
		return true;
	}
	return false;
}

Inputter.prototype.left = function(){
	if(game.input.keyboard.isDown(Phaser.KeyCode.A)){
		return true;
	}
	if(game.input.keyboard.isDown(Phaser.KeyCode.LEFT)){
		return true;
	}
	if(game.input.keyboard.isDown(Phaser.KeyCode.NUMPAD_4)){
		return true;
	}
	if(game.input.activePointer.isDown && (game.input.activePointer.x < game.world.width/4)){
		return true;
	}
	return false;
}

Inputter.prototype.right = function(){
	if(game.input.keyboard.isDown(Phaser.KeyCode.D)){
		return true;
	}
	if(game.input.keyboard.isDown(Phaser.KeyCode.RIGHT)){
		return true;
	}
	if(game.input.keyboard.isDown(Phaser.KeyCode.NUMPAD_6)){
		return true;
	}
	if(game.input.activePointer.isDown && (game.input.activePointer.x > 3*game.world.width/4)){
		return true;
	}
	return false;
}

Inputter.prototype.pause = function(){
	var pressed = false;
	
	if(game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)){
		pressed = true;
	}
	if(game.input.keyboard.isDown(Phaser.KeyCode.ENTER)){
		pressed = true;
	}
	if(game.input.keyboard.isDown(Phaser.KeyCode.P)){
		pressed = true;
	}
	if(game.input.keyboard.isDown(Phaser.KeyCode.H)){
		pressed = true;
	}
	if(stateManager.state != 'play' && game.input.activePointer.isDown){
		pressed = true;
	}
	
	//check if a key was pressed at all
	if(pressed)
	{
		//check if the key was pressed before
		if(this.pauseDown){
			return false;
		}
		//if no key was pressed before and set that the pause button is now down
		this.pauseDown = true;
		return true;
	}
	
	//if no key was pressed at all, set that the pause button is no longer down
	this.pauseDown = false;
	return false;
}

Inputter.prototype.rightClick = function(){
	if(game.input.activePointer.rightButton.isDown)
	{
		return true;
	}
	return false;
}

Inputter.prototype.leftClick = function(){
	if(game.input.activePointer.leftButton.isDown)
	{
		return true;
	}
	return false;
}

Inputter.prototype.middleClick = function(){
	if(game.input.activePointer.middleButton.isDown)
	{
		return true;
	}
	return false;
}