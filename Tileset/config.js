class SceneA extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'SceneA', active: true });
    }

    preload() {
        // Preload spritesheet, map file, and character animation files //
        this.load.image('idle1', 'assets/idle/Idle (1).png');
        this.load.image('idle2', 'assets/idle/Idle (2).png');
        this.load.image('idle3', 'assets/idle/Idle (3).png');
        this.load.image('idle4', 'assets/idle/Idle (4).png');
        this.load.image('idle5', 'assets/idle/Idle (5).png');
        this.load.image('idle6', 'assets/idle/Idle (6).png');
        this.load.image('idle7', 'assets/idle/Idle (7).png');
        this.load.image('idle8', 'assets/idle/Idle (8).png');
        this.load.image('idle9', 'assets/idle/Idle (9).png');
        this.load.image('idle10', 'assets/idle/Idle (10).png');
        this.load.image('run1', 'assets/run/0001.png');
        this.load.image('run2', 'assets/run/0002.png');
        this.load.image('run3', 'assets/run/0003.png');
        this.load.image('run4', 'assets/run/0004.png');
        this.load.image('run5', 'assets/run/0005.png');
        this.load.image('run6', 'assets/run/0006.png');
        this.load.image('run7', 'assets/run/0007.png');
        this.load.image('run8', 'assets/run/0008.png');
        this.load.image('run9', 'assets/run/0009.png');
        this.load.image('run10', 'assets/run/0010.png');
        // Preload spritesheet and map file //
        this.load.image("tiles", "sprite/house.png");
        this.load.tilemapTiledJSON("map", "map/house.json");
        this.load.spritesheet('tiles2',
            'sprite/house.png',
            {frameWidth: 32, frameHeight: 32}
        );
    }

    create() {
        // Create the map //
        let map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("house", "tiles");

        // Create each layer, corresponds to the JSON map file //
        let belowLayer = map.createStaticLayer("floor", tileset, 0, 0);
        let worldLayer = map.createStaticLayer("wall", tileset, 0, 0);
        let aboveLayer = map.createStaticLayer("object", tileset, 0, 0);
        //Stretch the lay's width and height to fit to the screen.
        belowLayer.displayWidth = config.scale.width;
        belowLayer.displayHeight = config.scale.height;
        worldLayer.displayWidth = config.scale.width;
        worldLayer.displayHeight = config.scale.height;
        aboveLayer.displayWidth = config.scale.width;
        aboveLayer.displayHeight = config.scale.height;

        // Calculate height & width of an individual tile. Height and width are equal because tiles are squares.
        this.tileLength = screenheight / aboveLayer.tilemap.height;

        // Set collision for tiles 2 - 12
        aboveLayer.setCollisionBetween(2, 12);

        //Player creation
        this.player = this.physics.add.sprite(config.scale.width*0.75, config.scale.height*0.75, 'idle1');

        //Scale player down to 12%
        this.player.setScale(0.12, 0.12);

        //Player animation when walking left. Repeat:-1 is a loop.
        // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html
        this.anims.create({
            key: 'right',
            frames: [
                { key: 'run1'},
                { key: 'run2'},
                { key: 'run3'},
                { key: 'run4'},
                { key: 'run5'},
                { key: 'run6'},
                { key: 'run7'},
                { key: 'run8'},
                { key: 'run9'},
                { key: 'run10'}
            ],
            frameRate: 20,
            repeat: -1
        });

        //Idle animation.
        this.anims.create({
            key: 'idle',
            frames: [
                { key: 'idle1'},
                { key: 'idle2'},
                { key: 'idle3'},
                { key: 'idle4'},
                { key: 'idle5'},
                { key: 'idle6'},
                { key: 'idle7'},
                { key: 'idle8'},
                { key: 'idle9'},
                { key: 'idle10'}
            ],
            frameRate: 10,
            repeat: -1
        });


        //Prevent player from moving outside canvas walls.
        this.player.setCollideWorldBounds(true);

        //Add collision between player and objects in layer.
        this.physics.add.collider(this.player, aboveLayer);

        console.log(game.scene);
        // Add foodminigame scene
        // game.scene.add('meatgame', config2, true);
        console.log(game.scene);

        // Create game object from tilemap. This allows the fridge to be clicked.
        this.fridge = map.createFromTiles(9, null, {key: 'tiles2', frame: 8})[0];
        console.log(this.fridge.x);
        console.log(this.player.x);
        // Adjust height and width to match the current size of a tile.
        this.fridge.displayHeight = this.tileLength;
        this.fridge.displayWidth = this.tileLength;
        this.fridge.setInteractive();
        console.log(this.tileLength)
        console.log(this.fridge.x - this.tileLength < this.player.x && this.player.x < this.fridge.x + this.tileLength)
        console.log(this.player.x < this.fridge.x + this.tileLength)
        this.fridge.on('pointerdown', function() {
            this.scene.setVisible(false);
            this.scene.sleep();
            this.scene.add('SceneB', SceneB, true);
        }, this);

        // Because the origin is set to the middle of the object, set the x and y coordinate to the middle of the tile
        this.fridge.x = this.fridge.x + this.tileLength/2;
        this.fridge.y = this.fridge.y + this.tileLength/2;
    }

    update() {
        // Runs once per frame.
        // Activepointer allows both mouse clicks and touch screen to work.
        if (game.input.activePointer.isDown)
        {
            //Move player towards mouse click or finger touch at velocity of 750.
            this.physics.moveTo(this.player, game.input.activePointer.x, game.input.activePointer.y, 750);

            //If player within 5% of mouseclick, they will stop running and plays idle animation. May have to adjust the tolerance number.
            if (Math.abs(this.player.x - game.input.activePointer.x) < this.player.x*0.05 && Math.abs(this.player.y - game.input.activePointer.y) < this.player.y*0.05) {
                {
                    this.player.body.velocity.setTo(0, 0);
                    this.player.anims.play('idle', true);
                }
            }
            //Else if player's position < clicked position, player runs right.
            else if (this.player.x < game.input.activePointer.x)
            {
                this.player.flipX = false;
                this.player.anims.play('right', true);
            }
            //Otherwise player runs left (animation is flipped).
            else {
                this.player.flipX = true;
                this.player.anims.play('right', true);
            }
        }
        else
        {
            this.player.anims.play('idle', true);
            this.player.body.velocity.setTo(0, 0);
            this.player.body.velocity.setTo(0, 0);
        }

    }

}

