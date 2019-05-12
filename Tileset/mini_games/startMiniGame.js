import minigame3 from './game3.js'

class startMiniGame{

    preload(){
        this.load.image('background', './assets/sky.png');
        this.load.image('play_button', '../assets/play_button.png');
    }

    create(){
        this.background = this.add.image(0, 0, 'background').setOrigin(0).setDepth(0);
        this.play = this.add.image(screenwidth * 0.5, screenheight * 0.5, 'play_button').setScale(0.5, 0.5).setInteractive();
        this.add.text(screenwidth * 0.4, screenheight * 0.15, 'How to Play:');

        this.play.on('pointerdown', ()=>{
            this.scene.start('minigame3');
        })
    }

    update(){

    }
}

const screenwidth = window.innerHeight * 0.75;
const screenheight = window.innerHeight;

const config = {
    type: Phaser.AUTO,
    width: screenwidth,
    height: screenheight,
    scene: [startMiniGame, minigame3],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 150},
        }
    }
};

let game = new Phaser.Game(config);