// This example uses the Phaser 2.2.2 framework

// Copyright © 2014 John Watson
// Licensed under the terms of the MIT License
var currentSpeed = 0;
var cursors;
var launched = false;
var GameState = function(game) {
};


GameState.prototype.init = function() {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally= true;
        this.game.scale.pageAlignVertically= true;


        this.cursors = game.input.keyboard.createCursorKeys();
      //  this.pressEnable = true;

    }


// Load images and sounds
GameState.prototype.preload = function() {
    this.game.load.image('bullet', 'assets/images/bullet.png');
    this.game.load.image('map','assets/images/dragon_bg.jpg');
    //this.game.load.image('tank', 'assets/images/tank1.png');
    this.game.load.spritesheet('mobile','assets/images/aduka.png',56.75,40,20);
    this.game.load.image('turret', 'assets/images/turret.png');
    this.game.load.image('ground', 'assets/images/ground.png');
    this.game.load.spritesheet('tank','assets/images/armor.png',36.95,40,20);
    this.game.load.spritesheet('explosion', 'assets/images/explosion.png', 128, 128);
    this.game.load.image('ship', 'assets/images/spaceShips_001.png');
};

// Setup the example
GameState.prototype.create = function() {
    game.world.setBounds(0, 0, 5000, this.game.height-26);
    this.map = game.add.tileSprite(0, 0, 5000, 640, 'map');
    // Set stage background color
    //this.game.stage.backgroundColor = 0x4488cc;

    this.currentPlayer = game.add.group();
    var self = this;
    this.socket = io();
    this.socket.on('currentPlayers', function (players) {
       Object.keys(players).forEach(function (id) {
         if (players[id].playerId === self.socket.id) {
           console.log('just connected');
           self.addPlayer(self, players[id]);
         }else {
           self.addOtherPlayers(self, players[id]);
           console.log('others just connected');
        }
       });
    });
    this.socket.on('newPlayer', function (playerInfo) {
        self.addOtherPlayers(self, playerInfo);
        console.log('others just connected');
    });
    this.socket.on('disconnect', function (playerId) {
      self.otherPlayers.forEach(function (otherPlayer) {
          if (playerId === otherPlayer.playerId) {
            otherPlayer.destroy();
          }
      });
    });
    this.socket.on('playerMoved', function (playerInfo) {
        self.otherPlayers.forEach(function (otherPlayer, turret) {
          if (playerInfo.playerId === otherPlayer.playerId) {
            otherPlayer.turret.rotation = playerInfo.tRotation;
            otherPlayer.position.set(playerInfo.x, playerInfo.y);
            otherPlayer.turret.position.set(playerInfo.tx,playerInfo.ty);
            if(playerInfo.rotation == 1){
                otherPlayer.scale.setTo(-1,1);
            }
            if(playerInfo.rotation == -1){
                otherPlayer.scale.setTo(1,1);
            }
          }
        });
    });
    this.socket.on('playerShooted', function (bulletInfo) {
      self.bulletJustShooted(self, bulletInfo);
      console.log('player just shooted');
    });

    // Define constants
    this.SHOT_DELAY = 300; // milliseconds (10 bullets/3 seconds)
    this.BULLET_SPEED = 500; // pixels/second
    this.NUMBER_OF_BULLETS = 20;
    this.GRAVITY = 300; // pixels/second/second

    this.otherPlayers = game.add.group();
   /* this.prepareLevel();
    

    game.camera.follow(tank, Phaser.Camera.FOLLOW_TOPDOWN);
    // Create an object representing our gun
    this.turret = this.game.add.sprite(tank.x+35, tank.y - 15, 'turret');

    // Set the pivot point to the center of the gun
    this.turret.anchor.setTo(0.5, 0.5);
*/
    // Create an object pool of bullets
  this.bulletPool = this.game.add.group();
    for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
        // Create each bullet and add it to the group.
        var bullet = this.game.add.sprite(0, 0, 'bullet');
        this.bulletPool.add(bullet);

        // Set its pivot point to the center of the bullet
        bullet.anchor.setTo(0.5, 0.5);

        // Enable physics on the bullet
        this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

        // Set its initial state to "dead".
        bullet.kill();
    }

    // Turn on gravity
  game.physics.arcade.gravity.y = this.GRAVITY;

    // Create some ground
    this.ground = this.game.add.group();
    for(var x = 0; x < 5000; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = false;
        groundBlock.body.allowGravity = false;
        this.ground.add(groundBlock);
    }
