
var MAIN = {
  P_IMG : 'player',
  LAND_IMG : 'platform',
  ENEMY_IMG: 'player',
  ENEMY_VELOCITY: 150,
  Y_GRAVITY: -450,
  DOUBLE_SCALE: 2,
};

var game = game;

MAIN.createHelper = {
  addKeyboard: function(){
    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    return spaceKey;
  },

  createLand: function(platforms){
    var item = null;
    var startLand = new Structure(-90, game.world.height-150, MAIN.LAND_IMG,
                                  platforms);
    item = startLand.createStructure();
    startLand.changeScale(item, 1 , 5);

    var stopPoint = new Structure(400, game.world.height-25, MAIN.LAND_IMG,
                                  platforms);
    item = stopPoint.createStructure();
    stopPoint.changeScale(item,1,1);

    var endLand = new Structure(game.world.width-300, game.world.height-150,
                            MAIN.LAND_IMG, platforms);
    item = endLand.createStructure();
    endLand.changeScale(item, 1, 5);
  },

  createPlayer: function(){
    var player = new Player(game.world.width/2, game.world.height-50, 
                            MAIN.P_IMG);
    player = player.setupPlayer();
    console.log(player);
    return player;
  },

  createEnemy: function(){
    var item = null;
    var enemy = new Enemy(0, game.world.height-180, MAIN.ENEMY_IMG);
    item = enemy.setupEnemy();
    enemy.setXVelocity(item, MAIN.ENEMY_VELOCITY);
    return item;
  },
};

MAIN.updateHelper = {
  detectSurface: function(player, enemy, platforms){
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(enemy, platforms);
  },

  detectEnemy: function(player, enemy){
    return game.physics.arcade.collide(player, enemy);
  },

  destroyEnemy: function(enemy){
    enemy.body = null;
    enemy.destroy();
  },

  spawnEnemy: function(){
    // Set random timer 
    return MAIN.createHelper.createEnemy();    
  },
  
  // TODO
  updatePoints: function(){

  },

  detectJump: function(player, spaceKey){
    // Jump when sprite is stationary
    if (spaceKey.isDown && player.body.velocity.y === 0){
      if (player.alive === false){
        return;
      }
      player.body.velocity.y = MAIN.Y_GRAVITY;
    }
  },
};

var mainState = {
  create:function() {
    MAIN.spaceKey = MAIN.createHelper.addKeyboard();    
    MAIN.platforms = LEVEL.createGroup();
    MAIN.createHelper.createLand(MAIN.platforms);
    MAIN.player = MAIN.createHelper.createPlayer();
    MAIN.enemy = MAIN.createHelper.createEnemy();
  }, 

  update:function() {
    MAIN.updateHelper.detectSurface(MAIN.player, MAIN.enemy, MAIN.platforms);
    if (MAIN.updateHelper.detectEnemy(MAIN.player, MAIN.enemy)){
      MAIN.updateHelper.destroyEnemy(MAIN.enemy);
      MAIN.updateHelper.updatePoints();
      MAIN.enemy = MAIN.updateHelper.spawnEnemy();
    }
    MAIN.updateHelper.detectJump(MAIN.player, MAIN.spaceKey);
  }
};
