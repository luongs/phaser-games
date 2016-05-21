var LOAD = {
  loadMsg : "Loading...",
  textFont : {font: '30px Courier', fill: '#ffffff'},
  loadLabelX: 80,
  loadLabelY: 150,
  backgroundColor: '#2ecc71'
};

var game = game;

LOAD.preloadHelper = {
  displayLoadMsg: function() {
    game.add.text(LOAD.loadLabelX, LOAD.loadLabelY, LOAD.loadMsg,
                  LOAD.textFont);
  },

  loadBackground: function(bgColor) {
    game.stage.backgroundColor = bgColor;
  },

  loadAnimation: function() {
    game.load.spritesheet('player', 'assets/fishSprite.png', 32,32);
    game.load.spritesheet('enemy', 'assets/duckSprite.png', 30, 35)
    game.load.spritesheet('bird', 'assets/flappySprite.png', 45, 35)
  },

  loadImages: function() {
    game.load.image('platform', 'assets/platform.png');
  }
};

var loadState = {
  preload: function(){
    LOAD.preloadHelper.displayLoadMsg();
    LOAD.preloadHelper.loadBackground(LOAD.backgroundColor);
    LOAD.preloadHelper.loadAnimation();
    LOAD.preloadHelper.loadImages();
  },

  create: function(){
    game.state.start('menu');
  }
};
