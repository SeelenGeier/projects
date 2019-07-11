
class Player {
    constructor()
    {
        this.tracks = game.add.group();
        
        this.bottom = game.add.sprite(200, 150, 'player_bottom');
        this.bottom.anchor.setTo(0.5, 0.5);
        
        this.top = this.bottom.addChild(game.make.sprite(0, 0, 'player_top'));
        this.top.anchor.setTo(0.5, 0.5);
        
        game.physics.arcade.enable(this.bottom);
        this.bottom.checkWorldBounds = true;
        this.bottom.events.onOutOfBounds.add(this.moveToOpposite, this);
        
        this.bottom.body.setCircle(
            (this.bottom.width / 2),
            (-(this.bottom.width / 2) + 0.5 * this.bottom.width),
            (-(this.bottom.width / 2) + 0.5 * this.bottom.height)
        );
        
        //add weapons and bullets to enable firing
        this.weapon1 = game.add.weapon(40, 'player_bullet');
        this.weapon1.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon1.bulletSpeed = 700;
        this.weapon1.fireRate = 30;
        this.weapon1.bulletAngleVariance = 5;
        this.weapon1.trackSprite(this.top, 28, 15, true);
        this.weapon1.onFire.add(function(){player.gunAmmo--;});
        
        this.weapon2 = game.add.weapon(5, 'player_missile');
        this.weapon2.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon2.bulletSpeed = 1000;
        this.weapon2.fireRate = 1000;
        this.weapon2.trackSprite(this.top, 24, -16, true);
        this.weapon2.onFire.add(function(){player.missileAmmo--;});
        
        this.speed = 200;
        this.hp = 200;
        this.maxHealth = 200;
        this.scrap = 0;
        this.repairCost = 20;
        this.upgradeGunCost = 50;
        this.upgradeMissileCost = 100;
        this.missileAmmo = 20;
        this.gunAmmo = 3000;
        
        //set random starting rotation
        this.previousRotation = Math.PI - (Math.random()*Math.PI*2);
    }
    
