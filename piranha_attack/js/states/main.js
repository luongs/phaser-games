var game = game;

var MAIN = {
  P_IMG : 'player',
  LAND_IMG : 'platform',
  ENEMY_IMG: 'player',
  ENEMY_X: 0,
  ENEMY_Y: 600-175, // 600 is screen height
  ENEMY_VELOCITY: 150,
  BIRD_X: 0,
  BIRD_Y: 600-300,
  BIRD_GRAVITY: 0,
  BIRD_VELOCITY: 100,
  BIRD_SPAWN_CTR: 500
};

MAIN.createHelper = {
  addKeyboard: function(){
    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    return spaceKey;
  },

  //TODO: Decrease screen dimensions
  // Create nicer landscape
  createLand: function(platforms){
    var item = null;
    var startLand = new Structure(-90, game.world.height-150, MAIN.LAND_IMG,
                                  platforms);
    item = startLand.createStructure();
    startLand.changeScale(item, 1 , 5);

    var stopPoint = new Structure(300, game.world.height-25, MAIN.LAND_IMG,
                                  platforms);
    item = stopPoint.createStructure();
    stopPoint.changeScale(item,1,1);

    var endLand = new Structure(game.world.width-300, game.world.height-150,
                            MAIN.LAND_IMG, platforms);
    item = endLand.createStructure();
    endLand.changeScale(item, 1, 5);
  },

  // TODO: Slow rate when player under water
  // Add actual sprites for player, enemy and bird
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

  createBird: function(){
    var item = null;
    var enemy = new Enemy(MAIN.BIRD_X, MAIN.BIRD_Y, MAIN.ENEMY_IMG);
    item = enemy.setupEnemy();
    enemy.setXVelocity(item, MAIN.BIRD_VELOCITY);
    enemy.setGravity(item, MAIN.BIRD_GRAVITY);
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

  // TODO: figure out how to return bird instead of changing
  // global variable here
  createTimerBird: function(){
    MAIN.bird = MAIN.createHelper.createBird();
  },

  createPointsText: function(points){
    var style = {font: '50px Arial', fill: '#ffffff'};
    var pointsText = game.add.text(game.world.width/2, 18, points, style);
    pointsText.text = points;
    return pointsText;
  }
};

MAIN.ENEMY_MIN_T = 500;
MAIN.ENEMY_MAX_T= 2000;
MAIN.ENEMY_Y_GRAVITY = -300;
MAIN.Y_GRAVITY= -400;

MAIN.updateHelper = {
  detectSurface: function(player, enemy, platforms){
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(enemy, platforms);
  },

  detectEnemy: function(player, enemy){
    return game.physics.arcade.overlap(player,enemy);
  },

  detectBird: function(player, bird){
    return game.physics.arcade.overlap(player,bird);
  },

  enemyIsOutOfBounds: function(enemy){
    return enemy.inWorld === false;
  },

  destroyEnemy: function(enemy){
    enemy.body = null;
    enemy.destroy();
  },

  destroyBird: function(bird){
    bird.body = null;
    bird.destroy();
  },



  spawnEnemy: function(){
    // Spawn enemy at random time between .5 and 2 seconds
    var randTime = Math.random() *(MAIN.ENEMY_MAX_T-MAIN.ENEMY_MIN_T)+
                  MAIN.ENEMY_MIN_T;
    window.setTimeout(MAIN.createHelper.createTimerEnemy, randTime);
  },

  incrementCtrAndSpawnBird: function(counter){
    if (counter === MAIN.BIRD_SPAWN_CTR){
      var randTime = Math.random() *(MAIN.ENEMY_MAX_T-MAIN.ENEMY_MIN_T)+
                     MAIN.ENEMY_MIN_T;
      window.setTimeout(MAIN.createHelper.createTimerBird, randTime);
      counter = 0;
      return counter;
    }
    else{
      return counter+1;
    }
  },

  getRandomNum: function(min, max){
    return Math.floor(Math.random()* (max-min+1)) + min;
  },

  enemyJump: function(enemy){
    if (enemy.alive){
      enemy.body.velocity.x = MAIN.ENEMY_VELOCITY;
    }
    // Makes enemy jump between 1 and 3 jumps
    var maxChk = MAIN.updateHelper.getRandomNum(350, 485);
    if (enemy.x > 300 && enemy.x < maxChk && enemy.alive &&
        (enemy.body.velocity.y <= 0 && enemy.body.velocity.y > -0.1)){
      enemy.body.velocity.y = MAIN.ENEMY_Y_GRAVITY;
    }
  },

  enemyStopAndJump: function(enemy){
    if (enemy.x > 295 && enemy.x < 300){
      enemy.body.velocity.x = 0;
      var randTime = Math.random() *(MAIN.ENEMY_MAX_T-MAIN.ENEMY_MIN_T)+
                    MAIN.ENEMY_MIN_T;
      window.setTimeout(this.enemyJump, randTime, enemy);
    }
  },

  updatePoints: function(points, pointsText){
    pointsText.text = points;
  },

  jump: function(player, spaceKey){
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
    MAIN.bird = MAIN.createHelper.createBird();
    MAIN.respawn = false; // check if enemy should be respawned
    MAIN.birdSpawnCtr = 0;  // prevent constant spawning of birds
    MAIN.points = 0;
    MAIN.pointsText = MAIN.createHelper.createPointsText(MAIN.points);
  },

  update:function() {
    MAIN.updateHelper.detectSurface(MAIN.player, MAIN.enemy, MAIN.platforms);
    MAIN.updateHelper.enemyStopAndJump(MAIN.enemy);

    if (MAIN.updateHelper.detectEnemy(MAIN.player, MAIN.enemy)){
      MAIN.updateHelper.destroyEnemy(MAIN.enemy);
      MAIN.updateHelper.spawnEnemy();
      MAIN.respawn = true;
      MAIN.points += 1;
      MAIN.updateHelper.updatePoints(MAIN.points, MAIN.pointsText);
    }

    MAIN.birdSpawnCtr = MAIN.updateHelper.incrementCtrAndSpawnBird(
                                               MAIN.birdSpawnCtr);
    if (MAIN.updateHelper.detectBird(MAIN.player, MAIN.bird)){
      MAIN.updateHelper.destroyBird(MAIN.bird);
      MAIN.points += 3;
      MAIN.updateHelper.updatePoints(MAIN.points, MAIN.pointsText);
    }

    // respawn is set to false after initial call or after a new
    // enemy is spawned
    if (MAIN.respawn === false &&
        MAIN.updateHelper.enemyIsOutOfBounds(MAIN.enemy)){
      console.log("Game Over");
      // Return to main menu for now
      game.state.start('menu');
    }

    MAIN.updateHelper.jump(MAIN.player, MAIN.spaceKey);
  }
};
