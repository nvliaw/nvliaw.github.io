const screenwidth = window.innerHeight * 1.20;
const screenheight = window.innerHeight;
let face = 'down';


export default class MiniGame1 extends Phaser.Scene {

    constructor() {
        super({key: 'MiniGame1'});
    }

    player_speed = 1000;

    preload() {
        // Method that's called at the beginning that loads all my assets (sprites, sounds, etc)
        // Preload hero //
        this.load.spritesheet('hero',
            'sprite/hero.png',
            {frameWidth: 32, frameHeight: 46}
        );
        this.load.spritesheet('foodset',
            'sprite/food.png',
            {frameWidth: 32, frameHeight: 32});
    }

    create() {
        // Initializes our scene such as the position of the sprites
        this.player = this.physics.add.sprite(150, 150, 'hero');
        this.cheese = this.physics.add.sprite(Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85), Phaser.Math.Between(screenheight * 0.10, screenheight * 0.85), 'foodset', 1);
        this.cheese.setScale(1.50, 1.50);
        this.meat = this.physics.add.sprite(Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85), Phaser.Math.Between(screenheight * 0.10, screenheight * 0.85), 'foodset', 6);
        this.meat.setScale(1.50, 1.50);
        this.broccoli = this.physics.add.sprite(Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85), Phaser.Math.Between(screenheight * 0.10, screenheight * 0.85), 'foodset', 3);
        this.broccoli.setScale(1.50, 1.50);
        this.rice = this.physics.add.sprite(Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85), Phaser.Math.Between(screenheight * 0.10, screenheight * 0.85), 'foodset', 2);
        this.rice.setScale(1.50, 1.50);
        this.fish = this.physics.add.sprite(Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85), Phaser.Math.Between(screenheight * 0.10, screenheight * 0.85), 'foodset', 4);
        this.fish.setScale(1.50, 1.50);
        this.cameras.main.setBackgroundColor('#3498db');

        //Player animation when walking left. Repeat:-1 is a loop.
        // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('hero', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('hero', { start: 9, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('hero', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idledown',
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idleup',
            frames: this.anims.generateFrameNumbers('hero', { start: 3, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idleright',
            frames: this.anims.generateFrameNumbers('hero', { start: 7, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idleleft',
            frames: this.anims.generateFrameNumbers('hero', { start: 10, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        // score is stored in a variable and initialized at 0
        this.score = 0;
        let style = {font: '20px Arial', fill: '#fff'};
        this.scoreText = this.add.text(screenwidth - 150, 20, 'score: ' + this.score, style);

        // timer is stored in a variable and initialized at 15seconds
        this.timer = 1000;
        this.timerText = this.add.text(20, 20, 'Time left: ' + this.timer, style);
    }

    update() {
        // Method that's called 60 times per second after create()
        // Handles all the game's logic like movements

        // mouse click
        if (this.input.activePointer.isDown)
        {
            //Move player towards mouse click or finger touch at velocity of 750.
            this.physics.moveTo(this.player, this.input.activePointer.x, this.input.activePointer.y, 250);

            //If player within 5% of mouseclick, they will stop running and plays idle animation. May have to adjust the tolerance number.
            if (Math.abs(this.player.x - this.input.activePointer.x) < screenwidth*0.02 && Math.abs(this.player.y - this.input.activePointer.y) < screenheight*0.02) {
                {
                    this.player.body.velocity.setTo(0, 0);
                    this.player.anims.play('idle' + face, true);
                }
            }
            //Else if player's position < clicked position, player runs right.
            else if (this.player.x < this.input.activePointer.x)
            {
                if (this.player.y - this.input.activePointer.y > this.input.activePointer.x - this.player.x) {
                    this.player.anims.play('up', true);
                    face = 'up';
                }
                else if (this.input.activePointer.y - this.player.y > this.input.activePointer.x - this.player.x){
                    this.player.anims.play('down', true);
                    face = 'down';
                }
                else {
                    this.player.anims.play('right', true);
                    face = 'right';
                }
            }
            //Otherwise player runs left.
            else {
                if (this.player.y - this.input.activePointer.y > this.player.x - this.input.activePointer.x) {
                    this.player.anims.play('up', true);
                    face = 'up';
                }
                else if (this.input.activePointer.y - this.player.y > this.player.x - this.input.activePointer.x) {
                    this.player.anims.play('down', true);
                    face = 'down';
                }
                else {
                    this.player.anims.play('left', true);
                    face = 'left';
                }
            }
        }
        else
        {
            this.player.anims.play('idle' + face, true);
            this.player.body.velocity.setTo(0, 0);
            this.player.body.velocity.setTo(0, 0);
        }

        // If player overlaps with the star, call hit_cheese()
        if (this.physics.overlap(this.player, this.cheese)) {
            this.hit_cheese();
        }
        // If player overlaps with the meat, call hit_meat()
        if (this.physics.overlap(this.player, this.meat)) {
            this.hit_meat();
        }
        // If player overlaps with the meat, call hit_rice()
        if (this.physics.overlap(this.player, this.rice)) {
            this.hit_rice();
        }
        // If player overlaps with the meat, call hit_broccoli()
        if (this.physics.overlap(this.player, this.broccoli)) {
            this.hit_broccoli();
        }
        // If player overlaps with the meat, call hit_fish()
        if (this.physics.overlap(this.player, this.fish)) {
            this.hit_fish();
        }
        if (this.timer > 0) {
            // Doesn't decrement each second right now, need to fix
            setTimeout(this.decrement(), 10000);
        }
    }

    hit_cheese() {
        //Play tween animation
        this.playtween(this.cheese, +10);
        // Change the position of the cheese randomly
        this.cheese.x = Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85);
        this.cheese.y = Phaser.Math.Between(screenheight * 0.10, screenheight * 0.85);

        // Increment the score
        this.score += 10;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);
    }

    hit_meat() {
        //Play tween animation
        this.playtween(this.meat, +25);
        // Change the position of the meat randomly
        this.meat.x = Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85);
        this.meat.y = Phaser.Math.Between(screenheight * 0.10, screenheight * 0.85);

        // Increment the score
        this.score += 25;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);
    }

    hit_broccoli() {
        //Play tween animation
        this.playtween(this.broccoli, -25);
        // Change the position of the cheese randomly
        this.broccoli.x = Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85);
        this.broccoli.y = Phaser.Math.Between(screenheight * 0.10, screenheight * 0.85);

        // Increment the score
        this.score -= 25;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);
    }

    hit_rice() {
        //Play tween animation
        this.playtween(this.rice, -10);
        // Change the position of the cheese randomly
        this.rice.x = Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85);
        this.rice.y = Phaser.Math.Between(screenheight * 0.10, screenheight * 0.85);

        // Increment the score
        this.score -= 10;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);
    }

    hit_fish() {
        //Play tween animation
        this.playtween(this.fish, +5);
        // Change the position of the cheese randomly
        this.fish.x = Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85);
        this.fish.y = Phaser.Math.Between(screenheight * 0.10, screenheight * 0.85);

        // Increment the score
        this.score += 5;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);
    }

    playtween(food, score) {
        let scoreTween;
        if (score >= 0) {
            scoreTween = this.add.text(food.x, food.y, '+' + score, {
                font: '24px Arial Black',
                fill: '#008000',
                strokeThickness: 1
            });
        }
        else {
            scoreTween = this.add.text(food.x, food.y, score, {
                font: '24px Arial Black',
                fill: '#ff0000',
                strokeThickness: 1
            });
        }
        console.log(this.scoreText);
        scoreTween.exists = false;
        scoreTween.tween = this.tweens.add({
            targets: scoreTween,
            alpha: 0,
            x: this.scoreText.x + this.scoreText.displayWidth - 10,
            y: 20,
            ease: 'Cubic.easeInOut',
            duration: 2200,
            repeat: 0,
            yoyo: false
        });
    }

    decrement() {
        this.timer -= 1;
        this.timerText.setText('Time left: ' + this.timer);
        if (this.timer === 0) {
            this.scene.stop();
            this.scene.wake('MainHouse', {score: this.score});
        }
    }
}