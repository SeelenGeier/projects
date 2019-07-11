
class Room {
    
    constructor()
    {
        this.floor = game.add.group();
        this.walls = game.add.group();
        this.wreckages = game.add.group();
        this.crates = game.add.group();
        this.pickups = game.add.group();
        this.explosions = game.add.group();
        this.explosions_missile = game.add.group();
        this.smokes = game.add.group();
        this.decals = game.add.group();
        this.walls.enableBody = true;
        this.wreckages.enableBody = true;
        this.crates.enableBody = true;
        this.pickups.enableBody = true;
    }
    
    fill_floor()
    {
        //fill room with floor sprite
        for (let i = 0; i < game.world.height/game.cache.getImage('room_floor').height; i++)
        {
            for (let j = 0; j < game.world.width/game.cache.getImage('room_floor').width; j++)
            {
                this.floor.getFirstExists(false,true, j*game.cache.getImage('room_floor').width, i*game.cache.getImage('room_floor').height, 'room_floor');
            }
        }
    }
    
    restart()
    {
        this.clear_room();
        
        this.place_walls();
        this.place_exits();
        this.place_corners();
        this.place_wreckages();
        this.place_crates();
        enemies.place_enemies();
    }
    
    clear_room()
    {
        this.wreckages.killAll();
        this.crates.killAll();
        this.walls.killAll();
        this.pickups.killAll();
        this.explosions.killAll();
        this.explosions_missile.killAll();
        this.smokes.killAll();
        this.decals.killAll();
        
        player.clear_projectiles();
        player.clear_tracks();
        
        enemies.clear_all();
    }
    
    place_walls()
    {
        for (let i = 1; i+2 < game.world.height / game.cache.getImage('room_wall').height; i++)
        {
            //left
            this.walls.getFirstExists(false,true, 0, i * game.cache.getImage('room_wall').height, 'room_wall');
            //right
            this.walls.getFirstExists(false,true, game.world.width - game.cache.getImage('room_wall').width, i * game.cache.getImage('room_wall').height, 'room_wall');
        }
        for (let i = 1; i+2 < game.world.width / game.cache.getImage('room_wall').width; i++)
        {
            //top
            this.walls.getFirstExists(false,true, i * game.cache.getImage('room_wall').width, 0, 'room_wall');
            //bottom
            this.walls.getFirstExists(false,true, i * game.cache.getImage('room_wall').width, game.world.height - game.cache.getImage('room_wall').height, 'room_wall');
        }
        this.walls.setAll('body.immovable', true);
    }
    
    place_corners()
    {
        //place corners
        this.walls.getFirstExists(false,true, 0, 0, 'room_wall');
        this.walls.getFirstExists(false,true, 0, game.world.height - game.cache.getImage('room_wall').height, 'room_wall');
        this.walls.getFirstExists(false,true, game.world.width - game.cache.getImage('room_wall').width, 0, 'room_wall');
        this.walls.getFirstExists(false,true, game.world.width - game.cache.getImage('room_wall').width, game.world.height - game.cache.getImage('room_wall').height, 'room_wall');
        
        this.walls.setAll('body.immovable', true);
    }

    place_crates()
    {
        //generate 3-8 crates in every room
        let amount = 3 + Math.random() * 6;
        for(let i = 0; i < amount; i++)
        {
            //pick a sprite at random
            let crate_sprite = 'object_crate_' + (1 + Math.round(Math.random() * 3));
            
            //place within walls
            let x = game.cache.getImage('room_wall').width * 2 + Math.random() * (game.world.width - game.cache.getImage(crate_sprite).width - game.cache.getImage('room_wall').width * 3);
            let y = game.cache.getImage('room_wall').height * 2 + Math.random() * (game.world.height - game.cache.getImage(crate_sprite).height - game.cache.getImage('room_wall').height * 3);
            
            let crate = this.crates.getFirstExists(false,true, x, y, crate_sprite);
            crate.body.setSize(crate.width, crate.height);
            crate.hp = 50;
        }
        this.crates.setAll('body.immovable', true);
    }

