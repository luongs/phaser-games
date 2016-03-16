// main contains the game logic and sets up the world
var MAIN = {
  VELOCITY : 400,
  DOUBLE_SCALE : 2,
  SAME_SCALE : 1,
  THREE_QUARTER_SCALE : 0.75,
  LARGE_SCALE : 6,
  GROUND : 'ground',
  WALL : 'wall',
  FINISH : 'finish',
  P1_IMG : 'car1',
  P2_IMG : 'car2',
  ANCHOR : 0.5,
  LOOP_TIME: 1000,  // Time is calculated at every 1000ms => 1s
  TIMER_STR : 'Time: '
};

// game is a global variable set in game.js
var game = game;

MAIN.isMultiplayer = function(){
  if (game.device.localStorage){
      return localStorage.multiplayer === 'true';
    }
  return false;
};

MAIN.createHelper = {

  // Setup game obstacles and track
  createTrack: function(platforms){
    var item = null;
    var floor = new Structure(0, game.world.height-64, MAIN.GROUND, platforms);
    item = floor.createStructure();
    floor.changeScale(item, MAIN.DOUBLE_SCALE, MAIN.DOUBLE_SCALE);

    var ceiling = new Structure(0,0, MAIN.GROUND, platforms);
    item = ceiling.createStructure();
    ceiling.changeScale(item, MAIN.DOUBLE_SCALE, MAIN.SAME_SCALE);

    var wall = new Structure(0, 0, MAIN.WALL, platforms);
    item = wall.createStructure();
    wall.changeScale(item, MAIN.SAME_SCALE, MAIN.DOUBLE_SCALE);

    wall = new Structure(game.world.width-30, 0, MAIN.WALL, platforms);
    item = wall.createStructure();
    wall.changeScale(item, MAIN.SAME_SCALE, MAIN.DOUBLE_SCALE);

    var middleObstacle = new Structure(game.world.width/2-150,
                                       game.world.height/2-100,
                                       MAIN.GROUND, platforms);
    item = middleObstacle.createStructure();
    middleObstacle.changeScale(item, MAIN.THREE_QUARTER_SCALE,
                               MAIN.LARGE_SCALE);
  }, 

  createCheckpoints: function(checkpts){
    var checkpoint1 = new Structure(game.world.width/2, game.world.height/2,
                                    MAIN.GROUND, checkpts);
    item = checkpoint1.createStructure();
    checkpoint1.changeScale(item, MAIN.DOUBLE_SCALE, MAIN.THREE_QUARTER_SCALE);

    var checkpoint2 = new Structure(-(game.world.width/2), game.world.height/2, 
                                    MAIN.GROUND, checkpts);
    item = checkpoint2.createStructure();
    checkpoint2.changeScale(item, MAIN.DOUBLE_SCALE, 
                            MAIN.THREE_QUARTER_SCALE);
    var finishLine = new Structure(game.world.width/2-100, 
                                   game.world.height/2+75,
                                   MAIN.FINISH, checkpts);
    item = finishLine.createStructure();
    finishLine.changeScale(item, MAIN.THREE_QUARTER_SCALE, 0.5);
  },


  /* Function related to Sprites */
  // Create sprites and handles multiplayer option
  createPlayer: function(){

    var players = {};
    var player1 = new Player(game.world.width/2,
                             game.world.height-150, MAIN.P1_IMG);
    player1 = player1.setupPlayer();
    players.p1 = player1;

    if (MAIN.isMultiplayer()) {

      var player2 = new Player(game.world.width/2,
                               game.world.height-100, MAIN.P2_IMG);
      player2 = player2.setupPlayer();
      players.p2 = player2;
    }
    return players;
  },

  /* Functions related to scoring */
  createTimer: function(timerText){
    var startTime = game.time.now;
    game.time.events.loop(MAIN.LOOP_TIME, this.updateTime, this,
                          startTime, timerText);
    return startTime;
  },
  
  // Save seconds since game screen started
  updateTime: function(startTime, timerText){
    var seconds = Math.ceil(game.time.elapsedSecondsSince(startTime));
    timerText.text = MAIN.TIMER_STR.concat(seconds);
    // Set score global variable
    MAIN.score = seconds;
    return seconds;
  },

  // Display amount of time elapsed
  createTimerText: function(){
    var timerText = game.add.text(18,18,MAIN.TIMER_STR, 
                                  {fontSize:'20px', fill: "#ffffff" });
    return timerText;
  }, 

  // Setup keyboard to detect user input
  addKeyboard: function(){
    // cursor automatically sets arrow keys
    var cursor = game.input.keyboard.createCursorKeys();

    if (MAIN.isMultiplayer()){
      var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
      var aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
      var sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
      var dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

      // Set global vars for multiplayer keyboard
      MAIN.wKey = wKey;
      MAIN.aKey = aKey;
      MAIN.sKey = sKey;
      MAIN.dKey = dKey;
    }
  return cursor;
  }
};

