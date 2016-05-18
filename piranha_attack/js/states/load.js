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

  loadAnimation: function() {
    game.load.spritesheet('player', 'assets/fishSprite.png', 32,32);
    game.load.spritesheet('enemy', 'assets/duckSprite.png', 30, 35)
  },

  loadImages: function() {
    //game.load.image('enemy', 'assets/land.png');
    game.load.image('bird', 'assets/bird.png');
    game.load.image('platform', 'assets/platform.png');
  }
};

var loadState = {
  preload: function(){
    LOAD.preloadHelper.displayLoadMsg();
    LOAD.preloadHelper.loadBackground();
    LOAD.preloadHelper.loadAnimation();
    LOAD.preloadHelper.loadImages();
  },

  create: function(){
    game.state.start('menu');
  }
};