/*
    // Setup a canvas to draw the trajectory on the screen
    this.bitmap = this.game.add.bitmapData(5000, this.game.height);
    this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
    this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
    this.game.add.image(0, 0, this.bitmap);


*/
    // Create a group for explosions
    this.explosionGroup = this.game.add.group();

    // Simulate a pointer click/tap input at the center of the stage
    // when the example begins running.
   // this.game.input.activePointer.x = this.game.width/2;
   // this.game.input.activePointer.y = this.game.height/2 - 100;/*
/*
    //Getting back camera
    // this tween is to make the camera return to left side of world when done launching
    // so it is not used until then
        myTween = game.add.tween(bullet).to({x: this.turret.x}, 5000, Phaser.Easing.Linear.None);
       */
};


GameState.prototype.addPlayer = function(self, playerInfo) {  
  //self.ship = game.add.image(playerInfo.x, playerInfo.y, 'ship');
  self.ship = this.currentPlayer.create(playerInfo.x, playerInfo.y, 'tank');
  /*if (playerInfo.team === 'blue') {
    self.ship.setTint(0x0000ff);
  } else {
    self.ship.setTint(0xff0000);
  }*/
  this.idle = self.ship.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]);
  self.ship.animations.play('idle',16, true);
  self.ship.anchor.setTo(0.5, 0.5);
  game.physics.enable(self.ship, Phaser.Physics.ARCADE);
  self.ship.body.drag.set(0.2);
  if(playerInfo.team == 'blue') self.ship.scale.setTo(-1,1);
  if(playerInfo.team == 'red') self.ship.scale.setTo(1,1);
  self.ship.body.angularDrag.setTo = 100;
  self.ship.body.maxVelocity.setTo(400, 400);
  self.ship.body.collideWorldBounds = true;;
  game.camera.follow(self.ship, Phaser.Camera.FOLLOW_TOPDOWN);
  self.turret = this.game.add.sprite(self.ship.x+20, self.ship.y - 5, 'turret');
  this.currentPlayer.add(self.turret);
  self.turret.anchor.setTo(0.3, 0.5);
};

GameState.prototype.addOtherPlayers = function(self, playerInfo) {

  self.otherPlayer = this.otherPlayers.create(playerInfo.x, playerInfo.y, 'tank');
  this.idle = self.otherPlayer.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]);
  self.otherPlayer.animations.play('idle',16, true);
  self.otherPlayer.anchor.setTo(0.5, 0.5);
  game.physics.enable(self.otherPlayer, Phaser.Physics.ARCADE);
  self.otherPlayer.body.drag.set(0.2);
  if(playerInfo.team == 'blue') self.otherPlayer.scale.setTo(-1,1);
  if(playerInfo.team == 'red') self.otherPlayer.scale.setTo(1,1);
  self.otherPlayer.body.acceleration = 0;
  self.otherPlayer.body.maxVelocity.setTo(400, 400);
  self.otherPlayer.body.collideWorldBounds = true;
  self.otherPlayer.turret = this.game.add.sprite(playerInfo.x+20, playerInfo.y - 5, 'turret');
  this.otherPlayers.add(self.otherPlayer.turret);
  self.otherPlayer.turret.anchor.setTo(0.3, 0.5);
  //self.otherPlayers.add(otherPlayer);
  /*if (playerInfo.team === 'blue') {
    otherPlayer.setTint(0x0000ff);
  } else {
    otherPlayer.setTint(0xff0000);
  }*/
  self.otherPlayer.playerId = playerInfo.playerId;
}

