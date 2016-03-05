// load.js preloads all assets
var LOAD = {};
// game is a global variable set in game.js
var game = game;
LOAD.loadMsg = "Loading...";
LOAD.textFont = {font: '30px Courier', fill: '#ffffff'};
LOAD.loadLabelX = 80;
LOAD.loadLabelY = 150;
LOAD.backgroundColor = '#D4A190';

LOAD.preloadHelper = {
  displayLoadMsg: function() {
    game.add.text(LOAD.loadLabelX, LOAD.loadLabelY, 
                 LOAD.loadMsg, LOAD.textFont);
  }, 

  loadBackground: function() {
    game.stage.backgroundColor = LOAD.backgroundColor;
  },
  
  loadImages: function() {
    game.load.image('car1', 'assets/blue_car.png');
    game.load.image('car2', 'assets/yellow_car.png');
    game.load.image('ground','assets/platform.png');
    game.load.image('wall', 'assets/v_platform.png');
    game.load.image('finish', 'assets/finish_line.png');
  }
};

// loadState left global for game.js
var loadState = {
  preload: function(){
    LOAD.preloadHelper.displayLoadMsg(); 
    LOAD.preloadHelper.loadBackground();
    LOAD.preloadHelper.loadImages();
  },

  create: function(){
    game.state.start('menu');
  }
};
