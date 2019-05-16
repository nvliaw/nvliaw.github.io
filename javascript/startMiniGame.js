// Transition scene into minigame

export default class startMiniGame extends Phaser.Scene {

    constructor() {
        super({key: 'startMiniGame'});
    }

    init(data) {
        this.object = data.object;
    }

    preload() {
        // Method that's called at the beginning that loads all my assets (sprites, sounds, etc)

    }

    create() {
        // Initializes our scene such as the position of the sprites
        let minigame_words = {"MiniGame1": "Collect!", "MiniGame2": "Tap!", "MiniGame3": "Jump!"};
        let random_game_number = Phaser.Math.Between(1, 3);
        this.minigame = "MiniGame" + random_game_number;


        this.actionTween = this.add.text(-100, window.innerHeight / 2, minigame_words[this.minigame], {
            font: '5em Arial White',
            strokeThickness: 1
        });
        this.actionTween.setOrigin(0.5, 0.5);
        this.actionTween.timeline = this.tweens.timeline({
            targets: this.actionTween,
            ease: 'Cubic.easeInOut',
            duration: 1500,
            onComplete: this.tweenEnd,
            tweens: [
                {
                    x: window.innerWidth / 2
                },
                {
                    x: window.innerWidth + 100
                }
            ]
        })
    }

    tweenEnd() {
        this.manager.scene.scene.stop();
        console.log(this.manager.scene.object)
        this.manager.scene.scene.launch(this.manager.scene.minigame, {object: this.manager.scene.object});
    }

    update() {
        // console.log(this.actionTween.tween.getValue())
        // console.log(this.tweens);
    }
}