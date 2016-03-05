// boot.js loads physics
// game is a global variable set in game.js
var game = game;

// bootState left global for game.js
var bootState = {
  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

  game.state.start('load');
  }
};
