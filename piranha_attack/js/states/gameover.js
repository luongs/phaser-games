var GAMEOVER = {
  scoreMsg: "Your score: ",
  highScoreMsg: "Highest score: ",
  mainMenuMsg: "Click to return to main menu",
  textFont: {font: '25px Arial', fill: "#ffffff"}
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
    game.add.text(80,80, GAMEOVER.scoreMsg.concat(score),
                  GAMEOVER.textFont);
    game.add.text(80, 110, GAMEOVER.highScoreMsg.concat(highScore),
                  GAMEOVER.textFont);
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
    GAMEOVER.helper.displayMsg(score, highScore);
    GAMEOVER.helper.getPlayerInput();
  }
};
