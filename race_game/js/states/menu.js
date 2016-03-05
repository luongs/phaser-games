// menu.js displays menu screen with instruction
var MENU = {};
// game is a global variable set in game.js
var game = game;
MENU.title = 'RC Racer';
MENU.startLabel = 'Press "1" key for 1 player game';
MENU.multiLabel = 'Press "2" key for 2 player game';
MENU.instrLabel = 'Instructions';
MENU.accelLabel = "Accelerate: Up arrow (P1)  W key (P2)";
MENU.reverseLabel = 'Reverse: Down arrow (P1)  D key (P2)';
MENU.turnLabel = 'Turn: Left/Right arrow (P1)  A/D key (P2)';
MENU.headerFont = {font: '50px Arial', fill: '#ffffff'};
MENU.textFont = {font: '25px Arial', fill: '#ffffff'};

MENU.menuHelper = {
  displayText: function(){
    game.add.text(80,80, MENU.title, MENU.headerFont);
    game.add.text(80, game.world.height-290, 
                                   MENU.startLabel, MENU.textFont);
    game.add.text(80, game.world.height-260,
                                   MENU.multiLabel, MENU.textFont);
    game.add.text(80, game.world.height-210,
                                  MENU.instrLabel,MENU.textFont);
    game.add.text(80, game.world.height-170,
                                  MENU.accelLabel,MENU.textFont);
    game.add.text(80, game.world.height-140,
                                  MENU.reverseLabel,MENU.textFont);
    game.add.text(80, game.world.height-110,
                                  MENU.turnLabel,MENU.textFont);
  }, 
  
  getPlayerChoice: function(){
    var oneKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    var twoKey = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    oneKey.onDown.addOnce(this.start, this);
    twoKey.onDown.addOnce(this.multiplayer_start, this);
  }, 

  multiplayer_start: function() {
    if (game.device.localStorage){
      localStorage.multiplayer = true;
    }

    game.state.start('main');
  },

  start: function() {
    if (game.device.localStorage){
      localStorage.multiplayer = false;
    }

    game.state.start('main');
  },
};

// menuState left global for game.js
var menuState = {

  create: function() {
    MENU.menuHelper.displayText(); 
    MENU.menuHelper.getPlayerChoice();
  } 

};
