// End game screen & logic

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

let userId = "";
let full_name = "";
firebase.auth().onAuthStateChanged(function(user) {
    if (user){
        userId = user.uid;
        full_name = user.displayName;
    }
});

export default class Endgame extends Phaser.Scene{
    constructor(){
        super({key: 'Endgame'})
    }
    init(data){
        this.end_score = data.score;
    }
    preload(){
        // Preload background image and buttons
        this.load.image('background_image', './sprite/sky.png');
        this.load.image('button', './sprite/button.png');

    }
    create(){
        let background = this.add.sprite(0, 0, 'background').setOrigin(0).setDepth(0);
        background.setScale(2);

        this.hero = this.physics.add.sprite(screenwidth*0.5, screenheight*0.35, 'hero');
        this.hero.setScale(2.5);

        this.anims.create({
            key: 'dance',
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 11}),
            frameRate: 10,
            repeat: -1
        });
        this.endGameText = this.add.text(screenwidth*0.5, screenheight*0.50,
            'Congratulations! \n Your final score is: ', {
            font: '2em Courier',
            align: 'center',
            fill: 'white',
            strokeThickness: 0,
            wordWrap: {width: screenwidth * 0.95, useAdvancedWrap: false}
        });
        this.endGameText.setOrigin(0.5);
        this.endScoreText = this.add.text(screenwidth*0.5, screenheight*0.60, this.end_score,{
            font: '6em Arial Black',
            fill: 'red',
            strokeThickness: 1
        });
        this.endScoreText.setOrigin(0.5);

        this.title = this.add.text(screenwidth*0.5, screenheight*0.20, 'Padawan', {
            align: 'center',
            font: '3em Courier Bold',
            fill: 'Red',
            strokeThickness: 2,
            wordWrap: {width: screenwidth * 0.95, useAdvancedWrap: false}

        });
        this.title.setOrigin(0.5);
        this.titleText();

        // Create and position home button
        // Returns to the home when button is pressed
        let home_button = this.add.image(screenwidth / 2 - 40, screenheight * 0.8, 'button').setInteractive();
        home_button.setOrigin(0.5, 0.5);
        home_button.setFrame(8);
        home_button.setScale(2, 2);

        home_button.on('pointerup', () => {
            this.scene.start('Boot');
            this.scene.stop('MainHouse');
            this.scene.stop('Endgame');
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

        // Leaderboard button
        let leaderboard_button = this.add.image(screenwidth / 2 + 40, screenheight * 0.8, 'button').setInteractive();
        leaderboard_button.setScale(2, 2);
        leaderboard_button.setFrame(14);
        leaderboard_button.on('pointerup', () =>{
            this.scene.start('Leaderboard');
            this.scene.stop('MainHouse');
            this.scene.stop('Endgame');
            this.sound.removeByKey('house');
        });

        leaderboard_button.on('pointerover', () => {
            leaderboard_button.frame = leaderboard_button.scene.textures.getFrame('button', 15);
        });

        leaderboard_button.on('pointerout', () => {
            leaderboard_button.frame = leaderboard_button.scene.textures.getFrame('button', 14);
        });

        leaderboard_button.on('pointerdown', () => {
            leaderboard_button.frame = leaderboard_button.scene.textures.getFrame('button', 16);
        });

        this.uploadScore();
    }

    // Update text with their title according to their score
    titleText(){
        let end_score = this.end_score;

        // Negative Score
        if (end_score <= 0){
            this.title.setText("Tree Hugger")
        }
        // Score 1~49
        if (1 <= end_score && end_score < 50){
            this.title.setText("Enviromentalist");
        }
        //Score 50~149
        if (50 <= end_score && end_score < 150){
            this.title.setText("Litterer");
        }
        //Score 150~299
        if (150 <= end_score && end_score < 300){
            this.title.setText("Willful Ignorant");
        }
        //Score 300~499
        if (300 <= end_score && end_score < 500){
            this.title.setText("Truck Idler");
        }
        //Score 500~999
        if (500 <= end_score && end_score < 1000){
            this.title.setText("Climate Change Denier");
        }
        //Score 1000+
        if (1000 <= end_score){
            this.title.setText("Recyclops,\n Destroyer of Worlds");
        }
    }

    // Upload the final score to Firebase under the current userID and name
    uploadScore(){
        // 1. Read the database score stored if there is any DONE
        // 2A. If there is a database score, set that to a variable old_score DONE
        // 3. Check to see if old_score is greater than the current_score
        // 4. If old_score is greater than current_score, don't do anything (or send old_score back to database)
        // 5. If old_score is less than current_Score, update database with current_score
        // 2B. If there is no previous stored database score, update database with current_score
        const database_scores = firebase.database().ref().child("Users/" + full_name);
        database_scores.once("value", function(snapshot){
            let old_score = snapshot.val();
            let current_score = this.end_score;
            // If there is a previous stored database score, ensure the larger score between current and old is stored
            if (old_score !== null){
                if (old_score <= current_score){
                    firebase.database().ref("Users/").update({
                        [full_name]:this.end_score
                    });
                }
            }
            // If there is no previous stored database score, update database with current end_score
            if (old_score == null){
                firebase.database().ref("Users/").update({
                    [full_name]:this.end_score
                });
            }
        }, this)
    }
    update(){
        this.hero.anims.play('dance', true);
    }
}