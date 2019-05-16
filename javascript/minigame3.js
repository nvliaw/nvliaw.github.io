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
        this.physics.config.gravity = 300;
        this.load.image('background', 'assets/sky.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.spritesheet('hero',
            'sprite/hero.png',
            {frameWidth: 32, frameHeight: 46}
        );

        // Preload the correct spritesheet
        this.load.spritesheet('foodset',
            'sprite/food.png',
            {frameWidth: 32, frameHeight: 32});

        this.load.spritesheet('shoppingset',
            'sprite/shopping.png',
            {frameWidth: 32, frameHeight: 32});

        this.load.spritesheet('trashset',
            'sprite/trash.png',
            {frameWidth: 32, frameHeight: 32});
    }

    create() {
        this.background = this.physics.add.staticImage(0, 0, 'background');
        this.background.setScale(2);
        this.background.setOrigin(0).setDepth(0);
        this.player = this.physics.add.sprite(screenwidth * 0.1, screenheight * 0.47, 'hero', 8);
        this.platform = this.physics.add.staticSprite(screenwidth * 0.5, screenheight * 0.547, 'platform');
        // prevents platform from being moved
        this.platform.setImmovable();
        this.player.body.gravity.y = 300;

        // sets score to 0
        this.score = 0;
        this.score_text = this.add.text(screenwidth * 0.45, screenheight * 0.1, 'Score: ' + this.score);

        this.time = 600;
        this.timeText = this.add.text(screenwidth * 0.45, screenheight * 0.15, 'Time: ' + this.time);

        this.physics.add.collider(this.player, this.platform);

        // prevents camera from going past boundaries
        this.cameras.main.setBounds(0, 0, screenwidth, screenheight);
        // makes camera follow player
        this.cameras.main.startFollow(this.player);


        this.cheese = this.physics.add.sprite(screenwidth * 2, screenheight * 0.4, this.object + 'set', 2);
        this.cheese.setVelocityX(-500);
        this.rice = this.physics.add.sprite(screenwidth * 2, screenheight * 0.51, this.object + 'set', 1);
        this.rice.setVelocityX(-500);

        this.broccoli = this.physics.add.sprite(screenwidth * 4.5, screenheight * 0.4, this.object + 'set', 4);
        this.broccoli.setVelocityX(-400);
        this.steak = this.physics.add.sprite(screenwidth * 4.5, screenheight * 0.51, this.object + 'set', 6);
        this.steak.setVelocityX(-400);

        this.fish = this.physics.add.sprite(screenwidth * 7, screenheight * 0.4, this.object + 'set', 3);
        this.fish.setVelocityX(-425);
        this.cheese_2 = this.physics.add.sprite(screenwidth * 7, screenheight * 0.51, this.object + 'set', 2);
        this.cheese_2.setVelocityX(-425);

        this.rice_2 = this.physics.add.sprite(screenwidth * 9.5, screenheight * 0.4, this.object + 'set', 1);
        this.rice_2.setVelocityX(-400);
        this.broccoli_2 = this.physics.add.sprite(screenwidth * 9.5, screenheight * 0.51, this.object + 'set', 4);
        this.broccoli_2.setVelocityX(-400);

        this.steak_2 = this.physics.add.sprite(screenwidth * 12, screenheight * 0.4, this.object + 'set', 6);
        this.steak_2.setVelocityX(-450);
        this.fish_2 = this.physics.add.sprite(screenwidth * 12, screenheight * 0.51, this.object + 'set', 3);
        this.fish_2.setVelocityX(-450);
    }

    update() {
        if (this.input.activePointer.isDown && this.player.body.touching.down) {  // if mouse clicked and player touching platform
            this.player.setVelocityY(-200);  // move up Y axis
        }

        if (this.physics.overlap(this.player, this.cheese)){
            this.touch_cheese();
        }
        if (this.physics.overlap(this.player, this.cheese_2)){
            this.touch_cheese_2();
        }

        if (this.physics.overlap(this.player, this.rice)){
            this.touch_rice();
        }
        if (this.physics.overlap(this.player, this.rice_2)){
            this.touch_rice_2();
        }

        if (this.physics.overlap(this.player, this.steak)){
            this.touch_steak();
        }
        if (this.physics.overlap(this.player, this.steak_2)){
            this.touch_steak_2();
        }

        if (this.physics.overlap(this.player, this.broccoli)){
            this.touch_broccoli();
        }
        if (this.physics.overlap(this.player, this.broccoli_2)){
            this.touch_broccoli_2();
        }

        if (this.physics.overlap(this.player, this.fish)){
            this.touch_fish();
        }
        if (this.physics.overlap(this.player, this.fish_2)){
            this.touch_fish_2();
        }

        this.countdown();
    }

    countdown() {
        this.time -= 1;
        this.timeText.setText('Time: ' + this.time);
        if (this.time === 0) {
            // clearInterval(timeInterval);
            this.time = 0;
            this.scene.stop();
            this.scene.wake('MainHouse', {
                score: this.score,
                checkGame: true
            });
        }
    }

    touch_cheese() {
        this.playtween(this.cheese, +10);
        this.cheese.destroy();
        // adds 10 to variable score
        this.score += 10;
        // changes text of score_text
        this.score_text.setText('Score: ' + this.score);
    }

    touch_cheese_2() {
        this.playtween(this.cheese_2, +10);
        this.cheese_2.destroy();
        // adds 10 to variable score
        this.score += 10;
        // changes text of score_text
        this.score_text.setText('Score: ' + this.score);
    }

    touch_rice(){
        this.playtween(this.rice, -10);
        this.rice.destroy();
        this.score -= 10;
        this.score_text.setText('Score: ' + this.score);
    }

    touch_rice_2(){
        this.playtween(this.rice_2, -10);
        this.rice_2.destroy();
        this.score -= 10;
        this.score_text.setText('Score: ' + this.score);
    }

    touch_steak(){
        this.playtween(this.steak, +25);
        this.steak.destroy();
        this.score += 25;
        this.score_text.setText('Score: ' + this.score);
    }

    touch_steak_2(){
        this.playtween(this.steak_2, +25);
        this.steak_2.destroy();
        this.score += 25;
        this.score_text.setText('Score: ' + this.score);
    }

    touch_broccoli(){
        this.playtween(this.broccoli, -25);
        this.broccoli.destroy();
        this.score -= 25;
        this.score_text.setText('Score: ' + this.score);
    }

    touch_broccoli_2(){
        this.playtween(this.broccoli_2, -25);
        this.broccoli_2.destroy();
        this.score -= 25;
        this.score_text.setText('Score: ' + this.score);
    }

    touch_fish(){
        this.playtween(this.fish, +5);
        this.fish.destroy();
        this.score += 5;
        this.score_text.setText('Score: ' + this.score);
    }

    touch_fish_2(){
        this.playtween(this.fish_2, +5);
        this.fish_2.destroy();
        this.score += 5;
        this.score_text.setText('Score: ' + this.score);
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