GameState.prototype.bulletJustShooted = function(self, bulletInfo){
    
   

    // Get a dead bullet from the pool
   self.remoteBullet = this.bulletPool.getFirstDead();


    // If there aren't any bullets available then don't shoot
    if (self.remoteBullet === null || self.remoteBullet === undefined) return;

    // Revive the bullet
    // This makes the bullet "alive"
    self.remoteBullet.revive();

    // Bullets should kill themselves when they leave the world.
    // Phaser takes care of this for me by setting this flag
    // but you can do it yourself by killing the bullet if
    // its x,y coordinates are outside of the world.
    self.remoteBullet.checkWorldBounds = true;
    self.remoteBullet.outOfBoundsKill = true;

    // Set the bullet position to the gun position.
    self.remoteBullet.reset( self.otherPlayer.turret.x,  self.otherPlayer.turret.y);
    self.remoteBullet.rotation =  self.otherPlayer.turret.rotation;

    // Shoot it in the right direction
    self.remoteBullet.body.velocity.x = Math.cos(self.remoteBullet.rotation) * this.BULLET_SPEED;
    self.remoteBullet.body.velocity.y = Math.sin(self.remoteBullet.rotation) * this.BULLET_SPEED;

    game.camera.follow(self.remoteBullet, Phaser.Camera.FOLLOW_TOPDOWN);

    /*self.remoteBullet.x = bulletInfo.bullet.j;
    self.remoteBullet.y = bulletInfo.bullet.k;
    self.remoteBullet.rotation = bulletInfo.bullet.bRotation;*/
}
  
/*
GameState.prototype.prepareLevel = function(){
    var levelConfig = {
        "players": [
            {"player":"tank", "sprite":"tank", "x":537},
            {"player":"tank2", "sprite":"tank", "x":746},
            {"player":"tank3", "sprite":"tank", "x":314},
            {"player":"tank4", "sprite":"tank", "x":744}
        ]
    };
    for (var i = 0; i < levelConfig.players.length; i++) {       
            tank = new Player(levelConfig.players[i].player, levelConfig.players[i].sprite,
            levelConfig.players[i].x);
            tank = this.mobilesGroup.create(levelConfig.players[i].x, this.game.height - 60, levelConfig.players[i].sprite);
            this.idle = tank.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]);
            tank.animations.play('idle',16, true);
            tank.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(tank, Phaser.Physics.ARCADE);
            tank.body.drag.set(0.2);
            tank.body.maxVelocity.setTo(400, 400);
            tank.body.collideWorldBounds = true; } 
};*/

GameState.prototype.drawTrajectory = function() {
    if(!launched){
    // Clear the bitmap
    this.bitmap.context.clearRect(0, 0, 5000, this.game.height);

    // Set fill style to white
    this.bitmap.context.fillStyle = 'rgba(255, 255, 255, 0.5)';

    // Calculate a time offset. This offset is used to alter the starting
    // time of the draw loop so that the dots are offset a little bit each
    // frame. It gives the trajectory a "marching ants" style animation.
    var MARCH_SPEED = 40; // Smaller is faster
    this.timeOffset = this.timeOffset + 1 || 0;
    this.timeOffset = this.timeOffset % MARCH_SPEED;

    // Just a variable to make the trajectory match the actual track a little better.
    // The mismatch is probably due to rounding or the physics engine making approximations.
    var correctionFactor = 0.99;

    // Draw the trajectory
    // http://en.wikipedia.org/wiki/Trajectory_of_a_projectile#Angle_required_to_hit_coordinate_.28x.2Cy.29
    var theta = -this.turret.rotation;
    var x = 0, y = 0;
    for(var t = 0 + this.timeOffset/(1000*MARCH_SPEED/60); t < 3; t += 0.03) {
        x = this.BULLET_SPEED * t * Math.cos(theta) * correctionFactor;
        y = this.BULLET_SPEED * t * Math.sin(theta) * correctionFactor - 0.5 * this.GRAVITY * t * t;
        this.bitmap.context.fillRect(x + this.turret.x, this.turret.y - y, 3, 3);
        if (y < -15) break;
    }

    this.bitmap.dirty = true;}
    if(launched) {
    // Clear the bitmap
    this.bitmap.context.clearRect(0, 0, 5000, this.game.height);
        
    }
};


