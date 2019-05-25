const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;
let topFiveScores = [];
var userId = "";

firebase.auth().onAuthStateChanged(function(user) {
    userId = user.uid;
});

export default class Leaderboard extends Phaser.Scene{
    constructor(){
        super({key: 'Leaderboard'})
    }
    preload(){
        this.load.spritesheet('start', 'sprite/start.png', {frameWidth: 48, frameHeight: 48});
        this.load.image('button', './sprite/button.png');
    }

    create(){
        let background = this.add.sprite(0, 0, 'background').setOrigin(0).setDepth(0);
        background.setScale(2);

        this.hero = this.physics.add.sprite(screenwidth*0.5, screenheight*0.25, 'hero');
        this.hero.setScale(2.5);

        this.anims.create({
            key: 'dance',
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 11}),
            frameRate: 10,
            repeat: -1
        });

        this.getAndSortScores();
        this.leaderboardText = this.add.text(screenwidth*0.5, screenheight*0.35, 'LEADERBOARD', {
            font: '4em Courier Bold',
            fill: 'white',
            strokeThickness: 2
        });
        this.leaderboardText.setOrigin(0.5);
        this.leaderboardText.setColor('black');


        // Returns to the home when button is pressed
        let home_button = this.add.image(screenwidth / 2, screenheight * 0.8, 'button').setInteractive();
        home_button.setOrigin(0.5, 0.5);
        home_button.setFrame(8);
        home_button.setScale(2, 2);

        home_button.on('pointerup', () => {
            this.scene.start('Boot');
            this.sound.removeByKey('house');
        });

        home_button.on('pointerover', () => {
            home_button.frame = home_button.scene.textures.getFrame('button', 9);
        });

        home_button.on('pointerout', () => {
            home_button.frame = home_button.scene.textures.getFrame('button', 8);
        });

        home_button.on('pointerdown', () => {
            home_button.frame = home_button.scene.textures.getFrame('button', 10);
        });
    }

    update(){
        // Make the hero dance!
        this.hero.anims.play('dance', true);

        // Load leaderboard
        for (let i =0; i < 10; i++){
            this.add.text(screenwidth*0.5, screenheight*0.45+(i*30),
                topFiveScores[i], {
                font: '2em Courier',
                fill: 'black',
                lineSpacing: '10',
                strokeThickness: 0
            }).setOrigin(0.5);
        }


    }
    // Get and sort the scores that's saved in the firebase database
    getAndSortScores(){
        let scoreBoard = [];
        const scores = firebase.database().ref().child("Users/");
        scores.once('value', function(snapshot) {
            let users = snapshot.val();
            let user_scores = Object.values(users);
            let user_names = Object.keys(users);
            for (let i = 0; i < user_names.length; i++) {
                let currentLine = [user_names[i], user_scores[i]];
                scoreBoard.push(currentLine);
            }
            // used bubble sort
            let lst = scoreBoard.length;
            for (let j = 0; j < lst; j++) {
                for (let k = 0; k < lst - j - 1; k++) {
                    // changed to sort scores from highest to lowest
                    if (scoreBoard[k][1] < scoreBoard[k + 1][1]) {
                        let temp = scoreBoard[k];
                        scoreBoard[k] = scoreBoard[k + 1];
                        scoreBoard[k + 1] = temp;
                    }
                }
            }
            topFiveScores = [];
            for(let i =0; i < 5; i++){
                topFiveScores[i] = scoreBoard[i][0] + " ---> " + scoreBoard[i][1];
            }
        });
    }
}