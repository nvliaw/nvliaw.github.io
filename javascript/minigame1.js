const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;
let face = 'down';

export default class MiniGame1 extends Phaser.Scene {

    constructor() {
        super({key: 'MiniGame1'});
    }

    // Grabs data passed from other modules that determine which object was clicked (fridge, TV, or garbage)
    init(data) {
        this.object = data.object;
    }

    preload() {
        // Preload audio
        this.load.audioSprite('sfx_game1', './audio/minigame.json', ['audio/minigame.mp3', 'audio/minigame.ogg', 'audio/minigame.m4a', 'audio/minigame.ac3']);
    }

    create() {

        this.objectnames = {'foodset': ['Meat', 'Rice', 'Cheese', 'Fish', 'Broccoli'],
            'shoppingset': ['Face Wash', 'Razor', 'Toothbrush', 'Cloth', 'Soap'],
            'trashset': ['Plastic Cutlery', 'Saran Wrap', 'Napkins', 'Tea Bags', 'Apple Core']};

        // Initializes our scene such as the position of the sprites
        this.player = this.physics.add.sprite(150, 150, 'hero');
        this.selectedSet = this.object + 'set';

        // Spawns the objects in a random area
        this.object1 = this.physics.add.sprite(Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85), Phaser.Math.Between(screenheight * 0.10, screenheight - 112), this.selectedSet, 0);
        this.object1name = this.objectnames[this.selectedSet][0];
        this.object1count = 0;
        this.object2 = this.physics.add.sprite(Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85), Phaser.Math.Between(screenheight * 0.10, screenheight - 112), this.selectedSet, 1);
        this.object2name = this.objectnames[this.selectedSet][1];
        this.object2count = 0;
        this.object3 = this.physics.add.sprite(Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85), Phaser.Math.Between(screenheight * 0.10, screenheight - 112), this.selectedSet, 2);
        this.object3name = this.objectnames[this.selectedSet][2];
        this.object3count = 0;
        this.object4 = this.physics.add.sprite(Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85), Phaser.Math.Between(screenheight * 0.10, screenheight - 112), this.selectedSet, 3);
        this.object4name = this.objectnames[this.selectedSet][3];
        this.object4count = 0;

        // Three broccoli to make it more challenging
        this.object5_1 = this.physics.add.sprite(Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85), Phaser.Math.Between(screenheight * 0.10, screenheight - 112), this.selectedSet, 4);
        this.object5name = this.objectnames[this.selectedSet][4];
        this.object5_2 = this.physics.add.sprite(Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85), Phaser.Math.Between(screenheight * 0.10, screenheight - 112), this.selectedSet, 4);
        this.object5_3 = this.physics.add.sprite(Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85), Phaser.Math.Between(screenheight * 0.10, screenheight - 112), this.selectedSet, 4);
        this.object5count = 0;
        this.cameras.main.setBackgroundColor('#3498db');

        // Scale all sprites
        this.player.setScale(2, 2);
        this.object3.setScale(2, 2);
        this.object1.setScale(2, 2);
        this.object5_1.setScale(2, 2);
        this.object5_2.setScale(2, 2);
        this.object5_3.setScale(2, 2);
        this.object4.setScale(2, 2);
        this.object2.setScale(2, 2);

        // Create the legend
        // Create the box for the legend.
        this.legendbox = this.add.rectangle(1, screenheight - 76, screenwidth-2, 74).setOrigin(0, 0);
        this.legendbox.setStrokeStyle(3, 0xFF0000);
        this.add.graphics().fillRect(1, screenheight - 76, screenwidth-2, 74).fillStyle(0x009900, 0.25);

        // Create sprites for the legend
        this.object1sprite = this.add.sprite(0, 0, this.selectedSet, 0).setOrigin(0.5, 0.5);
        this.object2sprite = this.add.sprite(0, 0, this.selectedSet, 1).setOrigin(0.5, 0.5);
        this.object3sprite = this.add.sprite(0, 0, this.selectedSet, 2).setOrigin(0.5, 0.5);
        this.object4sprite = this.add.sprite(0, 0, this.selectedSet, 3).setOrigin(0.5, 0.5);
        this.object5sprite = this.add.sprite(0, 0, this.selectedSet, 4).setOrigin(0.5, 0.5);

        // Create text for the sprite.
        this.object1text = this.add.text(0, 32, '+5', {
            font: '16px',
            strokeThickness: 1
        }).setOrigin(0.5, 0.5);
        this.object2text = this.add.text(0, 32, '+3', {
            font: '16px Black',
            strokeThickness: 1
        }).setOrigin(0.5, 0.5);
        this.object3text = this.add.text(0, 32, '+1', {
            font: '16px Black',
            strokeThickness: 1
        }).setOrigin(0.5, 0.5);
        this.object4text = this.add.text(0, 32, '-1', {
            font: '16px Black',
            strokeThickness: 1
        }).setOrigin(0.5, 0.5);
        this.object5text = this.add.text(0, 32, '-2', {
            font: '16px Black',
            strokeThickness: 0.5
        }).setOrigin(0.5, 0.5);

        // Create a container for each object in the legend (a sprite and text underneath).
        // Currently the text is under the sprite by 32 pixels. Horizontal distance between each container is set to 64 pixels.
        this.object1legend = this.add.container(0, 0, [this.object1sprite, this.object1text]);
        this.object2legend = this.add.container(64, 0, [this.object2sprite, this.object2text]);
        this.object3legend = this.add.container(128, 0, [this.object3sprite, this.object3text]);
        this.object4legend = this.add.container(192, 0, [this.object4sprite, this.object4text]);
        this.object5legend = this.add.container(256, 0, [this.object5sprite, this.object5text]);

        // Create another container storing all objects. This container is placed in the bottom middle of the screen.
        this.legend = this.add.container((screenwidth - 256) / 2, screenheight - 50, [this.object1legend, this.object2legend, this.object3legend, this.object4legend, this.object5legend]);

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

        // Score is stored in a variable and initialized at 0
        this.score = 0;
        let style = {font: '20px', fill: '#fff'};
        this.scoreText = this.add.text(screenwidth - 150, 20, 'score: ' + this.score, style);

        // Timer is stored in a variable and initialized at 15seconds
        this.timer = 733;
        this.timerText = this.add.text(20, 20, 'Time left: ' + this.timer, style);

        // Set world bounds so player can not walk into legend or off screen.
        this.physics.world.setBounds(0, 0, screenwidth, screenheight - 76);
        this.player.setCollideWorldBounds(true);


        let audiomap = this.cache.json.get('sfx_game1').spritemap;

        // Play background music for the minigame
        this.sound.playAudioSprite('sfx_game1', 'bubblebobble', { loop: true });
    }

    update() {
        // Method that's called 60 times per second after create()
        // Handles all the game's logic like movements

        // Mouse click / touch
        if (this.input.activePointer.isDown)
        {
            //Move player towards mouse click or finger touch at velocity of 500.
            this.physics.moveTo(this.player, this.input.activePointer.x, this.input.activePointer.y, 500);

            //If player within 2% of mouseclick, they will stop running and plays idle animation.
            if (Math.abs(this.player.x - this.input.activePointer.x) < screenwidth*0.02 && Math.abs(this.player.y - this.input.activePointer.y) < screenheight*0.02) {
                {
                    this.player.body.velocity.setTo(0, 0);
                    this.player.anims.play('idle' + face, true);
                }
            }

            // Run the correct animation based on where the player is and where the screen was touched.
            // If horizontal distance > vertical distance, play the correct left or right animation.
            // If vertical distance > horizontal distance, play the correct up or down animation.
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
        }

        // If player overlaps with the object3, call hit_object3()
        if (this.physics.overlap(this.player, this.object3)) {
            this.hit_object3();
        }
        // If player overlaps with the object1, call hit_object1()
        if (this.physics.overlap(this.player, this.object1)) {
            this.hit_object1();
        }
        // If player overlaps with the object2, call hit_object2()
        if (this.physics.overlap(this.player, this.object2)) {
            this.hit_object2();
        }
        // If player overlaps with the object5, call hit_object5()
        if (this.physics.overlap(this.player, this.object5_1)) {
            this.hit_object5(this.object5_1);
        }
        if (this.physics.overlap(this.player, this.object5_2)) {
            this.hit_object5(this.object5_2);
        }
        if (this.physics.overlap(this.player, this.object5_3)) {
            this.hit_object5(this.object5_3);
        }
        // If player overlaps with the object4, call hit_object4()
        if (this.physics.overlap(this.player, this.object4)) {
            this.hit_object4();
        }

        if (this.timer > 0) {
            setTimeout(this.decrement(), 10000);
        }
    }


    // Score incremental functions

    hit_object1() {
        //Play tween animation
        this.playtween(this.object1, +5);
        // Change the position of object1 randomly
        this.object1.x = Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85);
        this.object1.y = Phaser.Math.Between(screenheight * 0.10, screenheight - 112);

        // Increment the score
        this.score += 5;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);

        // Increment object1 count
        this.object1count += 1;

        // Play sound effect
        this.sound.playAudioSprite('sfx_game1', 'sfx_coin_double1');
    }

    hit_object2() {
        //Play tween animation
        this.playtween(this.object2, +3);
        // Change the position of the cheese randomly
        this.object2.x = Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85);
        this.object2.y = Phaser.Math.Between(screenheight * 0.10, screenheight - 112);

        // Increment the score
        this.score += 3;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);

        // Increment object2 count
        this.object2count += 1;

        // Play sound effect
        this.sound.playAudioSprite('sfx_game1', 'sfx_coin_double1');
    }

    hit_object3() {
        //Play tween animation
        this.playtween(this.object3, +1);
        // Change the position of the cheese randomly
        this.object3.x = Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85);
        this.object3.y = Phaser.Math.Between(screenheight * 0.10, screenheight - 112);

        // Increment the score
        this.score += 1;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);

        // Increment cheese count
        this.object3count += 1;

        // Play sound effect
        this.sound.playAudioSprite('sfx_game1', 'sfx_coin_double1');
    }


    hit_object4() {
        //Play tween animation
        this.playtween(this.object4, -1);
        // Change the position of the cheese randomly
        this.object4.x = Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85);
        this.object4.y = Phaser.Math.Between(screenheight * 0.10, screenheight - 112);

        // Increment the score
        this.score -= 1;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);

        // Increment fish count
        this.object4count += 1;

        // Play sound effect
        this.sound.playAudioSprite('sfx_game1', 'sfx_sounds_damage1');
    }


    hit_object5(object) {
        //Play tween animation
        this.playtween(object, -2);
        // Change the position of the cheese randomly
        object.x = Phaser.Math.Between(screenwidth * 0.10, screenwidth * 0.85);
        object.y = Phaser.Math.Between(screenheight * 0.10, screenheight - 112);

        // Increment the score
        this.score -= 2;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);

        // Increment broccoli count
        this.object5count += 1;

        // Play sound effect
        this.sound.playAudioSprite('sfx_game1', 'sfx_sounds_damage1');
    }

    playtween(food, score) {
        let scoreTween;
        if (score >= 0) {
            scoreTween = this.add.text(food.x, food.y, '+' + score, {
                font: '24px Black',
                fill: '#008000',
                strokeThickness: 1
            });
        }

        else {
            scoreTween = this.add.text(food.x, food.y, score, {
                font: '24px Black',
                fill: '#ff0000',
                strokeThickness: 1
            });
        }

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
            this.sound.removeByKey('sfx_game1');
            this.scene.stop();
            this.scene.launch('endMiniGame', {score: this.score, objects: {[this.object1name]: this.object1count, [this.object2name]: this.object2count, [this.object3name]: this.object3count, [this.object4name]: this.object4count, [this.object5name]: this.object5count}})
        }
    }
}