GameState.prototype.shootBullet = function(self) {
   //if(!launched){
    //launched = true;
    // Enforce a short delay between shots by recording
    // the time that each bullet is shot and testing if
    // the amount of time since the last shot is more than
    // the required delay.
    if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
    if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
    this.lastBulletShotAt = this.game.time.now;

    // Get a dead bullet from the pool
    bullet = this.bulletPool.getFirstDead();

    game.camera.follow(bullet, Phaser.Camera.FOLLOW_TOPDOWN);

    // If there aren't any bullets available then don't shoot
    if (bullet === null || bullet === undefined) return;

    // Revive the bullet
    // This makes the bullet "alive"
    bullet.revive();

    // Bullets should kill themselves when they leave the world.
    // Phaser takes care of this for me by setting this flag
    // but you can do it yourself by killing the bullet if
    // its x,y coordinates are outside of the world.
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;

    // Set the bullet position to the gun position.
    bullet.reset(this.turret.x, this.turret.y);
    bullet.rotation = this.turret.rotation;

    // Shoot it in the right direction
    bullet.body.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED;
    bullet.body.velocity.y = Math.sin(bullet.rotation) * this.BULLET_SPEED;
    this.socket.emit('playerShoots', { j: bullet.x, k: bullet.y, bRotation: bullet.rotation});
    //}
};

// The update() method is called every frame
GameState.prototype.update = function() {
    if (this.ship) {   
    if (this.cursors.left.isDown) {
      var direction = -1;
      this.ship.x -= 4;
      this.ship.scale.setTo(1,1);
      game.camera.follow(this.ship, Phaser.Camera.FOLLOW_TOPDOWN);  
    } else if (this.cursors.right.isDown) {
      var direction = 1;
      this.ship.x += 4;
      this.ship.scale.setTo(-1,1);
      game.camera.follow(this.ship, Phaser.Camera.FOLLOW_TOPDOWN);
      
    } else {
      this.ship.x += 0;
    }
  
   
    if (this.cursors.up.isDown) {
      this.turret.rotation -= 0.05;
      game.camera.follow(this.ship, Phaser.Camera.FOLLOW_TOPDOWN);  
      //this.turret.body.angularVelocity = -150;
      //this.physics.velocityFromRotation(this.ship.rotation + 1.5, 100, this.ship.body.acceleration);
    }else if (this.cursors.down.isDown) {
       this.turret.rotation += 0.05; 
       game.camera.follow(this.ship, Phaser.Camera.FOLLOW_TOPDOWN);
      //this.turret.body.angularVelocity = 150;
    } else {
       this.turret.rotation += 0;
      //this.turret.body.angularVelocity = 0;
    }

    // emit player movement
    var a = this.turret.rotation;
    var x = this.ship.x;
    var y = this.ship.y;
    var r = this.ship.rotation;
    if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation || a !== this.ship.oldPosition.tRotation)) {
      this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: direction, tRotation: this.turret.rotation, tx: this.turret.x, ty: this.turret.y  });
    }
    this.turret.y = this.ship.y - 5;
    if(direction == 1){    
    this.turret.x = this.ship.x - 20;
    }
    if(direction == -1 ){    
    this.turret.x = this.ship.x + 20;
    }
    // save old position data
    this.ship.oldPosition = {
      tRotation : this.turret.rotation,
      x: this.ship.x,
      y: this.ship.y,
      rotation: this.ship.rotation
    };
  }


    /*
     // Draw the trajectory every frame
    this.drawTrajectory();*/
    //this.BULLET_SPEED = game.physics.arcade.distanceToPointer(this.turret);
    // Check if bullets have collided with the ground
  this.game.physics.arcade.collide(this.bulletPool, this.ground, function(bullet, ground) {
        //if(launched){
        // Create an explosion
        this.getExplosion(bullet.x, bullet.y);
        //launched = false;
        game.camera.follow(this.ship, Phaser.Camera.FOLLOW_TOPDOWN); 

        // Kill the bullet
        bullet.kill();//}
    }, null, this);
    this.game.physics.arcade.collide(this.bulletPool, this.otherPlayer, function(bullet, otherPlayer) {
        //if(launched){
        // Create an explosion
        this.getExplosion(bullet.x, bullet.y);
        //launched = false;
        game.camera.follow(this.ship, Phaser.Camera.FOLLOW_TOPDOWN); 

        // Kill the bullet
        bullet.kill();//}
    }, null, this);
     this.game.physics.arcade.collide(this.bulletPool, this.ship, function(remotebullet, otherPlayer) {
        //if(launched){
        // Create an explosion
        this.getExplosion(remotebullet.x, remotebullet.y);
        //launched = false;
        game.camera.follow(this.otherPlayer, Phaser.Camera.FOLLOW_TOPDOWN); 

        // Kill the bullet
        remotebullet.kill();//}
    }, null, this);

    // Rotate all living bullets to match their trajectory
   this.bulletPool.forEachAlive(function(bullet) {
        bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
        if(this.remoteBullet){
            this.remoteBullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
        }
       /* console.log(bullet.x);
        var j = bullet.x;
    // test if bullet is shooted
       if (bullet.moving && j !== bullet.moving.j) {
          this.socket.emit('bulletMovement', { j: bullet.x, k: bullet.y, bRotation: bullet.rotation});
        }

        bullet.moving = {
            j: bullet.x,
        }*/
    }, this);





