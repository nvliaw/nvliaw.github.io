// Transition scene after minigame
const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;

export default class endMiniGame extends Phaser.Scene {

    constructor() {
        super({key: 'endMiniGame'});
    }

    // Collect data passed to this scene
    init(data) {
        this.score = data.score;
        this.objects = data.objects;
        this.taps = data.taps;
        this.game = data.game;
    }

    preload() {
        // Method that's called at the beginning that loads all my assets (sprites, sounds, etc)
        this.load.image('background', './sprite/sky.png');
        this.load.image('button', './sprite/button.png');
    }

    create() {
        // Create the sky background.
        this.background = this.physics.add.staticImage(0, 0, 'background');
        this.background.setScale(2);
        this.background.setOrigin(0).setDepth(0);

        // Create and position text for the total score
        this.scoreTween = this.add.text(-100, screenheight * 0.20, 'Score: ' + this.score, {
            font: '4em White',
            strokeThickness: 1
        });
        this.scoreTween.setOrigin(0.5, 0.5);
        // Add tween animation to the total score
        this.scoreTween = this.tweens.add({
            targets: this.scoreTween,
            x: screenwidth / 2,
            ease: 'Cubic.easeInOut',
            duration: 1500,
        });
        setTimeout(this.tweenDetails, 1000, this);
    }

    tweenDetails(scene) {

        let list_of_objects = Object.keys(scene.objects);
        let list_of_scores_collecting = [5, 3, 1, -1, -2];
        let list_of_scores_tapping = [10, 8, 6, 4, 2];

        // Create the detail listings based on information passed to the scene.

        // If a taps value was passed to the scene, include a total taps lines.
        if (scene.taps) {
            // Create text for the number of taps
            scene.tapTween = scene.add.text(-100, screenheight * 0.275, 'Taps: ' + scene.taps, {
                font: '2em White',
                strokeThickness: 1
            });
            scene.tapTween.setOrigin(0.5, 0.5);
            // Add tween to number of taps
            scene.tapTween = scene.tweens.add({
                targets: scene.tapTween,
                x: screenwidth / 2,
                ease: 'Cubic.easeInOut',
                duration: 1500,
            });
            // Loop through each object passed to the scene and create text based on the object name and score achieved.
            for (let i = 1; i <= Object.keys(scene.objects).length; i++) {
                let name_of_object = list_of_objects[i - 1];
                let count_of_object = scene.objects[name_of_object];
                scene.detailTween = scene.add.text(-100, screenheight * (0.275 + (i * 0.075)), name_of_object + ": " + count_of_object + ' x ' + list_of_scores_tapping[i - 1] + ' = ' + count_of_object * list_of_scores_tapping[i - 1], {
                    font: '2em White',
                    strokeThickness: 1
                });
                scene.detailTween.setOrigin(0.5, 0.5);
                scene.detailTween = scene.tweens.add({
                    targets: scene.detailTween,
                    x: screenwidth / 2,
                    ease: 'Cubic.easeInOut',
                    duration: 1500,
                })
            }
        }
        // Else if a game name called jump was passed in, adjust the score values
        else if (scene.game === 'jump') {
            // Loop through each object passed to the scene and create text based on the object name and score achieved.
            for (let i = 1; i <= Object.keys(scene.objects).length; i++) {
                let name_of_object = list_of_objects[i - 1];
                let count_of_object = scene.objects[name_of_object];
                scene.detailTween = scene.add.text(-100, screenheight * (0.20 + (i * 0.075)), name_of_object + ": " + count_of_object + ' x ' + list_of_scores_collecting[i - 1]*3 + ' = ' + count_of_object * list_of_scores_collecting[i - 1]*3, {
                    font: '2em White',
                    strokeThickness: 1
                });
                scene.detailTween.setOrigin(0.5, 0.5);
                scene.detailTween = scene.tweens.add({
                    targets: scene.detailTween,
                    x: screenwidth / 2,
                    ease: 'Cubic.easeInOut',
                    duration: 1500,
                })
            }
        }
        // Else display the normal set of minigame details
        else {
            // Loop through each object passed to the scene and create text based on the object name and score achieved.
            for (let i = 1; i <= Object.keys(scene.objects).length; i++) {
                let name_of_object = list_of_objects[i - 1];
                let count_of_object = scene.objects[name_of_object];
                scene.detailTween = scene.add.text(-100, screenheight * (0.20 + (i * 0.075)), name_of_object + ": " + count_of_object + ' x ' + list_of_scores_collecting[i - 1] + ' = ' + count_of_object * list_of_scores_collecting[i - 1], {
                    font: '2em White',
                    strokeThickness: 1
                });
                scene.detailTween.setOrigin(0.5, 0.5);
                scene.detailTween = scene.tweens.add({
                    targets: scene.detailTween,
                    x: screenwidth / 2,
                    ease: 'Cubic.easeInOut',
                    duration: 1500,
                })
            }
        }
        scene.tweenEnd();
    }

    tweenEnd() {
        // Returns to the house when button is pressed
        let back_button = this.add.image(screenwidth / 2, screenheight * 0.8, 'button').setInteractive();
        back_button.setOrigin(0.5, 0.5);
        back_button.setFrame(17);
        back_button.setScale(2, 2);

        back_button.on('pointerup', () => {
            this.scene.stop();
            this.scene.wake('MainHouse', {score: this.score, checkGame: true});
        });

        back_button.on('pointerover', () => {
            back_button.frame = back_button.scene.textures.getFrame('button', 18);
        });

        back_button.on('pointerout', () => {
            back_button.frame = back_button.scene.textures.getFrame('button', 17);
        });

        back_button.on('pointerdown', () => {
            back_button.frame = back_button.scene.textures.getFrame('button', 19);
        });
    }
}