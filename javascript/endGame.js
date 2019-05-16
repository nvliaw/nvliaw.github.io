const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;

// To access Firebase leaderboard data
var firebaseConfig = {
    apiKey: "AIzaSyBFhOVCixHYLYyR0eHJEZAq3pL480gL59I",
    authDomain: "comp-2930-team-09.firebaseapp.com",
    databaseURL: "https://comp-2930-team-09.firebaseio.com",
    projectId: "comp-2930-team-09",
    storageBucket: "comp-2930-team-09.appspot.com",
    messagingSenderId: "701468886359",
    appId: "1:701468886359:web:4630972687e79482"
};
firebase.initializeApp(firebaseConfig);

var userId = "";
let full_name = "";
let first_name = ""
firebase.auth().onAuthStateChanged(function(user) {
    if (user){
        userId = user.uid;
        full_name = user.displayName;
        console.log(full_name);
        first_name = full_name.split(' ')[0]
    }
    console.log(userId);
    console.log("First name is " + first_name);
});

//
// let name = prompt("What is your name?");
// console.log(name);


export default class Endgame extends Phaser.Scene{
    constructor(){
        super({key: 'Endgame'})
    }
    init(data){
        console.log('init', data);
        this.end_score = data.score;
    }
    preload(){
        // Preload hero spritesheet //
        this.hero = this.load.spritesheet('hero',
            'sprite/hero.png',
            {frameWidth: 32, frameHeight: 46}
        );

        this.load.image('background_image', './assets/sky.png');
        this.load.image('home_button', './assets/home_button.png');
        this.load.image('leaderboard_button', './assets/leaderboard_button.png');
    }
    create(){
        let background = this.add.sprite(0, 0, 'background_image').setOrigin(0).setDepth(0);
        background.setScale(2);

        this.hero = this.physics.add.sprite(screenwidth*0.5, screenheight*0.4, 'hero');
        this.hero.setScale(2.5);

        this.anims.create({
            key: 'dance',
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 11}),
            frameRate: 10,
            repeat: -1
        });
        this.endGameText = this.add.text(screenwidth*0.50, screenheight*0.50,
            'Congratulations! Your final score is: \n', {
            font: '2em Arial Black',
            fill: 'white',
            strokeThickness: 0
        });
        this.endGameText.setOrigin(0.5);
        this.endScoreText = this.add.text(screenwidth*0.5, screenheight*0.55, this.end_score,{
            font: '6em Arial Black',
            fill: 'red',
            strokeThickness: 1
        });
        this.endScoreText.setOrigin(0.5);

        this.uploadScore();

        // Home button (Bottom Left)
        this.home = this.add.image(screenwidth*0.05, screenheight*0.9, 'home_button').setInteractive();
        this.home.setScale(4);
        this.home.on('pointerdown', () => {
            this.scene.start('Boot');
            this.scene.stop('MainHouse');
            this.scene.stop('Endgame');
        })

        this.leaderboard = this.add.image(screenwidth*0.90, screenheight*0.9, 'leaderboard_button').setInteractive();
        this.home.setScale(4);
        this.leaderboard.on('pointerdown', () =>{
            this.scene.start('Leaderboard');
            this.scene.stop('MainHouse');
            this.scene.stop('Endgame');
        })
    }
    // Upload the final score to Firebase under the current userID and name
    uploadScore(){
        firebase.database().ref("Users/" + userId).update({
            [first_name]:this.end_score
        })
    }
    update(){
        this.hero.anims.play('dance', true);
    }
}