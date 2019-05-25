const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;

export default class MiniGame3 extends Phaser.Scene {

    constructor() {
        super({key: 'MiniGame3'});
    }

    // Grabs data passed from other modules that determine which object was clicked (fridge, TV, or garbage)
    init(data) {
        this.object = data.object;
    }

    preload() {
        // Preload all images, sprites, and audio
        this.load.image('background', './sprite/sky.png');
        this.load.image('platform', './sprite/platform.png');
        this.load.audioSprite('sfx_game1', './audio/minigame.json', ['audio/minigame.mp3', 'audio/minigame.ogg', 'audio/minigame.m4a', 'audio/minigame.ac3']);
    }

    create() {
        this.objectnames = {'foodset': ['Meat', 'Rice', 'Cheese', 'Fish', 'Broccoli'],
            'shoppingset': ['Face Wash', 'Razor', 'Toothbrush', 'Cloth', 'Soap'],
            'trashset': ['Plastic Cutlery', 'Saran Wrap', 'Tea Bags', 'Napkins', 'Apple Core']};

        this.selectedSet = this.object + 'set';

        //Create background, platform, and objects needed for the minigame
        this.background = this.physics.add.staticImage(0, 0, 'background');
        this.background.setScale(2);
        this.background.setOrigin(0).setDepth(0);
        this.player = this.physics.add.sprite(screenwidth * 0.1, screenheight * 0.47, 'hero', 8);
        this.platform = this.physics.add.staticSprite(screenwidth * 0.5, screenheight * 0.547, 'platform');

        // prevents platform from being moved
        this.platform.setImmovable();

        // Add gravity to this minigame which will affect the player.
        this.player.body.gravity.y = 300;

        // Initialize score
        this.score = 0;
        this.score_text = this.add.text(screenwidth * 0.5, screenheight * 0.1, 'Score: ' + this.score);
        this.score_text.setOrigin(0.5);

        // Set time
        this.time = 600;
        this.timeText = this.add.text(screenwidth * 0.5, screenheight * 0.15, 'Time: ' + this.time);
        this.timeText.setOrigin(0.5);

        this.physics.add.collider(this.player, this.platform);

        // prevents camera from going past boundaries
        this.cameras.main.setBounds(0, 0, screenwidth, screenheight);
        // makes camera follow player
        this.cameras.main.startFollow(this.player);

        this.object3 = this.physics.add.sprite(screenwidth * 2, screenheight * 0.4, this.selectedSet, 2);
        this.object3.setVelocityX(-500);
        this.object3name = this.objectnames[this.selectedSet][2];
        this.object3count = 0;

        this.object2 = this.physics.add.sprite(screenwidth * 2, screenheight * 0.51, this.selectedSet, 1);
        this.object2.setVelocityX(-500);
        this.object2name = this.objectnames[this.selectedSet][1];
        this.object2count = 0;

        this.object5 = this.physics.add.sprite(screenwidth * 4.5, screenheight * 0.4, this.selectedSet, 4);
        this.object5.setVelocityX(-400);
        this.object5name = this.objectnames[this.selectedSet][4];
        this.object5count = 0;


        this.object1 = this.physics.add.sprite(screenwidth * 4.5, screenheight * 0.51, this.selectedSet, 0);
        this.object1.setVelocityX(-400);
        this.object1name = this.objectnames[this.selectedSet][0];
        this.object1count = 0;

        this.object4 = this.physics.add.sprite(screenwidth * 7, screenheight * 0.4, this.selectedSet, 3);
        this.object4.setVelocityX(-425);
        this.object4name = this.objectnames[this.selectedSet][3];
        this.object4count = 0;

        this.object3_2 = this.physics.add.sprite(screenwidth * 7, screenheight * 0.51, this.selectedSet, 2);
        this.object3_2.setVelocityX(-425);

        this.object2_2 = this.physics.add.sprite(screenwidth * 9.5, screenheight * 0.4, this.selectedSet, 1);
        this.object2_2.setVelocityX(-400);
        this.object5_2 = this.physics.add.sprite(screenwidth * 9.5, screenheight * 0.51, this.selectedSet, 4);
        this.object5_2.setVelocityX(-400);

        this.object1_2 = this.physics.add.sprite(screenwidth * 12, screenheight * 0.4, this.selectedSet, 0);
        this.object1_2.setVelocityX(-450);
        this.object4_2 = this.physics.add.sprite(screenwidth * 12, screenheight * 0.51, this.selectedSet, 3);
        this.object4_2.setVelocityX(-450);

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
        this.object1text = this.add.text(0, 32, '+15', {
            font: '16px Black',
            strokeThickness: 1
        }).setOrigin(0.5, 0.5);
        this.object2text = this.add.text(0, 32, '+9', {
            font: '16px Black',
            strokeThickness: 1
        }).setOrigin(0.5, 0.5);
        this.object3text = this.add.text(0, 32, '+3', {
            font: '16px Black',
            strokeThickness: 1
        }).setOrigin(0.5, 0.5);
        this.object4text = this.add.text(0, 32, '-3', {
            font: '16px Black',
            strokeThickness: 1
        }).setOrigin(0.5, 0.5);
        this.object5text = this.add.text(0, 32, '-6', {
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

        let audiomap = this.cache.json.get('sfx_game1').spritemap;

        this.sound.playAudioSprite('sfx_game1', 'bubblebobble', { loop: true });
    }

    update() {
        // If screen is touched and player is touching platform, make the player jump.
        if (this.input.activePointer.isDown && this.player.body.touching.down) {  // if mouse clicked and player touching platform
            this.player.setVelocityY(-200);  // move up Y axis
        }

        if (this.physics.overlap(this.player, this.object3)){
            this.touch_object3(this.object3);
        }
        if (this.physics.overlap(this.player, this.object3_2)){
            this.touch_object3(this.object3_2);
        }

        if (this.physics.overlap(this.player, this.object2)){
            this.touch_object2(this.object2);
        }
        if (this.physics.overlap(this.player, this.object2_2)){
            this.touch_object2(this.object2_2);
        }

        if (this.physics.overlap(this.player, this.object1)){
            this.touch_object1(this.object1);
        }
        if (this.physics.overlap(this.player, this.object1_2)){
            this.touch_object1(this.object1_2);
        }

        if (this.physics.overlap(this.player, this.object5)){
            this.touch_object5(this.object5);
        }
        if (this.physics.overlap(this.player, this.object5_2)){
            this.touch_object5(this.object5_2);
        }

        if (this.physics.overlap(this.player, this.object4)){
            this.touch_object4(this.object4);
        }
        if (this.physics.overlap(this.player, this.object4_2)){
            this.touch_object4(this.object4_2);
        }
        this.countdown();
    }

    countdown() {
        this.time -= 1;
        this.timeText.setText('Time: ' + this.time);
        if (this.time === 0) {
            this.time = 0;
            this.sound.removeByKey('sfx_game1');
            this.scene.stop();
            this.scene.launch('endMiniGame', {score: this.score, game: 'jump', objects: {[this.object1name]: this.object1count, [this.object2name]: this.object2count, [this.object3name]: this.object3count, [this.object4name]: this.object4count, [this.object5name]: this.object5count}});
        }
    }

    touch_object3(object) {
        this.playtween(object, +3);
        object.destroy();
        // adds 3 to score
        this.score += 3;
        // changes text of score_text
        this.score_text.setText('Score: ' + this.score);
        this.object3count += 1;
        this.sound.playAudioSprite('sfx_game1', 'sfx_coin_double1');
    }

    touch_object2(object){
        this.playtween(object, +9);
        object.destroy();
        this.score += 9;
        this.score_text.setText('Score: ' + this.score);
        this.object2count += 1;
        this.sound.playAudioSprite('sfx_game1', 'sfx_coin_double1');
    }

    touch_object1(object){
        this.playtween(object, +15);
        object.destroy();
        this.score += 15;
        this.score_text.setText('Score: ' + this.score);
        this.object1count += 1;
        this.sound.playAudioSprite('sfx_game1', 'sfx_coin_double1');
    }

    touch_object5(object){
        this.playtween(object, -6);
        object.destroy();
        this.score -= 6;
        this.score_text.setText('Score: ' + this.score);
        this.object5count += 1;
        this.sound.playAudioSprite('sfx_game1', 'sfx_sounds_damage1');
    }

    touch_object4(object){
        this.playtween(object, -3);
        object.destroy();
        this.score -= 3;
        this.score_text.setText('Score: ' + this.score);
        this.object4count += 1;
        this.sound.playAudioSprite('sfx_game1', 'sfx_sounds_damage1');
    }

    playtween(object, score) {
        let scoreTween;
        if (score >= 0) {
            scoreTween = this.add.text(object.x, object.y, '+' + score, {
                font: '24px Black',
                fill: '#008000',
                strokeThickness: 1
            });
        }
        else {
            scoreTween = this.add.text(object.x, object.y, score, {
                font: '24px Black',
                fill: '#ff0000',
                strokeThickness: 1
            });
        }
        scoreTween.exists = false;
        scoreTween.tween = this.tweens.add({
            targets: scoreTween,
            alpha: 0,
            x: this.score_text.x + this.score_text.displayWidth - 10,
            y: 20,
            ease: 'Cubic.easeInOut',
            duration: 2200,
            repeat: 0,
            yoyo: false
        });
    }
}