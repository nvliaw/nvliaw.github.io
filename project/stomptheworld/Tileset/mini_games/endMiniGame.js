export default class endMiniGame3 extends Phaser.Scene {
    constructor() {
        super({key: 'endMiniGame3'});
    }

    preload(){
        this.load.image('background', '../assets/sky.png');
    }

    create(){
        this.add.image(0, 0, 'background').setOrigin(0);
        this.add.text(screenwidth * 0.3, screenheight * 0.1, 'SUMMARY');
    }

    update(){

    }
}

const screenwidth = window.innerHeight * 0.75;
const screenheight = window.innerHeight;

// const config = {
//     type: Phaser.AUTO,
//     width: screenwidth * 0.9,
//     height: screenheight * 0.9,
//     scene:  endMiniGame3,
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: {y: 150},
//         }
//     }
// };