/*
    // Aim the gun at the pointer.
    // All this function does is calculate the angle using
    // Math.atan2(yPointer-yGun, xPointer-xGun)
    //this.turret.rotation = this.game.physics.arcade.angleToPointer(this.turret);
*/
    // Shoot a bullet
   if (this.game.input.activePointer.isDown && this.pressEnable) {
        this.pressEnable = false;
        this.shootBullet();
    }
    if (this.game.input.activePointer.isUp && !this.pressEnable) {
        this.pressEnable = true;
    }
      
/*

    if(this.cursors.left.isDown){
        
        //  The speed we'll travel at
        tank.x -= 4;     
    }
    if(this.cursors.right.isDown ){
       
        //  The speed we'll travel at
        tank.x += 4;
    }
  

        this.turret.x = tank.x + 35;
        this.turret.y = tank.y - 15;

*/     
};

// Try to get a used explosion from the explosionGroup.
// If an explosion isn't available, create a new one and add it to the group.
// Setup new explosions so that they animate and kill themselves when the
// animation is complete.
GameState.prototype.getExplosion = function(x, y) {
    // Get the first dead explosion from the explosionGroup
    var explosion = this.explosionGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (explosion === null) {
        explosion = this.game.add.sprite(0, 0, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);

        // Add an animation for the explosion that kills the sprite when the
        // animation is complete
        this.animation = explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22], 60, false);
        this.animation.killOnComplete = true;

        // Add the explosion sprite to the group
        this.explosionGroup.add(explosion);
    }

    // Revive the explosion (set it's alive property to true)
    // You can also define a onRevived event handler in your explosion objects
    // to do stuff when they are revived.
    explosion.revive();

    // Move the explosion to the given coordinates
    explosion.x = x;
    explosion.y = y;

    // Set rotation of the explosion at random for a little variety
    explosion.angle = this.game.rnd.integerInRange(0, 360);

    // Play the animation
    explosion.animations.play('boom');

    // Return the explosion itself in case we want to do anything else with it
    return explosion;
};

var game = new Phaser.Game(1136, 640, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);