class SceneB extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'SceneB', active: true });
    }

    player_speed = 1000;

    preload(){
        // Method that's called at the beginning that loads all my assets (sprites, sounds, etc)
        this.load.image('player', 'assets/bomb.png');
        this.load.spritesheet('foodset',
            'sprite/food.png',
            {frameWidth: 32, frameHeight: 32});
    }

    create(){
        // Initializes our scene such as the position of the sprites
        this.player = this.physics.add.sprite(150, 150, 'player');
        this.cheese = this.physics.add.sprite(Phaser.Math.Between(screenwidth*0.10, screenwidth*0.85), Phaser.Math.Between(screenheight*0.10, screenheight*0.85), 'foodset', 2);
        this.cheese.setScale(1.50, 1.50);
        this.meat = this.physics.add.sprite(Phaser.Math.Between(screenwidth*0.10, screenwidth*0.85), Phaser.Math.Between(screenheight*0.10, screenheight*0.85), 'foodset', 1);
        this.meat.setScale(1.50, 1.50);
        this.broccoli = this.physics.add.sprite(Phaser.Math.Between(screenwidth*0.10, screenwidth*0.85), Phaser.Math.Between(screenheight*0.10, screenheight*0.85), 'foodset', 4);
        this.broccoli.setScale(1.50, 1.50);
        this.rice = this.physics.add.sprite(Phaser.Math.Between(screenwidth*0.10, screenwidth*0.85), Phaser.Math.Between(screenheight*0.10, screenheight*0.85), 'foodset', 3);
        this.rice.setScale(1.50, 1.50);
        this.fish = this.physics.add.sprite(Phaser.Math.Between(screenwidth*0.10, screenwidth*0.85), Phaser.Math.Between(screenheight*0.10, screenheight*0.85), 'foodset', 6);
        this.fish.setScale(1.50, 1.50);
        this.cameras.main.setBackgroundColor('#3498db')

        // score is stored in a variable and initialized at 0
        this.score = 0;
        let style = {font: '20px Arial', fill: '#fff'};
        this.scoreText = this.add.text(20, 20, 'score: ' + this.score, style);

        // timer is stored in a variable and initialized at 15seconds
        this.timer = 1000;
        this.timerText = this.add.text(screenwidth-150, 20, 'Time left: ' + this.timer, style);
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

        // If player overlaps with the star, call hit_cheese()
        if (this.physics.overlap(this.player, this.cheese)){
            this.hit_cheese();
        }
        // If player overlaps with the meat, call hit_meat()
        if (this.physics.overlap(this.player, this.meat)){
            this.hit_meat();
        }
        // If player overlaps with the meat, call hit_rice()
        if (this.physics.overlap(this.player, this.rice)){
            this.hit_rice();
        }
        // If player overlaps with the meat, call hit_broccoli()
        if (this.physics.overlap(this.player, this.broccoli)){
            this.hit_broccoli();
        }
        // If player overlaps with the meat, call hit_fish()
        if (this.physics.overlap(this.player, this.fish)){
            this.hit_fish();
        }
        if (this.timer > 0){
            // Doesn't decrement each second right now, need to fix
            setTimeout(this.decrement(), 10000);
        }
    }

    hit_cheese(){
        // Change the position of the cheese randomly
        this.cheese.x = Phaser.Math.Between(0, Phaser.Math.Between(screenwidth*0.10, screenwidth*0.85));
        this.cheese.y = Phaser.Math.Between(0, Phaser.Math.Between(screenheight*0.10, screenheight*0.85));

        // Increment the score
        this.score += 10;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);
    }

    hit_meat(){
        // Change the position of the meat randomly
        this.meat.x = Phaser.Math.Between(0, Phaser.Math.Between(screenwidth*0.10, screenwidth*0.85));
        this.meat.y = Phaser.Math.Between(0, Phaser.Math.Between(screenheight*0.10, screenheight*0.85));

        // Increment the score
        this.score += 25;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);
    }

    hit_broccoli(){
        // Change the position of the cheese randomly
        this.broccoli.x = Phaser.Math.Between(0, Phaser.Math.Between(screenwidth*0.10, screenwidth*0.85));
        this.broccoli.y = Phaser.Math.Between(0, Phaser.Math.Between(screenheight*0.10, screenheight*0.85));

        // Increment the score
        this.score -= 25;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);
    }

    hit_rice(){
        // Change the position of the cheese randomly
        this.rice.x = Phaser.Math.Between(0, Phaser.Math.Between(screenwidth*0.10, screenwidth*0.85));
        this.rice.y = Phaser.Math.Between(0, Phaser.Math.Between(screenheight*0.10, screenheight*0.85));

        // Increment the score
        this.score -= 10;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);
    }

    hit_fish(){
        // Change the position of the cheese randomly
        this.fish.x = Phaser.Math.Between(0, Phaser.Math.Between(screenwidth*0.10, screenwidth*0.85));
        this.fish.y = Phaser.Math.Between(0, Phaser.Math.Between(screenheight*0.10, screenheight*0.85));

        // Increment the score
        this.score += 5;

        // Display the updated score on the screen
        this.scoreText.setText('score: ' + this.score);
    }

    decrement(){
        this.timer -= 1;
        this.timerText.setText('Time left: ' + this.timer);
        if (this.timer === 0) {
            this.scene.setVisible(false);
            this.scene.remove();
            this.scene.setActive(true, 'SceneA');
            this.scene.setVisible(true, 'SceneA');
        }
        //setTimeout('decrement()', 1000);
    }

    // countdown(){
    //     console.log("hello");
    //     decrement;
    // }
}

const screenwidth = window.innerHeight * 0.75;
const screenheight = window.innerHeight;

const config = {
    type: Phaser.AUTO, // Which renderer to use
    parent: "game-container",
    scene: SceneA,
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
    }
};

let game = new Phaser.Game(config);