MAIN.updateHelper = {

  // Stop player if no keys are pressed
  resetVelocity: function(players){
    players.p1.body.velocity.x = 0;
    players.p1.body.velocity.y = 0;
    players.p1.body.angularVelocity = 0;

    if (MAIN.isMultiplayer()){
      players.p2.body.velocity.x = 0;
      players.p2.body.velocity.y = 0;
      players.p2.body.angularVelocity = 0;
    }
  },

  // Stop player when colliding against walls
  detectCollision: function(players, platforms){
    game.physics.arcade.collide(players.p1, platforms);
    if (MAIN.isMultiplayer()){
      game.physics.arcade.collide(players.p2, platforms);
    }
  },

  // Detects if any player crossed a checkpoint
  detectCheckptOverlap: function(players, checkpoint){
    game.physics.arcade.overlap(players.p1, checkpoint,
                                this.handleCrossCheckpt, null, this);
    if (MAIN.isMultiplayer()){
      game.physics.arcade.overlap(players.p2, checkpoint,
                                  this.handleCrossCheckpt, null, this);
    }
  },
  
  // Check crossing order and removes checkpoint if order is followed 
  handleCrossCheckpt : function(player, checkpoint){
    var firstCheckptAlive = MAIN.checkpoints.getFirstAlive();
    var firstAliveIndex = MAIN.checkpoints.getIndex(firstCheckptAlive);
    var checkptIndex = MAIN.checkpoints.getIndex(checkpoint);
  
    if (firstAliveIndex === checkptIndex){
     checkpoint.kill();
    }
  },


  // Detects if player pressed keys for up or down movement
  // Also detects 2nd player movement if multiplayer option chosen
  detectHorMov: function(players, cursor){
    if (cursor.left.isDown){
      players.p1.body.angularVelocity = -MAIN.VELOCITY;
    }
    else if (cursor.right.isDown){
      players.p1.body.angularVelocity = MAIN.VELOCITY;
    }

    if (MAIN.isMultiplayer()){
      if (MAIN.aKey.isDown){
        players.p2.body.angularVelocity = -MAIN.VELOCITY;
      }
      else if (MAIN.dKey.isDown){
        players.p2.body.angularVelocity = MAIN.VELOCITY;
      }
    }
  },

  // Detects if player pressed keys for left or right movement
  // Also detects 2nd player movement if multiplayer option chosen
  detectVertMov: function(players, cursor){
    if (cursor.up.isDown){
      game.physics.arcade.velocityFromAngle(players.p1.angle,MAIN.VELOCITY,
                                            players.p1.body.velocity);
    }
    else if (cursor.down.isDown){
      game.physics.arcade.velocityFromAngle(players.p1.angle,
                                            -MAIN.VELOCITY,
                                            players.p1.body.velocity);
    }

    if (MAIN.isMultiplayer()){
      if (MAIN.wKey.isDown){
        game.physics.arcade.velocityFromAngle(players.p2.angle, 
                                              MAIN.VELOCITY,
                                              players.p2.body.velocity);
      }
      else if (MAIN.sKey.isDown){
        game.physics.arcade.velocityFromAngle(players.p2.angle, 
                                              -MAIN.VELOCITY,
                                              players.p2.body.velocity);
      }
    }
  }, 

  checkFinish: function(checkpoint){
    if (checkpoint.countLiving() === 0){
      console.log("You finished the race!");
      this.saveTime();
      // Go to win screen
      game.state.start('win');
    }
  },

  saveTime: function(){
    if (game.device.localStorage){
        localStorage.score = MAIN.score;
        // Update high score
        if (localStorage.highScore){
            if (parseInt(MAIN.score) < parseInt(localStorage.highScore)){
                localStorage.highScore = MAIN.score;
            }
        }
        else{
            localStorage.highScore = localStorage.score;
        }
    }
  }
};

// mainState left global for use in game.js
var mainState = {
    // create() sets up environment and is called when state entered 
    create:function() {
      // platform group used to aggregate common level/world elements
      MAIN.platforms = LEVEL.createGroup();
      MAIN.createHelper.createTrack(MAIN.platforms);
      MAIN.checkpoints = LEVEL.createGroup();
      MAIN.createHelper.createCheckpoints(MAIN.checkpoints);
      MAIN.players = MAIN.createHelper.createPlayer();
      MAIN.timerText = MAIN.createHelper.createTimerText();
      MAIN.createHelper.createTimer(MAIN.timerText);
      MAIN.cursor = MAIN.createHelper.addKeyboard();
    },

    // update() called on frame refresh
    update:function() {
      MAIN.updateHelper.resetVelocity(MAIN.players);
      MAIN.updateHelper.detectCollision(MAIN.players, MAIN.platforms);
      MAIN.updateHelper.detectVertMov(MAIN.players, MAIN.cursor);
      MAIN.updateHelper.detectHorMov(MAIN.players, MAIN.cursor);
      MAIN.updateHelper.detectCheckptOverlap(MAIN.players, MAIN.checkpoints);
      MAIN.updateHelper.checkFinish(MAIN.checkpoints);
    }
};

