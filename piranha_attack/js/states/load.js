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
    game.load.image('player', 'assets/fish_fin.gif');
    game.load.image('platform', 'assets/platform.png');
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
