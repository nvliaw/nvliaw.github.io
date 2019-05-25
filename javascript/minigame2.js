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
        this.load.audioSprite('sfx_game2', './audio/minigame2.json', ['audio/minigame2.mp3', 'audio/minigame2.ogg', 'audio/minigame2.m4a', 'audio/minigame2.ac3']);

    }

    create() {
        this.background = this.physics.add.staticImage(0, 0, 'background');
        this.background.setScale(2);
        this.background.setOrigin(0).setDepth(0);

        this.objectnames = {'foodset': ['Meat', 'Rice', 'Cheese', 'Fish', 'Broccoli'],
            'shoppingset': ['Face Wash', 'Razor', 'Toothbrush', 'Cloth', 'Soap'],
            'trashset': ['Plastic Cutlery', 'Saran Wrap', 'Napkins', 'Tea Bags', 'Apple Core']};

        this.selectedSet = this.object + 'set';


        // Score tracker (Number of clicks + number of kills of each object);
        this.clickcount = 0;
        this.killcount = {[this.objectnames[this.selectedSet][0]]: 0,
                          [this.objectnames[this.selectedSet][1]]: 0,
                          [this.objectnames[this.selectedSet][2]]: 0,
                          [this.objectnames[this.selectedSet][3]]: 0,
                          [this.objectnames[this.selectedSet][4]]: 0};

        // Assign each sprite an image number and maximum HP value.
        let objectData = [
            {name: this.objectnames[this.selectedSet][0], imageNum: 0, maxHP: 10},
            {name: this.objectnames[this.selectedSet][1], imageNum: 1, maxHP: 8},
            {name: this.objectnames[this.selectedSet][2], imageNum: 2, maxHP: 6},
            {name: this.objectnames[this.selectedSet][3], imageNum: 3, maxHP: 4},
            {name: this.objectnames[this.selectedSet][4], imageNum: 4, maxHP: 2},
        ];

        let objects = this.physics.add.group();

        // Loop through each object
        objectData.forEach(function(data){
            let object = objects.create(screenwidth*2, screenheight*2, this.selectedSet, data.imageNum);
            object.setScale(10,10);
            object.details = data;

            // Incorporating the object's "health"
            object.health = object.maxHP = data.maxHP;

            // Allows tapping input
            object.setInteractive();
            object.on('pointerdown', function() {

                // Decrease HP by 1 each tap & increase counter.
                object.health -= 1;
                this.clickcount += 1;

                // Play sound effect when clicked
                this.sound.playAudioSprite('sfx_game2', 'sfx_wpn_punch3');

                // When an object is killed, add max hp to score, increment kill count, reset object, then pick a new object to be killed.
                if (object.health === 0) {
                    this.player.score += object.maxHP;
                    this.killcount[object.details.name] += 1;
                    MiniGame2.prototype.playBigTween(this, currentObject);
                    object.health = object.maxHP;
                    object.x = screenwidth * 2;
                    object.y = screenheight * 2;
                    currentObject = allObjects[Phaser.Math.Between(0, 2)];
                    currentObject.x = screenwidth / 2;
                    currentObject.y = screenheight / 2;
                    objectNameText.setText(currentObject.details.name)
                }

                // update the player's score text
                scoreText.text = "Score: " + this.player.score;
                objectHealthText.setText(object.health + ' HP');
                MiniGame2.prototype.playtween(this, currentObject);
            }, this);
        }, this);

        // Get a random object to kill in the center of the screen
        let allObjects = objects.getChildren();
        var currentObject = allObjects[Phaser.Math.Between(0,2)];
        currentObject.x = screenwidth/2;
        currentObject.y = screenheight/2;
        let objectNameText = this.add.text(currentObject.x, screenheight*0.75, currentObject.details.name, {
            font: '2.5em Black',
            fill: '#fff',
            strokeThickness: 1
        });

        // Create and set the name based on the active object.
        objectNameText.setOrigin(0.5, 0.5);
        let objectHealthText = this.add.text(screenwidth/2, screenheight*0.92, currentObject.health + ' HP', {
            font: '2.5em Black',
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
            font: '3em Black',
            fill: '#fff',
            strokeThickness: 1
        });
        scoreText.setOrigin(0, 0);

        // Timer on the top right of the screen
        this.timer = 500;
        this.timerText = this.add.text(screenwidth*0.05, screenheight*0.1, 'Time left: ' + this.timer, {
            font: '3em Black',
            fill: '#fff',
            strokeThickness: 1
        });
        this.timerText.setOrigin(0, 0);

        // Create and play audio
        let audiomap = this.cache.json.get('sfx_game2').spritemap;
        this.sound.playAudioSprite('sfx_game2', 'bubblebobble', { loop: true });
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
            this.sound.removeByKey('sfx_game2');
            this.scene.launch('endMiniGame', {score: this.player.score, taps: this.clickcount, objects: this.killcount})
        }
    }

    // Shows the damage text when clicking
    playtween(scene, currentObject) {
        let dmgText = scene.add.text(currentObject.x + Phaser.Math.Between(-25, 25), currentObject.y, '1', {
            font: '64px Black',
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
        let dmgText = scene.add.text(currentObject.x + Phaser.Math.Between(-25, 25), currentObject.y, '+' + currentObject.maxHP, {
            font: '64px Black',
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