const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;
let topTenScores = [];
var userId = "";
firebase.auth().onAuthStateChanged(function(user) {
    userId = user.uid;
    console.log("Current user: " + userId);
});

export default class Leaderboard extends Phaser.Scene{
    constructor(){
        super({key: 'Leaderboard'})
    }
    preload(){

    }
    create(){
        this.leaderboard = false;
        this.getAndSortScores();


    }
    update(){
        // Boolean flag
        // if (this.leaderboard == false){
            for (let i =0; i < 10; i++){
                this.add.text(screenwidth*0.05, screenheight*0.50+(i*30),
                topTenScores[i], {
                    font: '2em Arial Black',
                    fill: 'white',
                    strokeThickness: 0
                });}
        //     this.leaderboard = true;
        // }


    }
    // Get and sort the scores that's saved in the firebase database
    getAndSortScores(){
        let scoreBoard = [];
        const scores = firebase.database().ref().child("Users/");
        scores.on('value', function(snapshot) {
            let users = snapshot.val();
            let name_score = Object.values(users);
            let scores1 = Object.values(name_score);
            let user_scores = Object.values(scores1);
            console.log(user_scores)
            console.log(Object.values(user_scores))
            let user_names = Object.keys(scores1);
            console.log(user_names)
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
            topTenScores = [];
            for(let i =0; i < 10; i++){
                topTenScores[i] = scoreBoard[i][0] + " --> " + scoreBoard[i][1];
            }
            console.log(topTenScores);

        });
    }
}