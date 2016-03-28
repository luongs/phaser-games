var game = game;

var MAIN = {
  P_IMG : 'player',
  LAND_IMG : 'platform',
  ENEMY_IMG: 'player',
  ENEMY_X: 0,
  ENEMY_Y: 600-175, // 600 is screen height
  ENEMY_VELOCITY: 150
};

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
    var enemy = new Enemy(MAIN.ENEMY_X, MAIN.ENEMY_Y, MAIN.ENEMY_IMG);
    item = enemy.setupEnemy();
    enemy.setXVelocity(item, MAIN.ENEMY_VELOCITY);
    return item;
  },

  // Definitely a hack to update the enemy global instance
  // and also change the respawn value
  // TODO: figure out how to get return parameters from a callback
  // function
  // TODO: figure out what to do with global respawn variable
  createTimerEnemy: function(){
    MAIN.enemy = MAIN.createHelper.createEnemy();
    MAIN.respawn = false;
  },
};

MAIN.ENEMY_MIN_T = 500;
MAIN.ENEMY_MAX_T= 2000;
MAIN.Y_GRAVITY= -450;

MAIN.updateHelper = {
  detectSurface: function(player, enemy, platforms){
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(enemy, platforms);
  },

  detectEnemy: function(player, enemy){
    return game.physics.arcade.overlap(player,enemy);
  },

  enemyIsOutOfBounds: function(enemy){
    return enemy.inWorld === false;
  },

  destroyEnemy: function(enemy){
    enemy.body = null;
    enemy.destroy();
  },

  spawnEnemy: function(){
    // Spawn enemy at random time between .5 and 2 seconds
    var randTime = Math.random() *(MAIN.ENEMY_MAX_T-MAIN.ENEMY_MIN_T)+
                  MAIN.ENEMY_MIN_T;
    window.setTimeout(MAIN.createHelper.createTimerEnemy, randTime);
  },

  //TODO: Make enemy stop at edge and jump at random time to the other side

  enemyStopAndJump: function(enemy){
    if (enemy.x > 300 && enemy.x < 485 && enemy.alive &&
        (enemy.body.velocity.y <= 0 && enemy.body.velocity.y > -1)){
      enemy.body.velocity.x = 110;
      enemy.body.velocity.y = -250;
      //TODO Spawn only one enemy if it crosses the other side
      console.log("x: "+enemy.body.velocity.y);
    }
  },

  // TODO
  updatePoints: function(){

  },

  detectJump: function(player, spaceKey){
    // Jump when sprite is stationary or at the apex of a jump
    if (spaceKey.isDown &&
        (player.body.velocity.y <= 0 && player.body.velocity.y > -30)){
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
    MAIN.respawn = false; // check if enemy should be respawned
  },

  update:function() {
    MAIN.updateHelper.detectSurface(MAIN.player, MAIN.enemy, MAIN.platforms);
    MAIN.updateHelper.enemyStopAndJump(MAIN.enemy);

    if (MAIN.updateHelper.detectEnemy(MAIN.player, MAIN.enemy)){
      MAIN.updateHelper.destroyEnemy(MAIN.enemy);
      MAIN.updateHelper.updatePoints();
      MAIN.updateHelper.spawnEnemy();
      MAIN.respawn = true;
    }

    // respawn is set to false after initial call or after a new
    // enemy is spawned
    if (MAIN.respawn === false &&
        MAIN.updateHelper.enemyIsOutOfBounds(MAIN.enemy)){

      console.log("Game Over");
      // Return to main menu for now
      game.state.start('menu');
    }

    MAIN.updateHelper.detectJump(MAIN.player, MAIN.spaceKey);
  }
};
