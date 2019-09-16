// Transition scene into minigame
const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;

export default class startMiniGame extends Phaser.Scene {

    constructor() {
        super({key: 'startMiniGame'});
    }

    // Collect data passed to this scene
    init(data) {
        this.object = data.object;
    }

    preload() {
        // Method that's called at the beginning that loads all my assets (sprites, sounds, etc)
        this.load.image('background', './sprite/sky.png');

    }

    create() {
        // Create the sky background.
        this.background = this.physics.add.staticImage(0, 0, 'background');
        this.background.setScale(2);
        this.background.setOrigin(0).setDepth(0);

        let minigame_words = {"MiniGame1": "Collect!", "MiniGame2": "Tap!", "MiniGame3": "Jump!"};

        // Randomize the minigame
        let random_game_number = Phaser.Math.Between(1, 3);
        this.minigame = "MiniGame" + random_game_number;

        // Create text that corresponds to the minigame chosen
        this.actionTween = this.add.text(-150, screenheight / 2, minigame_words[this.minigame], {
            fontSize: '5em',
            strokeThickness: 1
        });
        this.actionTween.setOrigin(0.5, 0.5);
        // Add a set of 2 tweens to the text.
        this.actionTween.timeline = this.tweens.timeline({
            targets: this.actionTween,
            ease: 'Cubic.easeInOut',
            duration: 1500,
            onComplete: this.tweenEnd,
            tweens: [
                {
                    x: screenwidth / 2
                },
                {
                    x: screenwidth + 150
                }
            ]
        })
    }

    // Stop this scene and launch the correct minigame scene.
    tweenEnd() {
        this.manager.scene.scene.stop();
        this.manager.scene.scene.launch(this.manager.scene.minigame, {object: this.manager.scene.object});
    }
}