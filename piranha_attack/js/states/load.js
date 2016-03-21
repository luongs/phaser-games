var LOAD = {
  loadMsg : "Loading...",
  textFont : {font: '30px Courier', fill: '#ffffff'},
  loadLabelX: 80, 
  loadLabelY: 150,
  backgroundColor: '#ccddff'
};

var game = game;

LOAD.preloadHelper = {
  displayLoadMsg: function() {
    game.add.text(LOAD.loadLabelX, LOAD.loadLabelY, LOAD.loadMsg, 
                  LOAD.textFont);
  },

  loadBackground: function() {
    game.stage.backgroundColor = LOAD.backgroundColor;
  },

  loadImages: function() {
    game.load.image('player', 'assets/player.png');
    game.load.image('land', 'assets/land.png');
  }
};

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
