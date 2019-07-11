
class Enemies {
    constructor()
    {
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
    }
    
    place_enemies()
    {
        //generate 2-5 enemies in every room
        let amount = 1 + Math.random() * 3;
        for(let i = 0; i < amount; i++)
        {
            
            this.spawn_suicide();
            this.spawn_turret_gun();
        }
    }
    
    clear_all()
    {
        this.enemies.killAll();
    }
    
    move_all()
    {
        this.enemies.forEachAlive(function(enemy) {
            if(enemy.isMobile)
            {
                game.physics.arcade.moveToObject(enemy, player.bottom, enemy.speed);
                enemy.rotation = Math.atan2(player.bottom.y - enemy.y, player.bottom.x - enemy.x); 
                game.physics.arcade.overlap(enemy, player.bottom, enemies.playerCollision);
            }
        });
        game.physics.arcade.collide(this.enemies, [room.walls, room.crates, room.wreckages, this.enemies, player.bottom]);
        //hack to ensure enemies does not get stuck on anything
        game.physics.arcade.collide([room.walls, room.crates, room.wreckages, this.enemies, player.bottom], this.enemies);
    }
    
    playerCollision(enemy, bottom)
    {
        //explode suicide enemies on contact with player
        if(enemy.type == 'suicide')
        {
            room.spawnExplosion(enemy.x, enemy.y);
            player.hp -= enemy.hp;
            enemy.kill();
        }
    }
    
    aim_all()
    {
        this.enemies.forEachAlive(function(enemy) {
            if(enemy.canFire)
            {
                enemy.gun.rotation = game.physics.arcade.angleBetween(enemy.gun, player.bottom, true) - enemy.rotation;
            }
        });
    }
    
    fire_all()
    {
        this.enemies.forEachAlive(function(enemy) {
            if(enemy.canFire)
            {
                enemy.weapon1.fire();
                enemy.weapon2.fire();
                game.physics.arcade.overlap(enemy.weapon1.bullets, room.crates, enemies.bulletHitTarget);
                game.physics.arcade.overlap(enemy.weapon1.bullets, room.wreckages, enemies.bulletHitTarget);
                game.physics.arcade.overlap(enemy.weapon1.bullets, room.walls, enemies.projectileHitWall);
                game.physics.arcade.overlap(enemy.weapon1.bullets, player.bottom, enemies.bulletHitPlayer);
                
                game.physics.arcade.overlap(enemy.weapon2.bullets, room.crates, enemies.bulletHitTarget);
                game.physics.arcade.overlap(enemy.weapon2.bullets, room.wreckages, enemies.bulletHitTarget);
                game.physics.arcade.overlap(enemy.weapon2.bullets, room.walls, enemies.projectileHitWall);
                game.physics.arcade.overlap(enemy.weapon2.bullets, player.bottom, enemies.bulletHitPlayer);
            }
        });
    }
    
    check_deaths()
    {
        this.enemies.forEach(function(enemy) {
            if((enemy.hp <= 0) && (enemy.hp != null))
            {
                for(let i = 1; i < (5 + Math.random() * 6); i++)
                {
                    room.spawnPickup(enemy.x, enemy.y);
                }
                room.spawnExplosion(enemy.x, enemy.y);
                enemy.hp = null;
                enemy.kill();
            }
        });
    }
    
    projectileHitWall(projectile, wall)
    {
        room.spawnDecal(projectile.x, projectile.y, projectile.rotation);
        projectile.kill();
    }
    
    bulletHitTarget(bullet, target)
    {
        room.spawnDecal(bullet.x, bullet.y, bullet.rotation);
        target.hp--;
        bullet.kill();
    }
    
    bulletHitPlayer(bottom, bullet)
    {
        room.spawnDecal(bullet.x, bullet.y, bullet.rotation);
        player.hp--;
        bullet.kill();
    }
    
    update()
    {
        this.move_all();
        this.aim_all();
        this.fire_all();
        this.check_deaths();
    }
    
    spawn_suicide()
    {
        let enemy_sprite = 'enemy_suicide';
        
        //place within walls
        let x = game.cache.getImage('room_wall').width * 2 + Math.random() * (game.world.width - game.cache.getImage(enemy_sprite).width - game.cache.getImage('room_wall').width * 3);
        let y = game.cache.getImage('room_wall').height * 2 + Math.random() * (game.world.height - game.cache.getImage(enemy_sprite).height - game.cache.getImage('room_wall').height * 3);
        
        let enemy = this.enemies.getFirstExists(false,true, x, y, enemy_sprite);
        
        var radius = enemy.width / 2;

        enemy.body.setCircle(
            radius,
            (-radius + 0.5 * enemy.width / enemy.scale.x),
            (-radius + 0.5 * enemy.height / enemy.scale.y)
        );
      
        enemy.anchor.setTo(0.5, 0.5);
        enemy.type = 'suicide';
        enemy.speed = 50;
        enemy.hp = 50;
        enemy.isMobile = true;
        enemy.canFire = false;
    }
    
    spawn_turret_gun()
    {
        let enemy_sprite = 'enemy_turret_base';
        
        //place within walls
        let x = game.cache.getImage('room_wall').width * 2 + Math.random() * (game.world.width - game.cache.getImage(enemy_sprite).width - game.cache.getImage('room_wall').width * 3);
        let y = game.cache.getImage('room_wall').height * 2 + Math.random() * (game.world.height - game.cache.getImage(enemy_sprite).height - game.cache.getImage('room_wall').height * 3);
        
        let enemy = this.enemies.getFirstExists(false,true, x, y, enemy_sprite);
        enemy.body.setSize(enemy.width, enemy.height);
        enemy.anchor.setTo(0.5, 0.5);
        
        if(enemy.gun == null)
        {
            enemy.gun = enemy.addChild(game.add.sprite(0, 0, 'enemy_turret_gun'));
            enemy.gun.anchor.setTo(0.5, 0.5);
        }
        
        enemy.weapon1 = game.add.weapon(40, 'player_bullet');
        enemy.weapon1.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        enemy.weapon1.bulletSpeed = 700;
        enemy.weapon1.fireRate = 2000;
        enemy.weapon1.trackSprite(enemy.gun, 20, -5, true);
        
        enemy.weapon2 = game.add.weapon(40, 'player_bullet');
        enemy.weapon2.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        enemy.weapon2.bulletSpeed = 700;
        enemy.weapon2.fireRate = 2000;
        enemy.weapon2.trackSprite(enemy.gun, 20, 5, true);
        
        enemy.type = 'turret_gun';
        enemy.hp = 100;
        enemy.isMobile = false;
        enemy.canFire = true;
        enemy.body.immovable = true;
    }
}