    place_wreckages()
    {
        //generate 1-3 wreckages in every room
        let amount = 1 + Math.random() * 3;
        for(let i = 0; i < amount; i++)
        {
            //pick a sprite at random
            let wreckage_sprite = 'object_wreckage_' + (1 + Math.round(Math.random() * 3));
            
            //place within walls
            let x = game.cache.getImage('room_wall').width * 2 + Math.random() * (game.world.width - game.cache.getImage(wreckage_sprite).width - game.cache.getImage('room_wall').width * 3);
            let y = game.cache.getImage('room_wall').height * 2 + Math.random() * (game.world.height - game.cache.getImage(wreckage_sprite).height - game.cache.getImage('room_wall').height * 3);
            
            let wreckage = this.wreckages.getFirstExists(false,true, x, y, wreckage_sprite);
            wreckage.body.setSize(wreckage.width, wreckage.height);
            wreckage.hp = 200;
        }
        this.wreckages.setAll('body.immovable', true);
    }
    
    playerInsideWall(player, wall)
    {
        wall.kill();
    }
    
    place_exits()
    {
        //remove 1-5 wall segments to create exits
        let amount = 1 + Math.random() * 4;
        for(let i = 0; i < amount; i++)
        {
            this.walls.getRandomExists().kill();
        }
        
        freshExits = 0;
    }
    
    update()
    {
        //check at least two frames if character overlaps a wall on entering a new room (hack: no idea why only one check does not work)
        if(freshExits < 2)
        {
            //check for player overlapping walls when going into a new room
            game.physics.arcade.overlap(player.bottom, this.walls, this.playerInsideWall, null, this);
            freshExits++;
        }
        
        this.crates.forEachAlive(function(crate) {
            if((crate.hp <= 0) && (crate.hp != null))
            {
                for(let i = 1; i < Math.random() * 5; i++)
                {
                    room.spawnPickup(crate.x+crate.width/4, crate.y+crate.height/4);
                }
                crate.hp = null;
                crate.kill();
            }
        });
        
        this.wreckages.forEachAlive(function(wreckage) {
            if((wreckage.hp <= 0) && (wreckage.hp != null))
            {
                for(let i = 1; i < (5 + Math.random() * 6); i++)
                {
                    room.spawnPickup(wreckage.x+wreckage.width/4, wreckage.y+wreckage.height/4);
                }
                wreckage.hp = null;
                wreckage.kill();
            }
        });
        
        this.explosions.forEachAlive(function(explosion) {
            explosion.animations.play('explode', 32, false, true);
            if(explosion.animations.currentAnim.frame == 12)
            {
                let smoke = room.smokes.getFirstExists(false,true, explosion.x, explosion.y, 'smoke');
                smoke.anchor.setTo(0.5, 0.5);
                smoke.rotation = explosion.rotation;
                smoke.animations.add('smoke');
            }
        });
        this.smokes.forEachAlive(function(smoke) {
            smoke.animations.play('smoke', 32, false, true);
        });
        this.explosions_missile.forEachAlive(function(explosion_missile) {
            explosion_missile.animations.play('explode', 24, false, true);
        });
        
        game.physics.arcade.overlap(player.bottom, this.pickups, this.pickupAquired, null, this);
        game.physics.arcade.collide(this.pickups, [this.walls, this.crates, this.wreckages]);
    }
    
    spawnPickup(x, y)
    {
        let pickup = this.pickups.getFirstExists(false,true, x, y, 'pickup_scrap');
        pickup.body.velocity.x = Math.random() * 100 - 50;
        pickup.body.velocity.y = Math.random() * 100 - 50;
        pickup.body.allowDrag = true;
        pickup.body.drag.x = 50;
        pickup.body.drag.y = 50;
    }
    
    pickupAquired(bottom, pickup)
    {
        player.scrap += Math.round(Math.random() * 10);
        pickup.kill();
    }
    
    spawnExplosion(x, y)
    {
        let explosion = this.explosions.getFirstExists(false,true, x, y, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);
        explosion.rotation = Math.PI - (Math.random()*Math.PI*2);
        explosion.animations.add('explode');
    }
    
    spawnExplosionMissile(x, y, rotation)
    {
        //move explosion a bit forward due to high missile speed
        x += 16 * Math.cos(rotation);
        y += 16 * Math.sin(rotation);
        let explosion_missile = this.explosions_missile.getFirstExists(false,true, x, y, 'explosion_missile');
        explosion_missile.anchor.setTo(0.5, 0.5);
        explosion_missile.rotation = Math.PI - (Math.random()*Math.PI*2);
        explosion_missile.animations.add('explode');
    }
    
    spawnDecal(x, y, rotation)
    {
        //pick a sprite at random
        let decal_sprite = 'decal_' + (1 + Math.round(Math.random() * 3));
        let decal = this.decals.getFirstExists(false,true, x, y, decal_sprite);
        decal.anchor.setTo(0.5, 0.5);
        decal.rotation = rotation;
        decal.lifespan = 100;
    }
}