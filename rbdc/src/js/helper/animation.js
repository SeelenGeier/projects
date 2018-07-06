function addCharacterAnimations() {
    game.anims.create({
        key: 'characterIdle',
        frames: game.anims.generateFrameNumbers('character', { start: 38, end: 41 }),
        frameRate: 8,
        repeat: -1
    });
    game.anims.create({
        key: 'characterRun',
        frames: game.anims.generateFrameNumbers('character', { start: 8, end: 13 }),
        frameRate: 8,
        repeat: -1
    });
    game.anims.create({
        key: 'characterAttack',
        frames: game.anims.generateFrameNumbers('character', { start: 55, end: 58 }),
        frameRate: 8,
        repeat: -1
    });
}
