
var MAIN = {
  P_IMG : 'player',
  LAND_IMG : 'platform',
  DOUBLE_SCALE: 2,
};

var game = game;

MAIN.createHelper = {
  addKeyboard: function(){
    var cursor = game.input.keyboard.createCursorKeys();
    return cursor;
  },

  createLand: function(platforms){
    var item = null;
    var startLand = new Structure(-90, game.world.height-150, MAIN.LAND_IMG,
                                  platforms);
    item = startLand.createStructure();
    startLand.changeScale(item, 1 , 5);

    var endLand = new Structure(game.world.width-300, game.world.height-150,
                            MAIN.LAND_IMG, platforms);
    item = endLand.createStructure();
    endLand.changeScale(item, 1, 5);
  },

  createPlayer: function(){
    var player = new Player(game.world.width/2, game.world.height-50, 
                            MAIN.P_IMG);
    player = player.setupPlayer();
    return player;
  },
};

var mainState = {
  create:function() {
    MAIN.cursor = MAIN.createHelper.addKeyboard();    
    MAIN.platforms = LEVEL.createGroup();
    MAIN.createHelper.createLand(MAIN.platforms);
    MAIN.player = MAIN.createHelper.createPlayer();
  }, 

  update:function() {

  }
};
