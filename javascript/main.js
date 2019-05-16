import Boot from './boot.js'
import MainHouse from './mainHouse.js'
import MiniGame1 from './minigame1.js'
import MiniGame2 from './minigame2.js'
import dialogue from './dialogue.js'
import startMiniGame from './startMiniGame.js'
import MiniGame3 from './minigame3.js'
import Endgame from './endGame.js'
import Leaderboard from './leaderboard.js'



const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;

const config = {
    type: Phaser.AUTO, // Which renderer to use
    parent: "game-container",
    scene: [Boot, MainHouse, MiniGame1, MiniGame2, dialogue, startMiniGame, MiniGame3, Endgame, Leaderboard],
    scale: {
        parent: "game-container",
        mode: Phaser.Scale.ENVELOP,
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
    pixelArt: true,
};

let game = new Phaser.Game(config);