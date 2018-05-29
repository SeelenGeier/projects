
function StateManager() {
	this.state = 'pause';
	this.timeStart = 0;
	this.pauseTime = 0;
	this.pauseStart = 0;
	this.finalTime = 0;
	this.maxTime = this.getCookie('maxTime');
	this.helpText = {};
	this.gameOverText = {};
	
	//add black screen
	this.sprite = game.add.sprite(0, 0, 'blank');
	this.sprite.tint = 0x000000;
	this.sprite.alpha = 0.5;
}

StateManager.prototype.gameStart = function(){
	if(this.state == 'gameover'){
		groups.map.removeAll();
		player.sprite.destroy();
		entityManager.removeAll();
		map = undefined;
		player = undefined;
		entityManager = undefined;
	}
	this.hideGameOver();
	
	this.state = 'pause';
	this.showHelp();
	this.timeStart = Date.now();
	this.pauseTime = 0;
	this.pauseStart = Date.now();
	
	map = new Background(16, 16, 2);
	player = new Player(game.world.width/2, game.world.height/2);
	entityManager = new EntityManager();
}

StateManager.prototype.pauseOrResume = function(){
	if(this.state == 'play'){
		this.state = 'pause';
		this.pauseStart = Date.now();
	}else if(this.state == 'pause'){
		this.state = 'play';
		this.pauseTime += Date.now() - this.pauseStart;
	}
}

StateManager.prototype.update = function(){
	if(this.state != 'gameover' && inputter.control.pause){
		this.pauseOrResume();
	}
	if(this.state == 'gameover' && inputter.control.pause){
		this.gameStart();
	}
}

StateManager.prototype.showHelp = function(){
	this.hideAll();
	this.helpText = {
		0: game.add.text(64,32, "Move with WASD/Arrow/Numpad_(8/4/2/6).", { font: "16px Arial", fill: "#ffffff" }),
		1: game.add.text(64,96, "Hover over turrets to repair them.", { font: "16px Arial", fill: "#ffffff" }),
		3: game.add.text(64,128, "Turrets can't fire while being repaired.", { font: "16px Arial", fill: "#ffffff" }),
		4: game.add.text(64,160, "If a turret is disabled, it won't fire again until fully repaired.", { font: "16px Arial", fill: "#ffffff" }),
		5: game.add.text(64,192, "The game is over when all your turrets are disabled.", { font: "16px Arial", fill: "#ffffff" }),
		8: game.add.text(64,256, "Survive as long as you can...", { font: "16px Arial", fill: "#ffffff" }),
		9: game.add.text(270,560, "Pause game and show/hide this screen by pressing P/H/SPACE/ENTER.", { font: "16px Arial", fill: "#ffffff" }),
	};
}

StateManager.prototype.hideHelp = function(){
	for(var key in this.helpText)
	{
		this.helpText[key].destroy();
	}
}

StateManager.prototype.showGameOver = function(){
	this.hideAll();
	this.gameOverText = {
		0: game.add.text(64,256, "YOU LOST!", { font: "16px Arial", fill: "#ff0000" }),
		1: game.add.text(64,320, "You survived for " + this.finalTime + " seconds", { font: "16px Arial", fill: "#ffffff" }),
		2: game.add.text(64,352, "Your highscore was " + this.maxTime + " seconds", { font: "16px Arial", fill: "#ffffff" }),
		3: game.add.text(64,384, "Press P/H/SPACE/ENTER to try again.", { font: "16px Arial", fill: "#ffffff" }),
	};
}

StateManager.prototype.hideGameOver = function(){
	for(var key in this.gameOverText)
	{
		this.gameOverText[key].destroy();
	}
}

StateManager.prototype.hideAll = function(){
	this.hideHelp();
	this.hideGameOver();
}

StateManager.prototype.checkGameOver = function(){
	if((entityManager.countTurrets() == 0) && this.state == 'play'){
		this.state = 'gameover';
		this.finalTime = Math.round((Date.now() - this.timeStart - this.pauseTime)/1000);
		if(this.finalTime > this.maxTime)
		{
			this.maxTime = this.finalTime;
			document.cookie = "maxTime="+this.maxTime;
		}
		
		//stop all enemies from moving
		for(var key in entityManager.enemy.list)
		{
			entityManager.enemy.list[key].moveToTarget();
		}
		
	}
}

StateManager.prototype.getCookie = function(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
} 