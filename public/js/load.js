var Game = {
    w: 720,
    h: 384
};

Game.Boot = function (game) {
    this.game = game;
};

Game.Boot.prototype = {
    preload: function () {
        this.game.stage.backgroundColor = '#3F7CAC'; //blue
        this.game.load.image('loading', 'assets/img/loading.png');
        this.game.load.bitmapFont('minecraftia', 'assets/font/font.png', 'assets/font/font.xml');
    },
    create: function () {
        this.game.state.start('Load');
    }
};

Game.Load = function (game) {
    this.game = game;
};

Game.Load.prototype = {
    preload: function () {

        //Loading Screen Message/bar
        this.game.load.image('title', 'assets/img/logo-warped-medium.png');

        var loadingText = this.game.add.bitmapText(Game.w / 2, Game.h / 2, 'minecraftia', 'Loading...', 21);
        loadingText.x = this.game.width / 2 - loadingText.textWidth / 2;

        var preloading = this.game.add.sprite(Game.w / 2 - 64, Game.h / 2 + 50, 'loading');
        this.game.load.setPreloadSprite(preloading);

        // Load the 'map.json' file using the TILDED_JSON special flag
        this.game.load.tilemap('level1', 'levels/level1.json', null, Phaser.Tilemap.TILED_JSON);

        this.game.load.spritesheet('warp', 'assets/img/warp.png', 54, 54);
        this.game.load.spritesheet('pnj', 'assets/img/pnj.png', 30, 60);
        this.game.load.spritesheet('enemy', 'assets/img/enemy.png', 26, 38);
        this.game.load.spritesheet('kaboom', 'assets/img/explode.png', 128, 128);
        this.game.load.spritesheet('boom', 'assets/img/bossexplode.png', 128, 128);
        this.game.load.spritesheet('towerlever', 'assets/img/lever.png', 48, 48);
        this.game.load.spritesheet('boss', 'assets/img/boss.png', 38, 60);

        // Load the image 'tileset.png' and associate it in the cache as 'level'
        this.game.load.image('tileset', 'assets/img/tileset.png');
        this.game.load.image('background', 'assets/img/background.png');
        this.game.load.image('bullet1', 'assets/img/spades.png');
        this.game.load.image('bullet2', 'assets/img/hearts.png');
        this.game.load.image('bullet3', 'assets/img/club.png');
        this.game.load.image('bullet4', 'assets/img/bullet.png');
        this.game.load.image('Rbossbullet', 'assets/img/Rbossbullet.png');
        this.game.load.image('Lbossbullet', 'assets/img/Lbossbullet.png');
        this.game.load.image('tower', 'assets/img/tower.png');
        this.game.load.image('towerbullet', 'assets/img/towerbullet.png');
        this.game.load.image('trigger', 'assets/img/trigger.png');
        this.game.load.image('bigtrigger', 'assets/img/bosstriggers.png');
        this.game.load.image('twitter', 'assets/img/twitter.png');

        //Audio
        this.game.load.audio('ambiance', ['assets/audio/ambiance.mp3', 'assets/audio/ambiance.ogg']);
        this.game.load.audio('fire', ['assets/audio/fire.mp3', 'assets/audio/fire.ogg']);
        this.game.load.audio('jump', ['assets/audio/jump.mp3', 'assets/audio/jump.ogg']);
        this.game.load.audio('explode', ['assets/audio/explode.mp3', 'assets/audio/explode.ogg']);

    },
    create: function () {
        this.game.state.start('Menu');
    }
};
