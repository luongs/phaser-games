// game.js prepares all states and starts off the boot state

var GAME = {
    screen_width: 800,
    screen_height: 600,
};

var game = new Phaser.Game(GAME.screen_width, GAME.screen_height,
                           Phaser.AUTO, 'gamediv');

// reads global states from:
// boot.js, load.js, menu.js, main.js, win.js
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('main', mainState);
game.state.add('win', winState);

game.state.start('boot');
