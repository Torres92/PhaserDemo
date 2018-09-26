
Player = function(player, assetName, x) {
	//Phaser.Sprite.call(this, game, x, y, assetName);
/*
	this.inputEnabled = true;
	this.input.pixelPerfectClick = true;
	this.events.onInputDown.add( function(){
			this.kill();
			GamePlayManager.hitNinja(this.id, this.x, this.y, this.scale.x, this.angle);
		}, this	);
*/

	

/*	this.id = id;
	this.x = x;
	//this.y = y;
	this.x1 = x1;
	this.y1 = y1;
	this.defaultScale = scale;

	this.scale.setTo(scale);
	this.anchor.setTo(0.5,1);
	this.kill();*/

}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
/*
player.prototype.shoot = function(){
	if(!launched){
    launched = true;
    // Enforce a short delay between shots by recording
    // the time that each bullet is shot and testing if
    // the amount of time since the last shot is more than
    // the required delay.
    if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
    if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
    this.lastBulletShotAt = this.game.time.now;

    // Get a dead bullet from the pool
    var bullet = this.bulletPool.getFirstDead();

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
    }
};

player.prototype.movement = function(){
	
};	*/