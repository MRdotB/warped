/*global Game*/
//player
//var bulletTabs;

var deaths = 0;
var sound = true;
var kill = true;
var style = [
    {font: "32px arial", fill: "#fff", align: "center"},
    {font: "17px arial", fill: "#fff", align: "center"}
]
var checkpoint = [
    [1881, 1800], [3866, 1140], [1303, 1000], [1130, 500]
];
var lastCheckpoint = [353, 1886]; //[353,1886];
//controller
var up;
var down;
var right;
var left;
var space;
var alive = true;
var facing = "right";
var hozMove = 160;//160
var vertMove = -330; //-330
var jumpTimer = 0;
//sound
var ambiance;
var fire;
//bullet
var bulletRate = 500;
var bulletTime = 0;
var kaboom;
//enemy
var enemySpeedX = -100;
//tower
var towerAlive = false;
//boss
var bossPhase = 0;
var bossLive = 3;
var bossHitable = false;

Game.Play = function (game)
{
    this.game = game;
};

Game.Play.prototype = {
    create: function ()
    {
        this.towerShootingTime = 0;
        /*
         ** Enable arcade physics
         */
        this.game.physics.startSystem(Phaser.ARCADE);
        /*
         **Map init
         */
        this.game.add.tileSprite(0, 0, 4176, 2112, 'background');
        this.level = 'level1';
        this.map = this.game.add.tilemap(this.level);
        this.map.addTilesetImage('tileset');
        this.map.setCollisionBetween(1, 18);
        this.layer = this.map.createLayer('Tile Layer 1');
        this.map.setTileIndexCallback([19, 20], this.playerDead, this);
        this.layer.resizeWorld();

        this.loadTriggers();
    },
    loadTriggers: function ()
    {
        /*
         Load triggers for checkpoint / minion / boss / tower
         */
        this.checkpointTriggers = game.add.group();
        this.checkpointTriggers.create(1860, 1840, 'bigtrigger');
        this.checkpointTriggers.create(3811, 1160, 'bigtrigger');
        this.checkpointTriggers.create(1703, 1024, 'bigtrigger');
        this.checkpointTriggers.create(1162, 496, 'bigtrigger');
        this.game.physics.enable(this.checkpointTriggers);
        this.checkpointTriggers.enableBody = true;

        this.minionTriggers = game.add.group();
        this.minionTriggers.create(1968, 1936, 'trigger');
        this.minionTriggers.create(2492, 1936, 'trigger');
        this.minionTriggers.create(2687, 1831, 'trigger');
        this.minionTriggers.create(2826, 1840, 'trigger');
        this.minionTriggers.create(3023, 1744, 'trigger');
        this.minionTriggers.create(3210, 1744, 'trigger');
        this.minionTriggers.create(3552, 1648, 'trigger');
        this.minionTriggers.create(3780, 1648, 'trigger');
        this.minionTriggers.create(3888, 1504, 'trigger');
        this.minionTriggers.create(3930, 1504, 'trigger');
        this.minionTriggers.create(3696, 1216, 'trigger');
        this.minionTriggers.create(3928, 1216, 'trigger');
        this.minionTriggers.create(3692, 1168, 'trigger');
        this.minionTriggers.create(3597, 1168, 'trigger');
        this.minionTriggers.create(3498, 1120, 'trigger');
        this.minionTriggers.create(3405, 1120, 'trigger');
        this.minionTriggers.create(3163, 1168, 'trigger');
        this.minionTriggers.create(3117, 1168, 'trigger');
        this.minionTriggers.create(2256, 1120, 'trigger');
        this.minionTriggers.create(2347, 1120, 'trigger');
        this.minionTriggers.create(195, 832, 'trigger');
        this.minionTriggers.create(232, 832, 'trigger');
        this.minionTriggers.create(2727, 1120, 'trigger');
        this.minionTriggers.create(2689, 1120, 'trigger');
        this.game.physics.enable(this.minionTriggers);
        this.minionTriggers.enableBody = true;

        this.towerTriggers = this.game.add.sprite(1200, 950, 'bigtrigger'); // a voir
        this.game.physics.enable(this.towerTriggers);
        this.towerTriggers.enableBody = true;

        this.bossTriggers = game.add.group();
        this.bossTriggers.create(1589, 380, 'bigtrigger');
        this.bossTriggers.create(1860, 380, 'bigtrigger');
        this.bossTriggers.create(1971, 380, 'bigtrigger');
        this.bossTriggers.create(2315, 380, 'bigtrigger');
        this.game.physics.enable(this.bossTriggers);
        this.bossTriggers.enableBody = true;

        this.loadPlayer();
    },
    loadPlayer: function ()
    {
        this.player = this.game.add.sprite(91, 1981, 'warp'); //[91,1981][1130, 500]
        this.player.animations.add('warpright', [1, 2, 3, 4], 5, true);
        this.player.animations.add('warpleft', [8, 7, 6, 5], 5, true);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.setSize(35, 48, 5, 5);
        this.player.body.collideWorldBounds = true;
        this.player.body.maxVelocity.setTo(700, 330);
        this.player.anchor.y = 0.5;
        this.game.time.events.add(Phaser.Timer.SECOND * 3, function ()
        {
            console.log('gravity on !')
            this.player.body.gravity.y = 500;
        }, this);


        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);

        /*
         Create a bulletGroup array for shooting
         */
        this.bullets = this.game.add.group();
        this.bullets.create(0, 0, "bullet1");
        this.bullets.create(0, 0, "bullet2");
        this.bullets.create(0, 0, "bullet3");
        this.bullets.create(0, 0, "bullet4");
        this.bullets.callAll('kill');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.game.physics.enable(this.bullets);
        this.bullets.enableBody = true;
        this.facing = "right";
        /*
         Init keyboard controls
         Init xbox pad controls
         */
        up = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        down = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        m = this.game.input.keyboard.addKey(Phaser.Keyboard.M);

        this.loadMinion();
    },
    loadMinion: function ()
    {
        this.enemy = this.game.add.group();
        this.enemy.create(2460, 1930, 'enemy');
        this.enemy.create(2761, 1834, 'enemy');
        this.enemy.create(3019, 1738, 'enemy');
        this.enemy.create(3551, 1642, 'enemy');
        this.enemy.create(3902, 1498, 'enemy');
        this.enemy.create(3802, 1210, 'enemy');
        this.enemy.create(3598, 1161, 'enemy');
        this.enemy.create(3404, 1114, 'enemy');
        this.enemy.create(3119, 1162, 'enemy');
        this.enemy.create(2689, 1114, 'enemy');
        this.enemy.create(2253, 1114, 'enemy');
        this.enemy.create(190, 826, 'enemy');
        this.game.physics.enable(this.enemy);
        this.enemy.setAll('body.velocity.x', enemySpeedX, true);
        this.enemy.callAll('animations.add', 'animations', 'left', [0, 1], 6, true);
        this.enemy.callAll('animations.add', 'animations', 'right', [2, 3], 6, true);
        //explosion
        kaboom = game.add.group();
        this.game.physics.enable(kaboom);

        this.loadPnj();
    },
    loadPnj: function ()
    {
        this.pnj = game.add.group();
        this.pnj.create(350, 1956, 'pnj');
        this.pnj.create(1785, 1860, 'pnj');
        this.pnj.create(1930, 1044, 'pnj');
        this.pnj.create(1022, 516, 'pnj');
        this.game.physics.enable(this.pnj);

        addTalk(this.pnj.children[0], "Hello Warp! \n Use arrow key to move and jump", "Good luck !", 1);
        addTalk(this.pnj.children[1], "Press space to fire", "Shoot the first minion behind me !", 1);
        addTalk(this.pnj.children[2], "Be careful there is an evil tower here", "Climb to the top and fire on the lever to desactive it !", 0);
        addTalk(this.pnj.children[3], "Congrats ! You pass the evil tower\nnow it's time to fight the boss", "Good luck !", 1);
        function addTalk(pnj, msg1, msg2, frame)
        {
            pnj.msg1 = msg1;
            pnj.msg2 = msg2;
            pnj.text = game.add.text(pnj.position.x, pnj.position.y - 25, pnj.msg1, {
                font: "17px arial",
                fill: "#fff",
                align: "center"
            });
            pnj.text.anchor.set(0.5);
            pnj.frame = frame;
        }

        this.loadTower();
    },
    loadTower: function ()
    {
        this.tower = game.add.sprite(665, 805, 'tower');
        this.lever = game.add.sprite(672, 576, 'towerlever');
        this.lever.enableBody = true;
        this.lever.frame = 0;
        this.physics.enable(this.lever);
        //tower bullet
        this.towerShoot = game.add.group();
        this.towerShoot.createMultiple(15, 'towerbullet');
        this.towerShoot.setAll('anchor.x', 0.5);
        this.towerShoot.setAll('anchor.y', 1);
        this.towerShoot.callAll('kill');
        this.towerShoot.enableBody = true;
        this.game.physics.enable(this.towerShoot);

        this.loadBoss();
    },
    loadBoss: function ()
    {
        this.boss = game.add.sprite(2218, 516, 'boss');
        this.boss.animations.add('bossright', [0, 1, 2, 3], 5, true);
        this.boss.animations.add('bossleft', [4, 5, 6, 7], 5, true);
        this.game.physics.enable(this.boss);
        this.boss.enableBody = true;
        //boss bullet
        this.bossShootL = game.add.group();
        this.bossShootL.createMultiple(15, 'Lbossbullet');
        this.bossShootL.setAll('anchor.x', 0.5);
        this.bossShootL.setAll('anchor.y', 1);
        this.bossShootL.callAll('kill');
        this.bossShootL.enableBody = true;
        this.game.physics.enable(this.bossShootL);
        this.bossShootR = game.add.group();
        this.bossShootR.createMultiple(15, 'Rbossbullet');
        this.bossShootR.setAll('anchor.x', 0.5);
        this.bossShootR.setAll('anchor.y', 1);
        this.bossShootR.callAll('kill');
        this.bossShootR.enableBody = true;
        this.game.physics.enable(this.bossShootR);

        //emitter for boss dead
        this.emitter = this.game.add.emitter(0, 0, 200);
        this.emitter.makeParticles('bullet1');
        this.emitter.gravity = 0;
        this.emitter.minParticleSpeed.setTo(-100, -100);
        this.emitter.maxParticleSpeed.setTo(100, 100);

        this.interface();
    },
    interface: function ()
    {
        //sound
        ambiance = this.game.add.audio('ambiance', 1, true);
        fire = this.game.add.audio('fire');
        jump = this.game.add.audio('jump');
        explode = this.game.add.audio('explode');
        if (sound === true)
        {
            ambiance.play('', 0, 1, true);
        }
        this.death = this.game.add.text(16, 16, 'Death : ' + deaths, style[0]);
        this.death.fixedToCamera = true;

    },
    update: function ()
    {
        //update player
        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.overlap(this.bullets, this.layer, this.killBullet);
        this.player.body.velocity.x = 0;
        this.playerMove();

        this.game.physics.arcade.overlap(this.player, this.enemy, this.playerDead, null, this);
        this.game.physics.arcade.overlap(this.player, this.towerShoot, this.playerDead, null, this);
        this.game.physics.arcade.overlap(this.player, this.bossShootL, this.playerDead, null, this);
        this.game.physics.arcade.overlap(this.player, this.bossShootL, this.resetBoss, null, this);
        this.game.physics.arcade.overlap(this.player, this.bossShootR, this.playerDead, null, this);
        this.game.physics.arcade.overlap(this.player, this.bossShootR, this.resetBoss, null, this);
        //update pnj
        this.game.physics.arcade.overlap(this.player, this.pnj, this.talk);
        //update minions
        this.game.physics.arcade.overlap(this.enemy, this.minionTriggers, this.reverseVelocity);
        this.enemy.forEach(function (enemy)
        {
            if (enemy.body.velocity.x > 0)
            {
                enemy.animations.play('right');
            }
            else if (enemy.body.velocity.x < 0)
            {
                enemy.animations.play('left');
            }
        }, this);
        this.game.physics.arcade.overlap(this.bullets, this.enemy, this.enemyDead);
        //update tower
        this.game.physics.arcade.overlap(this.player, this.towerTriggers, function ()
        {
            towerAlive = true;
        });
        if (towerAlive)
        {
            this.shootAt(this.tower, this.player, this.towerShoot, 70, 30, 140);
            this.game.physics.arcade.overlap(this.towerShoot, this.layer, this.killBullet);
            this.game.physics.arcade.overlap(this.bullets, this.lever, function (bullets, lever)
            {
                towerAlive = false;
                this.lever.frame = 1;
            }, null, this);
        }
        //checkpoint
        this.game.physics.arcade.overlap(this.player, this.checkpointTriggers.children[0], function (player, trigger)
        {
            lastCheckpoint[0] = checkpoint[0][0];
            lastCheckpoint[1] = checkpoint[0][1];
        });
        this.game.physics.arcade.overlap(this.player, this.checkpointTriggers.children[1], function (player, trigger)
        {
            lastCheckpoint[0] = checkpoint[1][0];
            lastCheckpoint[1] = checkpoint[1][1];
        });
        this.game.physics.arcade.overlap(this.player, this.checkpointTriggers.children[2], function (player, trigger)
        {
            lastCheckpoint[0] = checkpoint[2][0];
            lastCheckpoint[1] = checkpoint[2][1];
        });
        this.game.physics.arcade.overlap(this.player, this.checkpointTriggers.children[3], function (player, trigger)
        {
            lastCheckpoint[0] = checkpoint[3][0];
            lastCheckpoint[1] = checkpoint[3][1];
        });
        //boss
        this.game.physics.arcade.overlap(this.player, this.bossTriggers.children[2], function ()
        {
            if (bossPhase == 0)
            {
                bossPhase = 1;
            }
        })
        if (bossPhase == 1 && this.boss.anim !== true)
        {
            this.boss.anim = true;
            game.time.events.add(Phaser.Timer.SECOND, function ()
            {
                this.boss.talk = this.game.add.text(this.boss.position.x, this.boss.position.y - 40, "Aha, in fact i'm the boss ! ", style[1]);
                this.boss.talk.anchor.set(0.5);
            }, this);
            this.game.time.events.add(Phaser.Timer.SECOND * 2, function ()
            {
                this.boss.talk.text = "It's time to die Warp !";
            }, this);
            game.time.events.add(Phaser.Timer.SECOND * 3, function ()
            {
                this.boss.talk.destroy();
                bossPhase = 2;
                this.boss.body.velocity.x = -100;
            }, this);
        }
        else if (bossPhase == 2)
        {
            this.boss.animations.play('bossleft');
            this.boss.anim = false;
            this.shootAt(this.boss, this.player, this.bossShootL, 0, 30, 200);
            this.game.physics.arcade.overlap(this.boss, this.bossTriggers, this.reverseVelocity);
            this.game.physics.arcade.overlap(this.bullets, this.boss, this.bossHit, null, this);
            this.game.physics.arcade.overlap(this.bossShootL, this.layer, this.killBullet);
        }
        else if (bossPhase == 3)
        {
            bossHitable = false;
            this.boss.x = 1726;
            this.boss.body.velocity.x = 0;
            this.boss.revive();
            bossPhase = 4;
            this.boss.frame = 0;
            bossLive = 3;
        }
        else if (bossPhase == 4 && this.boss.anim !== true)
        {
            this.boss.anim = true;
            game.time.events.add(Phaser.Timer.SECOND, function ()
            {
                this.boss.talk = this.game.add.text(this.boss.position.x, this.boss.position.y - 40, "I'm not so weak Warp ! ", style[1]);
                this.boss.talk.anchor.set(0.5);
            }, this);
            game.time.events.add(Phaser.Timer.SECOND * 2, function ()
            {
                this.boss.talk.destroy();
                this.boss.body.velocity.x = 100;
                bossPhase = 5;
            }, this);
        }
        else if (bossPhase == 5)
        {
            this.shootAt(this.boss, this.player, this.bossShootR, 0, 30, 200);
            this.game.physics.arcade.overlap(this.boss, this.bossTriggers, this.reverseVelocity);
            this.game.physics.arcade.overlap(this.bullets, this.boss, this.bossHit, null, this);
            this.game.physics.arcade.overlap(this.bossShootR, this.layer, this.killBullet);
            this.boss.animations.play('bossright');
            if (bossLive == 0)
            {
                this.twitter();
                bossPhase++;
            }
        }
    },
    bossHit: function ()
    {
        if (bossHitable !== true)
        {
            bossHitable = true;
            bossLive--;
            game.time.events.add(Phaser.Timer.SECOND, function ()
            {
                bossHitable = false;
            });
        }
        if (bossLive === 0)
        {
            game.time.events.add(Phaser.Timer.SECOND, function ()
            {
                bossPhase++;
            });
            this.boss.kill()
            this.emitter.x = this.boss.x;
            this.emitter.y = this.boss.y;
            this.emitter.start(true, 1000, null, 64);
        }
    },
    resetBoss: function ()
    {
        bossLive = 3;
        this.boss.anim = false;
        bossHitable = false;
        this.boss.x = 2218;
        this.boss.body.velocity.x = 0;
        this.boss.revive();
        bossPhase = 0;
        this.boss.frame = 6;
    },
    playerMove: function ()
    {
        if (left.isDown)
        {
            this.player.body.velocity.x = -hozMove;

            if (facing !== 'left')
            {
                this.player.animations.play('warpleft');
                facing = 'left';
                this.facing = 'left';
            }
        }
        else if (right.isDown)
        {
            this.player.body.velocity.x = hozMove;

            if (facing !== 'right')
            {
                this.player.animations.play('warpright');
                facing = 'right';
                this.facing = 'right';
            }
        }
        else
        {
            if (facing !== 'idle')
            {
                this.player.animations.stop();
                if (facing === "left")
                {
                    this.player.frame = 9;
                }
                else if (facing === "right")
                {
                    this.player.frame = 0;
                }
            }
            facing = 'idle';
        }
        if (up.isDown && this.player.body.onFloor())
        {
            if (sound == true)
            {
                jump.play();
            }
            this.player.body.velocity.y = vertMove;
            jumpTimer = this.game.time.now + 650;
        }
        if (facing === "left" && up.isDown)
        {
            this.player.frame = 6;
        }
        if (facing === "right" && up.isDown)
        {
            this.player.frame = 3;
        }
        if (space.isDown)
        {

            this.shoot();
        }
    }
    ,
    playerDead: function ()
    {
        this.player.kill();
        if (kill == true)
        {
            deaths += 1;
            kill = false;
        }
        this.game.time.events.add(Phaser.Timer.SECOND, function ()
        {
            kill = true;
        });
        this.respawnPlayer();
        this.death.text = 'Death : ' + deaths;
    }
    ,
    shoot: function ()
    {
        //add this.facing = right; somewhere
        if (this.game.time.now > bulletTime)
        {
            if (sound === true)
            {
                fire.play();
            }
            bulletTime = this.game.time.now + bulletRate;
            var currentBullet = this.bullets.getFirstExists(false);

            if (currentBullet)
            {
                currentBullet.revive();
                currentBullet.lifespan = 2000; //kill after 2000ms
                if (this.facing === "right")
                {
                    currentBullet.reset(this.player.x + 38, this.player.y);
                    currentBullet.body.velocity.x = 250;
                }
                else if (this.facing === "left")
                {
                    currentBullet.reset(this.player.x + 10, this.player.y);
                    currentBullet.body.velocity.x = -250;
                }
            }
        }
    }
    ,
    reverseVelocity: function (enemy, trigger)
    {
        if (enemy.lastTrigger !== trigger)
        {
            enemy.body.velocity.x *= -1;
            enemy.lastTrigger = trigger;
        }
    }
    ,
    shootAt: function (shooter, target, bullet, x, y, bulletSpeed)
    {
        if (this.game.time.now > this.towerShootingTime)
        {
            var currentShoot = bullet.getFirstExists(false);
            if (currentShoot)
            {
                currentShoot.revive();
                currentShoot.lifespan = 3000;
                this.towerShootingTime = game.time.now + 1000;
                currentShoot.reset(shooter.x + x, shooter.y + y);
                this.game.physics.arcade.moveToObject(currentShoot, target, bulletSpeed);
            }
        }

    }
    ,
    talk: function (player, pnj)
    {
        if (pnj.frame == 0 && pnj.change !== true)
        {
            pnj.text.setText(pnj.msg2);
            pnj.change = true;
            pnj.frame = 1;
        }
        else if (pnj.frame == 1 && pnj.change !== true)
        {
            pnj.text.setText(pnj.msg2);
            pnj.change = true;
            pnj.frame = 0;
        }
    }
    ,
    enemyDead: function (bullet, enemy)
    {
        if (sound == true)
        {
            explode.play();
        }
        var boom = kaboom.create(enemy.x - 40, (enemy.y - 60), 'kaboom');
        boom.animations.add('kaboom', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 15, true);
        boom.animations.play('kaboom');
        game.time.events.add(1000, function ()
        {
            boom.kill();
        });
        if (sound === true)
        {
            explode.play();
        }
        enemy.kill();
        bullet.kill();
    }
    ,
    killBullet: function (bullet, layer)
    {
        bullet.kill();
    }
    ,
    respawnPlayer: function ()
    {
        this.player.revive();
        this.player.position.x = lastCheckpoint[0];
        this.player.position.y = lastCheckpoint[1];

    }
    ,
    twitter: function ()
    {
        this.congrats = this.game.add.text(200, 200, 'Thank you for playing :)  ', {
            fontSize: '32px',
            fill: '#fff'
        });
        this.congrats.fixedToCamera = true;
        this.twitterButton = this.game.add.button(Game.w / 2, 100, 'twitter', function ()
        {
            hozMove = 2000;
            window.open('http://twitter.com/share?text=I+just+beat+Warped!+and+only+died+' + deaths + '+times+See+if+you+can+beat+it+at&via=mrdotb_&url=http://games.baptistechaleil.fr/warped/', '_blank');
        }, this);
        this.twitterButton.anchor.setTo(0.5, 0.5);
        this.twitterButton.fixedToCamera = true;
    }
    /*,
     render: function ()
     {
     this.game.debug.bodyInfo(this.player, 16, 24);
     this.game.debug.body(this.player);
     this.game.debug.body(this.lever);
     this.game.debug.body(this.checkpointTriggers);
     this.checkpointTriggers.forEachAlive(renderGroup, this);
     this.minionTriggers.forEachAlive(renderGroup, this);
     this.bossTriggers.forEachAlive(renderGroup, this);
     function renderGroup(member)
     {
     game.debug.body(member);
     }
     }*/

};
