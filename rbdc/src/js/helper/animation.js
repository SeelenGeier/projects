let loadedAnimations = [];

function addCharacterAnimations(unit) {
    if(loadedAnimations.includes('character')) {
        return true;
    }
    if(unit == 'character') {
        game.anims.create({
            key: 'characterRun',
            frames: game.anims.generateFrameNumbers('character', { start: 8, end: 13 }),
            frameRate: 8,
            repeat: -1
        });
        game.anims.create({
            key: 'characterIdleWithSword',
            frames: game.anims.generateFrameNumbers('character', { start: 38, end: 41 }),
            frameRate: 6,
            repeat: -1
        });
        game.anims.create({
            key: 'characterIdleNoSword',
            frames: game.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        game.anims.create({
            key: 'characterDrawSword',
            frames: game.anims.generateFrameNumbers('character', { start: 69, end: 72 }),
            frameRate: 6
        });
        game.anims.create({
            key: 'characterSheatheSword',
            frames: game.anims.generateFrameNumbers('character', { start: 73, end: 76 }),
            frameRate: 6
        });
        // game.anims.create({
        //     key: 'characterAttack',
        //     frames: game.anims.generateFrameNumbers('character', { start: 55, end: 58 }),
        //     frameRate: 8,
        //     repeat: -1
        // });
        loadedAnimations.push('character');
        return true;
    }
}
