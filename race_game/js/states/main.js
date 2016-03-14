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

  /* Functions related to world setup */
  // Setup game obstacles and track
  setupWorld: function(platforms){
    this.createBoundaries(platforms);
    this.createTrack((game.world.width/2)-150,
                      (game.world.height/2)-100,
                      MAIN.GROUND, platforms);
  }, 

  createBoundaries: function(platforms){
    this.createFloor(0, game.world.height-64, MAIN.GROUND, platforms); 
    this.createCeiling(0, 0, MAIN.GROUND, platforms);
    this.createWalls(0,0,MAIN.WALL, platforms);
    this.createWalls(game.world.width-30, 0, MAIN.WALL, platforms);
  }, 

  createFloor: function(x,y,graphic, platforms){
    var ground = platforms.create(x, y, graphic);
    ground.body.immovable = true;
    this.changeScale(ground, MAIN.DOUBLE_SCALE, MAIN.DOUBLE_SCALE);
    return ground;
  }, 

  createCeiling: function(x, y, graphic, platforms){
    var ceiling = platforms.create(x, y, graphic);
    ceiling.body.immovable = true;
    this.changeScale(ceiling, MAIN.DOUBLE_SCALE, MAIN.SAME_SCALE);
    return ceiling;
  },

  createWalls: function(x, y, graphic, platforms){
    var wall = platforms.create(x,y,graphic);
    wall.body.immovable = true;
    this.changeScale(wall, MAIN.SAME_SCALE, MAIN.DOUBLE_SCALE);
    return wall;
  },

  createTrack: function(x, y, graphic, platforms) {
    var middle = platforms.create(x, y, graphic);
    middle.body.immovable = true;
    this.changeScale(middle, MAIN.THREE_QUARTER_SCALE, MAIN.LARGE_SCALE);
    return middle;
  },

  // Changes dimension of item
  changeScale: function(item, x, y){
    item.scale.setTo(x,y);
  },

  createCheckpts: function(){
    this.createCheckptGroup();
    this.createCheckPt(game.world.width/2, game.world.height/2, MAIN.GROUND);
    this.createCheckPt(-(game.world.width/2), game.world.height/2, MAIN.GROUND);
    this.createFinishLine(game.world.width/2-100, game.world.height/2+75,
                          MAIN.FINISH);                    
  },

  createCheckptGroup: function(){
    var checkpoints = game.add.group();
    checkpoints.enableBody = true; 
    MAIN.checkpoints = checkpoints;
    return checkpoints;
  },

  createCheckPt: function(x, y, graphic){
    var checkPt = MAIN.checkpoints.create(x, y, graphic);
    this.changeScale(checkPt, MAIN.DOUBLE_SCALE, MAIN.THREE_QUARTER_SCALE);
    return checkPt;
  },

  createFinishLine: function(x,y,graphic){
    var finishLine = MAIN.checkpoints.create(x,y,graphic);
    this.changeScale(finishLine, MAIN.THREE_QUARTER_SCALE, 
                    0.5);
    return finishLine;
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
  // set timer for every 1 sec (1000 ms)
  createTimer: function(){
    game.time.events.loop(1000, this.updateTime, this);
    MAIN.startTime = game.time.now;
  },
  
  // Save seconds since game screen started
  updateTime: function(){
    var seconds = Math.ceil(game.time.elapsedSecondsSince(MAIN.startTime)); 
    MAIN.timerTest.text = MAIN.TIMER_STR.concat(seconds);
    MAIN.score = seconds;
    return seconds;
  },

  // Display amount of time elapsed
  createTimerText: function(){
    var timerText = game.add.text(18,18,MAIN.TIMER_STR, 
                                  {fontSize:'20px', fill: "#ffffff" });
    MAIN.timerTest = timerText;
    return timerText;
  }, 

  // Setup keyboard to detect user input
  addKeyboard: function(){
    // cursor automatically sets arrow keys
    var cursor = game.input.keyboard.createCursorKeys();
    MAIN.cursor = cursor;

    if (MAIN.isMultiplayer()){
      var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
      var aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
      var sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
      var dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

      MAIN.wKey = wKey;
      MAIN.aKey = aKey;
      MAIN.sKey = sKey;
      MAIN.dKey = dKey;
    }
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
  detectCheckptOverlap: function(players){
    game.physics.arcade.overlap(players.p1, MAIN.checkpoints,
                                this.handleCrossCheckpt, null, this);
    if (MAIN.isMultiplayer()){
      game.physics.arcade.overlap(players.p2, MAIN.checkpoints,
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
  detectHorMov: function(players){
    if (MAIN.cursor.left.isDown){
      players.p1.body.angularVelocity = -MAIN.VELOCITY;
    }
    else if (MAIN.cursor.right.isDown){
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
  detectVertMov: function(players){
    if (MAIN.cursor.up.isDown){
      game.physics.arcade.velocityFromAngle(players.p1.angle,MAIN.VELOCITY,
                                            players.p1.body.velocity);
    }
    else if (MAIN.cursor.down.isDown){
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

  checkFinish: function(){
    if (MAIN.checkpoints.countLiving() === 0){
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
      MAIN.platforms = LEVEL.createPlatformGroup();
      MAIN.createHelper.setupWorld(MAIN.platforms);
      MAIN.createHelper.createCheckpts();
      MAIN.players = MAIN.createHelper.createPlayer();
      MAIN.createHelper.createTimer();
      MAIN.createHelper.createTimerText();
      MAIN.createHelper.addKeyboard();
    },

    // update() called on frame refresh
    update:function() {
      MAIN.updateHelper.resetVelocity(MAIN.players);
      MAIN.updateHelper.detectCollision(MAIN.players, MAIN.platforms);
      MAIN.updateHelper.detectVertMov(MAIN.players);
      MAIN.updateHelper.detectHorMov(MAIN.players);
      MAIN.updateHelper.detectCheckptOverlap(MAIN.players);
      MAIN.updateHelper.checkFinish();
    }
};

