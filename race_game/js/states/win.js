// win.js displays win screen

var WIN = {
  scoreMsg : "Your time in seconds: ",
  highScoreMsg : "Fastest time: ",
  mainMenuMsg : "Press Space bar to return to main menu",
  textFont : {font: '25px Arial', fill: '#ffffff'}
};

// game is a global variable set in game.js
var game = game;

WIN.winHelper = {
  displayMsgs: function(){
    game.add.text(80,80, WIN.scoreMsg.concat(WIN.score), WIN.textFont);
    game.add.text(80, 110, WIN.highScoreMsg.concat(WIN.highScore), 
                  WIN.textFont);
    game.add.text(80, game.world.height-150, WIN.mainMenuMsg, WIN.textFont);
  },

  retrieveScore: function(){
    if (game.device.localStorage){
      WIN.score = localStorage.score;
      WIN.highScore = localStorage.highScore; 
    }
    else{
      WIN.score = 0;
      WIN.highScore = 0;
    }
  }, 

  getPlayerInput: function(){
    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.addOnce(this.goToMainMenu, this);
  },
  
  goToMainMenu: function() {
    game.state.start('menu');
  }
};

// winState left global for game.js
var winState = {
  create: function() {
    WIN.winHelper.retrieveScore();
    WIN.winHelper.displayMsgs();
    WIN.winHelper.getPlayerInput();
  } 
};
