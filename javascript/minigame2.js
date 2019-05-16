// Tapping mini game

const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;

export default class MiniGame2 extends Phaser.Scene {


    constructor() {
        super({key: 'MiniGame2'});
    }

    // Grabs data passed from other modules that determine which object was clicked (fridge, TV, or garbage)
    init(data) {
        this.object = data.object;
    }

    preload() {

        // Method that's called at the beginning that loads all my assets (sprites, sounds, etc)
        // Preload hero //
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
        let objectData = [
            {name: "Object1", imageNum: 4, maxHP: 2},
            {name: "Object2", imageNum: 3, maxHP: 4},
            {name: "Object3", imageNum: 2, maxHP: 6},
            {name: "Object4", imageNum: 1, maxHP: 8},
            {name: "Object5", imageNum: 0, maxHP: 10},
        ];

        let objects = this.physics.add.group();

        objectData.forEach(function(data){
            let object = objects.create(screenwidth*2, screenheight*2, this.object + "set", data.imageNum);
            // tree.anchor.setTo(0.5);
            object.setScale(10,10);
            object.details = data;

            // Incorporating the tree's "health"
            object.health = object.maxHP = data.maxHP;

            // Allows clicking input
            object.setInteractive();
            object.on('pointerdown', function() {

                // Increase score by 1 for each click
                this.player.score += 1;
                object.health -= 1;

                if (object.health === 0) {
                    this.player.score += object.maxHP;
                    MiniGame2.prototype.playBigTween(this, currentObject);
                    object.health = object.maxHP;
                    object.x = screenwidth*2;
                    object.y = screenheight*2;
                    currentObject = allObjects[Phaser.Math.Between(0,2)];
                    currentObject.x = screenwidth/2;
                    currentObject.y = screenheight/2;
                    console.log(currentObject.details.name)
                }

                // update the player's score text
                scoreText.text = "Score: " + this.player.score;
                // MiniGame2.prototype.updateScore(this.player.score);
                MiniGame2.prototype.playtween(this, currentObject);
            }, this);
        }, this);

        // Get a random tree to chop down in the center of the screen
        let allObjects = objects.getChildren();
        var currentObject = allObjects[Phaser.Math.Between(0,2)];
        currentObject.x = screenwidth/2;
        currentObject.y = screenheight/2;
        let objectNameText = this.add.text(currentObject.x, screenheight*0.75, currentObject.details.name, {
            font: '3.5em Arial Black',
            fill: '#fff',
            strokeThickness: 1
        });
        objectNameText.setPosition(currentObject.x, currentObject.y + 200);
        objectNameText.setOrigin(0.5, 0.5);
        let objectHealthText = this.add.text(screenwidth/2, screenheight*0.92, currentObject.health + ' HP', {
            font: '3.5em Arial Black',
            fill: '#fff',
            strokeThickness: 1
        });
        objectHealthText.setOrigin(0.5, 0.5);

        // Represents the player
        this.player = {
            clickDamage: 1,
            score: 0
        };

        // Show the score on screen
        let scoreText = this.add.text(screenwidth*0.05, screenheight*0.02 , "Score: " + this.player.score, {
            font: '3em Arial Black',
            fill: '#fff',
            strokeThickness: 1
        });
        scoreText.setOrigin(0, 0);

        // Timer on the top right of the screen
        this.timer = 200;
        this.timerText = this.add.text(screenwidth*0.05, screenheight*0.1, 'Time left: ' + this.timer, {
            font: '3em Arial Black',
            fill: '#fff',
            strokeThickness: 1
        });
        this.timerText.setOrigin(0, 0)
    }

    update() {
        if (this.timer > 0){
            this.decrement();
        }
        if (this.timer === 0){
            this.scene.sleep();
        }
    }

    decrement() {
        this.timer -= 1;
        this.timerText.setText('Time left: ' + this.timer);
        if (this.timer === 0) {
            this.scene.stop();
            this.scene.wake('MainHouse', {score: this.player.score,
                checkGame: true});
        }
    }

    // Shows the damage text when clicking
    playtween(scene, currentObject) {
        let dmgText = scene.add.text(currentObject.x + Phaser.Math.Between(-25, 25), currentObject.y, '1', {
            font: '64px Arial Black',
            fill: '#fff',
            strokeThickness: 1
        });

        dmgText.exists = false;
        dmgText.tween = scene.tweens.add({
            targets: dmgText,
            alpha: 0,
            x: currentObject.x + Phaser.Math.Between(-100, 100),
            y: currentObject.y + Phaser.Math.Between(-250, -100),
            ease: 'Cubic.easeInOut',
            duration: 1500,
            repeat: 0,
            yoyo: false
        });
    }

    // Tween for when an object is defeated
    playBigTween(scene, currentObject) {
        let dmgText = scene.add.text(currentObject.x + Phaser.Math.Between(-25, 25), currentObject.y, currentObject.maxHP, {
            font: '128px Arial Black',
            fill: '#008000',
            strokeThickness: 1
        });

        dmgText.exists = false;
        dmgText.tween = scene.tweens.add({
            targets: dmgText,
            alpha: 0,
            x: screenwidth*0.1,
            y: screenheight*0.02,
            ease: 'Cubic.easeInOut',
            duration: 1500,
            repeat: 0,
            yoyo: false
        });
    }
}