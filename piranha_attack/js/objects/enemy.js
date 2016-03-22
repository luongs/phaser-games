// object for player creation
var ENEMY = {
  ANCHOR: 0.5,
  Y_GRAVITY: 500
};

// game is a global variable set in game.js
var game = game;

var Enemy = function(x,y,img){
  this.x = x;
  this.y = y;
  this.img = img;
};

Enemy.prototype.setupEnemy = function(){
  var enemy = this.createSprite();
  this.enablePhysics(enemy);
  this.setAnchor(enemy);
  return enemy;
};

Enemy.prototype.createSprite = function(){
  return game.add.sprite(this.x, this.y, this.img);
};

Enemy.prototype.enablePhysics = function(enemy){
  game.physics.arcade.enable(enemy);
  player.body.gravity.y = ENEMY.Y_GRAVITY;
};

Enemy.prototype.setAnchor = function(enemy){
  enemy.anchor.setTo(ENEMY.ANCHOR, ENEMY.ANCHOR);
};

Enemy.prototype.setXVelocity = function(enemy, velocity){
  enemy.body.velocity.x = velocity;
};
