
var MENU = {
  title: 'Piranha Attack',
  startLabel: 'Click to start game',
  instrLabel: 'Instructions',
  instr: 'Click on screen to jump',
  headerFont: {font: '50px Arial', fill: '#ffffff'},
  textFont: {font: '25px Arial', fill: '#ffffff'}
};

var game = game;

MENU.menuHelper = {
  displayText: function(){
    game.add.text(80,80, MENU.title, MENU.headerFont);
    game.add.text(80, game.world.height-290, MENU.startLabel, MENU.textFont);
    game.add.text(80, game.world.height-210, MENU.instrLabel, MENU.textFont);
    game.add.text(80, game.world.height-170, MENU.instr, MENU.textFont);
  },

  getPlayerInput: function(){
    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.addOnce(this.startGame, this);
  },

  startGame: function(){
    game.state.start('main');
  }
};

var menuState = {
  create: function() {
    MENU.menuHelper.displayText();
    MENU.menuHelper.getPlayerInput();
  }
};
