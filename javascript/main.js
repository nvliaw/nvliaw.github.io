// Main function, boots all the files together

import Boot from './boot.js'
import MainHouse from './mainHouse.js'
import MiniGame1 from './minigame1.js'
import MiniGame2 from './minigame2.js'
import MiniGame3 from './minigame3.js'
import startMiniGame from './startMiniGame.js'
import endMiniGame from './endMiniGame.js'
import Endgame from './endGame.js'
import Leaderboard from './leaderboard.js'
import dialogue from './dialogue.js'
import About from './about.js'
import Henry from './profiles/henry.js'
import Nick from './profiles/nick.js'
import Geoff from './profiles/geoff.js'
import Frances from './profiles/frances.js'
import Alberto from './profiles/alberto.js'
import Story from './story.js'

const config = {
    type: Phaser.AUTO, // Which renderer to use
    parent: "game-container",
    scene: [Boot, MainHouse, MiniGame1, MiniGame2, dialogue, startMiniGame, endMiniGame, MiniGame3, Endgame, Leaderboard, About,
    Henry, Nick, Frances, Geoff, Alberto, Story],
    scale: {
        parent: "game-container",
        mode: Phaser.Scale.ENVELOP,
        width: window.innerWidth,
        height: window.innerHeight
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