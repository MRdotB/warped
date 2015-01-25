/*global Game*/
Game.Menu = function(game){
    this.game = game;
};

Game.Menu.prototype =  {
    create: function() {
        this.title = this.game.add.sprite(Game.w/2,Game.h/2-100,'title');
        this.title.anchor.setTo(0.5,0.5);
        var text = this.game.add.bitmapText(Game.w/2, Game.h/2, 'minecraftia', '~click to start~', 21);
        text.x = this.game.width / 2 - text.textWidth / 2;
    },
    update: function() {
        if (this.game.input.activePointer.isDown){
            this.game.state.start('Play');
        }
    }
};
