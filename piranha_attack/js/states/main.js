
var MAIN = {
  P_IMG : 'player',
  LAND_IMG : 'platform',
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
};

MAIN.updateHelper = {
  detectBottom: function(player, platforms){
    game.physics.arcade.collide(player, platforms);
  },

  detectJump: function(player, spaceKey){
    // Jump when sprite is stationary
    if (spaceKey.isDown && player.body.velocity.y === 0){
      if (player.alive === false){
        return;
      }
      player.body.velocity.y = -100;
    }
  },
};

var mainState = {
  create:function() {
    MAIN.spaceKey = MAIN.createHelper.addKeyboard();    
    MAIN.platforms = LEVEL.createGroup();
    MAIN.createHelper.createLand(MAIN.platforms);
    MAIN.player = MAIN.createHelper.createPlayer();
  }, 

  update:function() {
    MAIN.updateHelper.detectBottom(MAIN.player, MAIN.platforms);
    MAIN.updateHelper.detectJump(MAIN.player, MAIN.spaceKey);
  }
};