    move()
    {
        this.bottom.body.velocity.x = 0;
        this.bottom.body.velocity.y = 0;
        this.directionX = 0;
        this.directionY = 0;
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.A))
        {
            this.bottom.body.velocity.x = -1000;
            this.directionX = -1;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.D))
        {
            this.bottom.body.velocity.x = 1000;
            this.directionX = 1;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.W))
        {
            this.bottom.body.velocity.y = -1000;
            this.directionY = -1;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.S))
        {
            this.bottom.body.velocity.y = 1000;
            this.directionY = 1;
        }
        
        if((this.directionX == 0) && (this.directionY == 0))
        {
            this.bottom.rotation = this.previousRotation;
        }else{
            this.bottom.rotation = Math.atan2(this.directionY, this.directionX);
            this.previousRotation = this.bottom.rotation;
        }
        
        //reduce speed when moving diagonal
        let pythagoras = ((this.bottom.body.velocity.x * this.bottom.body.velocity.x) + (this.bottom.body.velocity.y * this.bottom.body.velocity.y));
        if (pythagoras > (this.speed * this.speed))
        {
            let multiplier = this.speed / Math.sqrt(pythagoras);
            this.bottom.body.velocity.x *= multiplier;
            this.bottom.body.velocity.y *= multiplier;
        }
        
        //make player collide with walls and obstacles
        game.physics.arcade.collide(this.bottom, [room.walls, room.crates, room.wreckages]);
        //hack to ensure player does not get stuck on anything
        game.physics.arcade.collide([room.walls, room.crates, room.wreckages], this.bottom);
    }
    
    aim()
    {
        //aim turret at cursor
        this.top.rotation = game.physics.arcade.angleToPointer(this.top, game.input.activePointer, true) - this.bottom.rotation;
    }

    fire()
    {
        if (game.input.activePointer.leftButton.isDown)
        {
            if(this.gunAmmo > 0)
            {
                //hack: temporarily remove bottom rotation from top rotation to prevent firing angle to be off
                this.top.rotation += this.bottom.rotation;
                this.weapon1.fire();
                this.top.rotation -= this.bottom.rotation;
            }
        }
        if (game.input.activePointer.rightButton.isDown)
        {
            if(this.missileAmmo > 0)
            {
                //hack: temporarily remove bottom rotation from top rotation to prevent firing angle to be off
                this.top.rotation += this.bottom.rotation;
                this.weapon2.fire();
                this.top.rotation -= this.bottom.rotation;
            }
        }
        
        //handle bullet collision that hit any walls or obstacles
        game.physics.arcade.overlap(this.weapon1.bullets, [room.crates, room.wreckages, enemies.enemies], this.bulletHitTarget);
        game.physics.arcade.overlap(this.weapon1.bullets, room.walls, this.bulletHitWall);
        
        game.physics.arcade.overlap(this.weapon2.bullets, [room.crates, room.wreckages, enemies.enemies], this.missileHitTarget);
        game.physics.arcade.overlap(this.weapon2.bullets, room.walls, this.missileHitWall);
    }
    
    update()
    {
        this.move();
        this.aim();
        this.fire();
        this.draw_tracks();
        this.checkHealth();
    }
    
    bulletHitWall(bullet, wall)
    {
        room.spawnDecal(bullet.x, bullet.y, bullet.rotation);
        bullet.kill();
    }
    
    bulletHitTarget(bullet, target)
    {
        room.spawnDecal(bullet.x, bullet.y, bullet.rotation);
        target.hp--;
        bullet.kill();
    }
    
    missileHitTarget(missile, target)
    {
        room.spawnExplosionMissile(missile.x, missile.y, missile.rotation);
        target.hp -= 1000;
        missile.kill();
    }
    
    missileHitWall(missile, wall)
    {
        room.spawnExplosionMissile(missile.x, missile.y, missile.rotation);
        missile.kill();
    }
    
    clear_projectiles()
    {
        this.weapon1.bullets.killAll();
        this.weapon2.bullets.killAll();
    }
    
    moveToOpposite()
    {
        //move player to opposite site of the room to indicate moving into a new room
        if(this.bottom.x > game.world.width)
        {
            this.bottom.x -= game.world.width;
        }
        if(this.bottom.x < 0)
        {
            this.bottom.x += game.world.width;
        }
        if(this.bottom.y > game.world.height)
        {
            this.bottom.y -= game.world.height;
        }
        if(this.bottom.y < 0)
        {
            this.bottom.y += game.world.height;
        }
        
        //restart room
        room.restart();
    }
    
    draw_tracks()
    {
        if((this.tracks.getFirstExists(true) == null) || (game.physics.arcade.distanceBetween(this.bottom, this.lastTrack) > game.cache.getImage('player_tracks').width-3))
        {
            this.lastTrack = this.tracks.getFirstExists(false,true, this.bottom.x, this.bottom.y, 'player_tracks');
            this.lastTrack.anchor.setTo(0.5, 0.5);
            this.lastTrack.rotation = this.bottom.rotation;
        }
    }
    
    clear_tracks()
    {
        this.tracks.killAll();
        this.lastTrack = null;
    }
    
    checkHealth()
    {
        if(this.missileAmmo <= 0 && this.gunAmmo <= 0)
        {
            this.hp = 0;
        }
        if(this.hp <= 0)
        {
            if(this.bottom.alive)
            {
                this.bottom.kill();
                room.spawnExplosion(this.bottom.x, this.bottom.y);
            }
        }
    }
    
    repair()
    {
        if(this.scrap > this.repairCost)
        {
            this.hp += 20;
            if(this.hp > this.maxHealth)
            {
                this.hp = this.maxHealth;
            }
            this.scrap -= this.repairCost;
            this.repairCost += 5;
            textRepair.setText('Repair up to 20 health for ' + this.repairCost + ' scrap');
        }
    }
    
    
    upgradeGun()
    {
        if(this.scrap > this.upgradeGunCost)
        {
            this.gunAmmo += 1000;
            this.scrap -= this.upgradeGunCost;
            this.upgradeGunCost += 5;
            textUpgradeGun.setText('Get 1000 bullets for ' + this.upgradeGunCost + ' scrap');
        }
    }
    
    upgradeMissile()
    {
        if(this.scrap > this.upgradeMissileCost)
        {
            this.missileAmmo += 10;
            this.scrap -= this.upgradeMissileCost;
            this.upgradeMissileCost += 10;
            textUpgradeMissile.setText('Get 10 missiles for ' + this.upgradeMissileCost + ' scrap');
        }
    }
}