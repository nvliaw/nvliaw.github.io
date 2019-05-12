import Boot from './boot.js'
import MainHouse from './mainHouse.js'
import MiniGame1 from './minigame1.js'
import MiniGame2 from './minigame2.js'
import testText from '../mini_games/testText.js'


const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;

const config = {
    type: Phaser.AUTO, // Which renderer to use
    parent: "game-container",
    scene: [Boot, MainHouse, MiniGame1, MiniGame2, testText],
    scale: {
        parent: "game-container",
        mode: Phaser.Scale.FIT,
        width: screenwidth,
        height: screenheight
    },
    physics: {
        default: 'arcade',
        // Set gravity to 0 because it is a top-down game (no gravity needed).
        arcade: {
            gravity: { y: 0},
        }
    },
    backgroundColor: '#000000'
};

let game = new Phaser.Game(config);