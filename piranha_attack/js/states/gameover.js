var GAMEOVER = {
  SCORE_MSG: "Your score: ",
  HIGHSCORE_MSG: "Highest score: ",
  MAINMENU_MSG: "Click to return to main menu",
  BG_COLOR: '#2ecc71',
  TEXT_FONT: {font: '25px Arial', fill: "#ffffff"}
};

var game = game;

GAMEOVER.helper = {

  retrieveScore: function(){
    var score = 0;

    if (game.device.localStorage){
      score = localStorage.score;
    }

    return score;
  },

  getHighScore: function(){
    var highScore = 0;

    if (game.device.localStorage){
      highScore = localStorage.highScore;
    }

    return highScore;
  },

  displayMsg: function(score, highScore){
    game.add.text(80,80, GAMEOVER.SCORE_MSG.concat(score),
                  GAMEOVER.TEXT_FONT);
    game.add.text(80, 110, GAMEOVER.HIGHSCORE_MSG.concat(highScore),
                  GAMEOVER.TEXT_FONT);
    game.add.text(80, 150, GAMEOVER.MAINMENU_MSG, GAMEOVER.TEXT_FONT);
  },

  getPlayerInput: function(){
    var click = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    click.onDown.addOnce(this.goToMainMenu, this);
  },

  goToMainMenu: function() {
    game.state.start('menu');
  }
};

var gameoverState = {
  create: function() {
    var score = GAMEOVER.helper.retrieveScore();
    var highScore = GAMEOVER.helper.retrieveScore();
    LOAD.preloadHelper.loadBackground(GAMEOVER.BG_COLOR);
    GAMEOVER.helper.displayMsg(score, highScore);
    GAMEOVER.helper.getPlayerInput();
  }
};
