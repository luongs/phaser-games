// object for player creation
var PLAYER = {
  ANCHOR: 0.5
};

// game is a global variable set in game.js
var game = game;

var Player = function(x,y,img){
  this.x = x;
  this.y = y;
  this.img = img;
};

Player.prototype.setupPlayer = function(){
  var player = this.createSprite();
  this.enablePhysics(player);
  this.setAnchor(player);
  return player;
};

Player.prototype.createSprite = function(){
  return game.add.sprite(this.x, this.y, this.img);
};

Player.prototype.enablePhysics = function(player){
  game.physics.arcade.enable(player);
  player.body.gravity.y = 200;
};

Player.prototype.setAnchor = function(player){
  player.anchor.setTo(PLAYER.ANCHOR, PLAYER.ANCHOR);
};
