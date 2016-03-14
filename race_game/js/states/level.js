// level includes walls and obstacles
var LEVEL = {
  
};

// game variable set in game.js
var game = game;

// groups are used by Phaser to aggregate common elements like obtacles
LEVEL.createPlatformGroup = function(){
  var platform = game.add.group();
  platform.enableBody = true;
  return platform;
};

var Wall = function(x, y, img, group){
  this.x = x;
  this.y = y;
  this.img = img;
  this.group = group;
};

Wall.prototype.createWall = function(){
  var wall = this.group.create(this.x, this.y, this.graphic);
  wall.body.immovable = true;
  return wall;
};

Wall.prototype.changeScale = function(wall, x_scale, y_scale){
  wall.changeScale(wall, x_scale, y_scale);
};
