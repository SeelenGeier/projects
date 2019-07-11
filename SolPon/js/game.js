
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//define global variables
var rail;
var paddle;
var ball;
var paddleCollisionGroup;
var ballCollisionGroup;
var hits;
var highscore;

function preload() {
    //load paddle asset
    game.load.image('paddle', 'assets/paddle_w.png');
    
    //load ball asset
    game.load.image('ball', 'assets/ball_w.png');
    
    //load ring of rails (rail) asset
    game.load.image('rail', 'assets/rail_w.png');
}

function create() {
    //set background color to white
    game.stage.backgroundColor = "#aaaaaa";
    
    //spawn rail in fixed position
    rail = game.add.sprite(200, 100, 'rail');
    rail.tint = 0x000000;
    
    //spawn paddle on random position on rail
    paddle = game.add.sprite(game.width/2, game.height/2, 'paddle');
    paddle.anchor.setTo(0.5, 0.5);
    paddle.tint = 0x00ff00;
    
    //spawn ball in center of rail
    ball = game.add.sprite(game.width/2, game.height/2, 'ball');
	ball.anchor.setTo(0.5, 0.5);
    ball.tint = 0xff0000;
    ball.released = false;
    
    //activate P2 physics and configure to bounce objects
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.applyDamping = false;
    game.physics.p2.restitution = 1;
    game.physics.p2.friction = 0;
    game.physics.p2.setImpactEvents(true);
    
    //enable p2 physics for paddle and ball
    game.physics.p2.enable([ paddle, ball ]);
    ball.body.setCircle(ball.width/2);
    
    //make paddle unaffected by collisions
    paddle.body.static = true;
    
    //enable ball to collide with paddle
    paddleCollisionGroup = game.physics.p2.createCollisionGroup();
    ballCollisionGroup = game.physics.p2.createCollisionGroup();
    
    paddle.body.setCollisionGroup(paddleCollisionGroup);
    ball.body.setCollisionGroup(ballCollisionGroup);
    
    ball.body.collides(paddleCollisionGroup, paddleHit);
    paddle.body.collides(ballCollisionGroup);
    
    //add callback to restart game if ball is out of bounds
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(restartGame, this);
    
    //add hit counter and highscore
    hits = 0;
    highscore = getCookie('highscore');
    textHighscore = game.add.text(64,32, "Highscore:" + highscore, { font: "16px Arial", fill: "#000000" });
    textHits = game.add.text(64,64, "Hits:" + hits, { font: "16px Arial", fill: "#000000" });
}

function update() {
    //set position of paddle according to mouse position but always on rail
    var centerTargetAngle = game.math.angleBetween(game.width/2, game.height/2, game.input.activePointer.x, game.input.activePointer.y);
    paddle.body.x = game.width/2 + Math.cos(centerTargetAngle) * 192;
    paddle.body.y = game.height/2 + Math.sin(centerTargetAngle) * 192;
    
    //paddle always faces center of rail
    paddle.rotation = game.math.angleBetween(paddle.x, paddle.y, game.width/2, game.height/2);
    paddle.body.rotation = paddle.rotation;
    
    //if ball is not released yet and user clicks
    if(ball.released == false && game.input.activePointer.isDown)
    {
        //launch ball in random direction
        ball.body.applyImpulse([8, 8], game.width/2, game.height/2);
        ball.released = true;
    }
}

function paddleHit(ballBody, paddleBody) {
    //change speed of ball after collision
    ballBody.velocity.x = ballBody.velocity.x * (1 + 0.002*hits);
    ballBody.velocity.y = ballBody.velocity.y * (1 + 0.002*hits);
    
    //add a hit to the hit counter
    hits++;
    textHits.setText("Hits:" + hits);
}

function restartGame() {
    //set highscore if current hits are higher
    if(hits > highscore){
        highscore = hits;
        textHighscore.setText("Highscore:" + highscore);
        document.cookie = "highscore="+highscore;
    }
    
    //reset hits
    hits = 0;
    textHits.setText("Hits:" + hits);
    
    //stop ball
    ball.body.setZeroVelocity();
    
    //center ball
    ball.body.x = game.width/2;
    ball.body.y = game.height/2;
    
    //lock ball again
    ball.released = false;
}

function getCookie(cname) {
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