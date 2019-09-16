class mainScene {
    // preload() --> create() --> update() --> update() --> update()...

    player_speed = 1000;

    preload(){
        // Method that's called at the beginning that loads all my assets (sprites, sounds, etc)
        this.load.image('player', 'assets/bomb.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('meat',
        'sprite/food.png',
        {frameWidth: 32, frameHeight: 32}
    );
    }

    create(){
        // Initializes our scene such as the position of the sprites
        this.player = this.physics.add.sprite(150, 150, 'player');
        this.star = this.physics.add.sprite(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'star');
        this.star.setScale(1.50, 1.50);
        this.meat = this.physics.add.sprite(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'meat');
        this.meat.setScale(0.10, 0.10);

        // score is stored in a variable and initialized at 0
        this.score = 0;
        let style = {font: '20px Arial', fill: '#fff'};
        this.scoreText = this.add.text(20, 20, 'score: ' + this.score, style);

        // timer is stored in a variable and initialized at 15seconds
        this.timer = 1000;
        this.timerText = this.add.text(width-150, 20, 'Time left: ' + this.timer, style);
    }

    update(){
        // Method that's called 60 times per second after create()
        // Handles all the game's logic like movements

        // mouse click
        if (this.input.activePointer.isDown){
            this.physics.moveTo(this.player, this.input.activePointer.x, this.input.activePointer.y, this.player_speed);
            // change the velocity to 0 once player reaches the point that they clicked
            if (Math.abs(this.player.x - this.input.activePointer.x) < this.player.x*0.05
                && Math.abs(this.player.y - this.input.activePointer.y) < this.player.y*0.05){
                this.player.body.velocity.setTo(0,0);
            }
        }
        else{
            this.player.body.velocity.setTo(0, 0);
        }

        // If player overlaps with the star, call hit_star()
        if (this.physics.overlap(this.player, this.star)){
            this.hit_star();
        }
        // If player overlaps with the meat, call hit_meat()
        if (this.physics.overlap(this.player, this.meat)){
            this.hit_meat();
        }
        if (this.timer > 0){
            // Doesn't decrement each second right now, need to fix
            setTimeout(this.decrement(), 10000);
        }
    }

    hit_star(){
        // Change the position of the star randomly
        this.star.x = Phaser.Math.Between(100, 600);
        this.star.y = Phaser.Math.Between(100, 300);

        // Increment the score
        this.score -= 25;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);
    }

    hit_meat(){
        // Change the position of the meat randomly
        this.meat.x = Phaser.Math.Between(0, Phaser.Math.Between(0, width));
        this.meat.y = Phaser.Math.Between(0, Phaser.Math.Between(0, height));

        // Increment the score
        this.score += 10;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);
    }

    decrement(){
        this.timer -= 1;
        this.timerText.setText('Time left: ' + this.timer);
        //setTimeout('decrement()', 1000);
    }

    // countdown(){
    //     console.log("hello");
    //     decrement;
    // }
}

// game window dimension constants
let width = 750;
let height = 500;

let config = {
    width: width,
    height: height,
    backgroundColor: '#3498db',
    scene: mainScene,
    physics: {default: 'arcade'},
    parent: 'game'
};

new Phaser.Game(config);
