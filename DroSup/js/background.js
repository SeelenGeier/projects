
function Background(sprite_width, sprite_height, sprite_amount) {
	
	//fill screen with random patches of grass
    for (var i = 0; i < game.world.height/sprite_width; i++)
	{
		for (var j = 0; j < game.world.width/sprite_height; j++)
		{
			tile = game.add.sprite(j*sprite_height, i*sprite_width, 'background', Math.round(Math.random()*sprite_amount)%sprite_amount);
			groups.map.add(tile);
		}
	}
}