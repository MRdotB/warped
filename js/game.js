/*global Game*/

var game = new Phaser.Game(720, 384, Phaser.AUTO, 'game');
// var game = new Phaser.Game(this.w, this.h, Phaser.CANVAS, 'game');

game.state.add('Boot', Game.Boot);
game.state.add('Load', Game.Load);
game.state.add('Menu', Game.Menu);
game.state.add('Play', Game.Play);

game.state.start('Boot');