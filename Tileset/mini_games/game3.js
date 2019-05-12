import endMiniGame3 from './endMiniGame.js'
export default class minigame3 extends Phaser.Scene {

    constructor() {
        super({key: 'minigame3'});
    }

    preload() {
        this.load.image('background', './assets/sky.png');
        this.load.image('player', './assets/star.png');
        this.load.image('bomb', './assets/bomb.png');
        this.load.image('platform', './assets/platform.png');
    }

    create() {
        this.background = this.physics.add.staticImage(0, 0, 'background');
        // places background in the middle of the screen and sets depth of background to 0
        this.background.setOrigin(0).setDepth(0);
        this.player = this.physics.add.sprite(screenwidth * 0.1, screenheight * 0.5, 'player');
        this.bomb = this.physics.add.sprite(screenwidth * 2, screenheight * 0.4, 'bomb');
        this.bomb.body.allowGravity = false;
        this.platform = this.physics.add.staticSprite(screenwidth * 0.45, screenheight * 0.547, 'platform');
        // prevents platform from being moved
        this.platform.setImmovable();

        // sets score to 0
        this.score = 0;
        this.score_text = this.add.text(screenwidth * 0.45, screenheight * 0.1, 'Score: ' + this.score);

        this.time = 100;
        this.timeText = this.add.text(screenwidth * 0.45, screenheight * 0.15, 'Time: ' + this.time);

        // makes bomb move left
        this.bomb.setVelocityX(-200);
        this.physics.add.collider(this.player, this.platform);

        // prevents camera from going past boundaries
        this.cameras.main.setBounds(0, 0, screenwidth, screenheight);
        // makes camera follow player
        this.cameras.main.startFollow(this.player);

        // this.countdown();

        this.results = this.add.text(screenwidth * 0.4, screenheight * 0.8, 'RESULTS').setInteractive();

        this.results.visible = false;

        this.results.on('pointerdown', ()=>{
            console.log('scac');
            this.scene.start('endMiniGame3');
        });

    }

    update() {
        if (this.input.activePointer.isDown && this.player.body.touching.down) {  // if mouse clicked
            this.player.setVelocityY(-130);  // move up Y axis
        }

        // if player touches bomb, execute touch_bomb function
        if (this.physics.overlap(this.player, this.bomb)) {
            this.touch_bomb();
        }
        this.countdown();
        this.open_results(this.results)

    }

    touch_bomb() {
        this.bomb.destroy();
        // adds 10 to variable score
        this.score += 10;
        // changes text of score_text
        this.score_text.setText('Score: ' + this.score)
    }

    countdown() {
        this.time -= 1;
        this.timeText.setText('Time: ' + this.time);
        if (this.time <= 0){
            // clearInterval(timeInterval);
            this.time = 0;
            this.scene.pause('minigame3');
            this.add.text(screenwidth * 0.3, screenheight * 0.4, 'GAME OVER', {
                font: '32px',
                color: 'purple'
            });
        }
    }
    open_results(results){
        if (this.time == 0){
            results.visible = true;
        }
    }
}

const screenwidth = window.innerHeight * 0.75;
const screenheight = window.innerHeight;

// const config = {
//     type: Phaser.AUTO,
//     width: screenwidth * 0.9,
//     height: screenheight * 0.9,
//     scene: minigame3,
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: {y: 150},
//         }
//     }
// };
//
// let game = new Phaser.Game(config);