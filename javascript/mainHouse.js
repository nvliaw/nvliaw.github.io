// Main function for the house; includes parsed tilemap, object interactivity, and transitions into minigames

const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;

export default class MainHouse extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'MainHouse'});
    }

    preload() {
        // Preload hero spritesheet //
        this.load.spritesheet('hero',
        'sprite/hero.png',
        {frameWidth: 32, frameHeight: 46}
    );

        // Preload map spritesheet and files //
        this.load.image("tileImage", "sprite/house.png");
        this.load.tilemapTiledJSON("map", "map/house.json");
        this.load.spritesheet('tileSheet',
            'sprite/house.png',
            {frameWidth: 32, frameHeight: 32}
        );

        this.load.image("unmuted_button", "sprite/unmuted_button.png");
        this.load.image("muted_button", "sprite/muted_button.png");
    }

    create() {
        this.current_score = 0;
        this.face = 'down';
        this.currentDate = {day: 1,
            timeOfDay: "Morning"};

        // Create the map //
        this.map = this.make.tilemap({ key: "map" });
        const tileset = this.map.addTilesetImage("house", "tileImage");

        // Hardset the tiles to a fixed pixel size, or camera will stutter
        let tileLength = 96;

        // Create each layer, corresponds to the JSON map file //
        let floorLayer = this.map.createStaticLayer("floor", tileset, 0, 0);
        let wallLayer = this.map.createStaticLayer("wall", tileset, 0, 0);
        let objectLayer = this.map.createStaticLayer("object", tileset, 0, 0);
        let decorLayer = this.map.createDynamicLayer("decor", tileset, 0, 0);

        //Makes display height and width equal to the number of tiles of our map. This makes sure each tile
        //is a square as long as our map size does not change.
        floorLayer.displayWidth = 12 * tileLength;
        floorLayer.displayHeight = 10 * tileLength;
        wallLayer.displayWidth = 12 * tileLength;
        wallLayer.displayHeight = 10 * tileLength;
        objectLayer.displayWidth = 12 * tileLength;
        objectLayer.displayHeight = 10 * tileLength;
        decorLayer.displayWidth = 12 * tileLength;
        decorLayer.displayHeight = 10 * tileLength;

        //Player creation, starts on the bed (1103, 170)
        this.player = this.physics.add.sprite(1103, 170, 'hero');

        //Scale player to specified size.
        this.player.displayHeight = 92;
        this.player.displayWidth = 64;

        //Player animation when walking. Repeat: -1 means loop the frames.
        // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('hero', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('hero', { start: 9, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('hero', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        //The idle animations are used to determine where the player faces when movement stops.
        this.anims.create({
            key: 'idledown',
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 0 })
        });

        this.anims.create({
            key: 'idleup',
            frames: this.anims.generateFrameNumbers('hero', { start: 3, end: 3 })
        });

        this.anims.create({
            key: 'idleright',
            frames: this.anims.generateFrameNumbers('hero', { start: 7, end: 7 })
        });

        this.anims.create({
            key: 'idleleft',
            frames: this.anims.generateFrameNumbers('hero', { start: 10, end: 10 })
        });

        this.anims.create({
            key: 'fishbowl',
            frames: this.anims.generateFrameNumbers('tileSheet', { start: 49, end: 50}),
            frameRate: 3,
            repeat: -1
        });

        this.anims.create({
            key: 'runningwater',
            frames: this.anims.generateFrameNumbers('tileSheet', {start: 13, end: 14}),
            frameRate: 3,
            repeat: -1
        });

        this.anims.create({
            key: 'stopwater',
            frames: this.anims.generateFrameNumbers('tileSheet', {start: 12, end: 12})
        });

        this.anims.create({
            key: 'leftscreenon',
            frames: this.anims.generateFrameNumbers('tileSheet', {frames: [31, 33]}),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'rightscreenon',
            frames: this.anims.generateFrameNumbers('tileSheet', {frames: [32, 34]}),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'leftscreenoff',
            frames: this.anims.generateFrameNumbers('tileSheet', {start: 29, end: 29}),
        });

        this.anims.create({
            key: 'rightscreenoff',
            frames: this.anims.generateFrameNumbers('tileSheet', {start: 30, end: 30}),
        });

        this.anims.create({
            key: 'computeron',
            frames: this.anims.generateFrameNumbers('tileSheet', {start: 39, end: 41}),
            frameRate: 2
        });

        //Prevent player from moving outside canvas walls. Currently this does not work as intended due to changing the camera to scroll with player.
        this.physics.world.setBounds(0, 0, tileLength * 12, tileLength * 10);
        this.player.setCollideWorldBounds(true);

        // Set collision for layer.
        this.map.setCollisionBetween(0, 999, true, true, wallLayer);
        this.map.setCollisionBetween(0, 999, true, true, objectLayer);
        this.map.setCollisionBetween(0, 999, true, true, decorLayer);
        // objectLayer.setCollisionBetween(1, 999);

        //Add collision between player and objects in layer.
        this.physics.add.collider(this.player, wallLayer);
        this.physics.add.collider(this.player, objectLayer);
        this.physics.add.collider(this.player, decorLayer);

        this.map.setLayer(2);
        // Create game object from tilemap. This allows the fridge to be clicked.
        this.fridge = this.map.createFromTiles(7, null, {key: 'tileSheet', frame: 6})[0];

        // Adjust height and width to match the current size of a tile.
        this.fridge.displayHeight = tileLength;
        this.fridge.displayWidth = tileLength;
        this.fridge.setInteractive();

        this.fridge.on('pointerdown', function() {
            if (this.fridge.x - tileLength < this.player.x && this.player.x < this.fridge.x + tileLength) {
                if (this.fridge.y - tileLength < this.player.y && this.player.y < this.fridge.y + tileLength) {
                    this.scene.setVisible(false);
                    this.scene.sleep();
                    this.scene.launch('startMiniGame', {object: "food"});
                }
            }
        }, this);

        // Because the origin is set to the middle of the object, set the x and y coordinate to the middle of the tile
        this.fridge.x = this.fridge.x + tileLength/2;
        this.fridge.y = this.fridge.y + tileLength/2;

        this.mainScoreText = this.add.text(screenwidth*0.95, screenheight*0.02, 'Score: ' + this.current_score, {
            font: '2em Arial Black',
            fill: 'black',
            strokeThickness: 1
        });
        // Shows the accumulated score from playing the mini games
        this.mainScoreText.setOrigin(1, 0);
        this.mainScoreText.setScrollFactor(0);
        this.mainScoreText.setDepth(10);

        // unmutes all game music
        this.unmuted_button = this.add.image(screenwidth * 0.85, screenheight * 0.1, 'unmuted_button').setInteractive();
        this.unmuted_button.setScrollFactor(0);
        this.unmuted_button.setDepth(10);
        this.unmuted_button.on('pointerdown', ()=>{
           this.sound.mute = true;
           this.unmuted_button.visible = false;
           this.muted_button.visible = true;
        });

        // mutes all game music
        this.muted_button = this.add.image(screenwidth * 0.85, screenheight * 0.1, 'muted_button').setInteractive();
        this.muted_button.setScrollFactor(0);
        this.muted_button.setDepth(9);
        this.muted_button.visible = false;
        this.muted_button.on('pointerdown', ()=>{
           this.sound.mute = false;
           this.unmuted_button.visible = true;
           this.muted_button.visible = false;
        });

        // Shows the current day and time of day
        this.dateText = this.add.text(screenwidth*0.05, screenheight*0.02, "Day " + this.currentDate.day + " " + this.currentDate.timeOfDay,{
            font: '2em Arial Black',
            fill: 'black',
            strokeThickness: 1
        });
        this.dateText.setScrollFactor(0);
        this.dateText.setDepth(10);

        this.oven = this.map.createFromTiles(5, null, {key: 'tileSheet', frame: 4})[0];
        this.oven.displayHeight = tileLength;
        this.oven.displayWidth = tileLength;
        this.oven.x = this.oven.x + tileLength/2;
        this.oven.y = this.oven.y + tileLength/2;
        this.oven.setInteractive();
        this.oven.on('pointerdown', function(){
            if (this.oven.x - tileLength < this.player.x && this.player.x < this.oven.x + tileLength){
                if (this.oven.y - tileLength < this.player.y && this.player.y < this.oven.y + tileLength){
                    this.scene.pause();
                    this.scene.launch('dialogue', {content: easter_egg});
                }
            }
        }, this);

        // prevents camera from going past boundaries
        this.cameras.main.setBounds(0, 0, tileLength * 12, tileLength * 10);

        // makes camera follow player
        this.cameras.main.startFollow(this.player);

        // Goes to decor layer
        this.map.setLayer(3);
        // Fish bowl
        this.goldfish = this.map.createFromTiles(50, null, {key: 'tileSheet', frame: 49})[0];
        this.goldfish.displayHeight = tileLength;
        this.goldfish.displayWidth = tileLength;
        this.goldfish.x = this.goldfish.x + tileLength/2;
        this.goldfish.y = this.goldfish.y + tileLength/2;
        this.goldfish.setInteractive();
        this.goldfish.on('pointerdown', function(){
            if (this.goldfish.x - tileLength < this.player.x && this.player.x < this.goldfish.x + tileLength){
                if (this.goldfish.y - tileLength < this.player.y && this.player.y < this.goldfish.y + tileLength){
                    this.scene.setVisible(false);
                    this.scene.pause();
                    this.scene.launch('startMiniGame', {object: "shopping"});
                }
            }
        }, this);

        // Sink object and animation
        let runningwater = false;
        this.sink = this.map.createFromTiles(13, null, {key: 'tileSheet', frame: 12})[0];
        this.sink.displayHeight = tileLength;
        this.sink.displayWidth = tileLength;
        this.sink.x = this.sink.x + tileLength/2;
        this.sink.y = this.sink.y + tileLength/2;
        this.sink.setInteractive();
        this.sink.on('pointerdown', function(){
            if (this.sink.x - tileLength < this.player.x && this.player.x < this.sink.x + tileLength){
                if (this.sink.y - tileLength < this.player.y && this.player.y < this.sink.y + tileLength){

                    // Turns on sink if it's off
                    if (runningwater === false) {
                        this.sink.anims.play('runningwater', true);
                        runningwater = true;
                    }
                    // Else turns off sink if it's on
                    else {
                        this.sink.anims.play('stopwater');
                        runningwater = false;
                    }
                }
            }
        }, this);

        let power = "off";
        this.tvleft = this.map.createFromTiles(30, null, {key: 'tileSheet', frame: 29})[0];
        this.tvleft.displayHeight = tileLength;
        this.tvleft.displayWidth = tileLength;
        this.tvleft.x = this.tvleft.x + tileLength/2;
        this.tvleft.y = this.tvleft.y + tileLength/2;
        this.tvleft.setInteractive();
        this.tvleft.on('pointerdown', function(){
            if (this.tvleft.x - tileLength < this.player.x && this.player.x < this.tvleft.x + tileLength){
                if (this.tvleft.y - tileLength < this.player.y && this.player.y < this.tvleft.y + tileLength){
                    this.animateTV(this, power);
                }
            }
        }, this);

        this.tvright = this.map.createFromTiles(31, null, {key: 'tileSheet', frame: 30})[0];
        this.tvright.displayHeight = tileLength;
        this.tvright.displayWidth = tileLength;
        this.tvright.x = this.tvright.x + tileLength/2;
        this.tvright.y = this.tvright.y + tileLength/2;
        this.tvright.setInteractive();
        this.tvright.on('pointerdown', function(){
            if (this.tvright.x - tileLength < this.player.x && this.player.x < this.tvright.x + tileLength){
                if (this.tvright.y - tileLength < this.player.y && this.player.y < this.tvright.y + tileLength){
                    this.animateTV(this, power)
                }
            }
        }, this);

        let computerpower = "off";
        this.computer = this.map.createFromTiles(40, null, {key: 'tileSheet', frame: 39})[0];
        this.computer.displayHeight = tileLength;
        this.computer.displayWidth = tileLength;
        this.computer.x = this.computer.x + tileLength/2;
        this.computer.y = this.computer.y + tileLength/2;
        this.computer.setInteractive();
        this.computer.on('pointerdown', function(){
            if (this.computer.x - tileLength < this.player.x && this.player.x < this.computer.x + tileLength){
                if (this.computer.y - tileLength < this.player.y && this.player.y < this.computer.y + tileLength){
                    if (computerpower === "off") {
                        this.computer.anims.play('computeron', true);
                        computerpower = "on";
                    }
                    else {
                        this.computer.anims.playReverse('computeron', true);
                        computerpower = "off";
                    }
                }
            }
        }, this);

        this.map.setLayer(2);
        this.garbage = this.map.createFromTiles(43, null, {key: 'tileSheet', frame: 42})[0];
        this.garbage.displayHeight = tileLength;
        this.garbage.displayWidth = tileLength;
        this.garbage.x = this.garbage.x + tileLength/2;
        this.garbage.y = this.garbage.y + tileLength/2;
        this.garbage.setInteractive();
        this.garbage.on('pointerdown', function(){
            if (this.garbage.x - tileLength < this.player.x && this.player.x < this.garbage.x + tileLength){
                if (this.garbage.y - tileLength < this.player.y && this.player.y < this.garbage.y + tileLength){
                    this.scene.setVisible(false);
                    this.scene.pause();
                    this.scene.launch('startMiniGame', {object: "trash"});
                }
            }
        }, this);



        if (this.events.listenerCount('wake') === 0) {

            // Update the score after each mini game is played
            this.events.on('wake', this.updateScore, this);

            // Update the day and time of day each time a mini game is played
            this.events.on('wake', this.updateDate, this);
        }

    }

    animateTV (scene, power) {
        if (power === "off") {
            this.tvleft.anims.play('leftscreenon', true);
            this.tvright.anims.play('rightscreenon', true);
            power = "on";

        }
        else {
            this.tvleft.anims.play('leftscreenoff');
            this.tvright.anims.play('rightscreenoff');
            power = "off";
        }
        return (power);
    }

    updateScore (parent, score) {
        this.current_score += score.score;
        this.mainScoreText.setText('Score: ' + this.current_score);
        // Update the plant's look to correspond to the score (The higher the score, the more the plant dies)
        this.updatePlant()
    }

    updateDate(parent, dateBoolean){
        // Only update the current date if player clicked on a mini game
        if (dateBoolean.checkGame === true){
            if (this.currentDate.timeOfDay === "Night"){
                this.currentDate.day += 1;
                this.currentDate.timeOfDay = "Morning";
                // moves player  back to bed
                this.player.x = 1103;
                this.player.y = 170;
                this.face = 'down';
            }
            else if (this.currentDate.timeOfDay === "Morning"){
                this.currentDate.timeOfDay = "Noon";
            }
            else{
                this.currentDate.timeOfDay = "Night";
            }
            this.dateText.setText("Day " + this.currentDate.day + " " + this.currentDate.timeOfDay);
        }
        // Sets the window to the correct time of day
        this.updateWindow();
        // Ends the game if a certain day is reached
        this.endGame();
    }

    // Easter Egg Implementation
    // The plant slowly withers as the player's score increases (higher score = worser for the environment!)
    updatePlant(){
        // Set to decor layer then remove the plant sprites
        this.map.setLayer(3);
        this.map.removeTileAt(5, 1);
        this.map.removeTileAt(5, 0);
        // Set the plant sprite according to the right score
        if (this.current_score < 50){
            this.map.putTileAt(16, 5, 1);
            this.map.putTileAt(17, 5, 0);
        }
        if (50 <= this.current_score && this.current_score < 100){
            this.map.putTileAt(16, 5, 1);
            this.map.putTileAt(18, 5, 0);
        }
        if (100 <= this.current_score && this.current_score < 150){
            this.map.putTileAt(16, 5, 1);
            this.map.putTileAt(19, 5, 0);
        }
        if (150 <= this.current_score && this.current_score < 200){
            this.map.putTileAt(20, 5, 1);
        }
        if (200 <= this.current_score){
            this.map.putTileAt(21, 5, 1);
        }
    }


    updateWindow(){
        // Set to decor layer and remove the window sprites
        this.map.setLayer(3);
        this.map.removeTileAt(3, 0);
        this.map.removeTileAt(4, 0);
        // Set the window sprite according to the right time of day
        if (this.currentDate.timeOfDay === "Morning"){
            this.map.putTileAt(22, 3, 0);
            this.map.putTileAt(23, 4, 0);
        }
        if (this.currentDate.timeOfDay === "Noon"){
            this.map.putTileAt(24, 3, 0);
            this.map.putTileAt(25, 4, 0);
        }
        if (this.currentDate.timeOfDay === "Night"){
            this.map.putTileAt(26, 3, 0);
            this.map.putTileAt(27, 4, 0);
        }

    }

    endGame(){
        // End the game after !!!X!!! days
        if (this.currentDate.day === 2 && this.currentDate.timeOfDay === "Morning"){
            this.scene.stop();
            // Start the Endgame scene as well as sending the final score as data
            this.scene.start('Endgame', {score: this.current_score});

        }
    }

    update() {
        // Runs once per frame.
        // Activepointer allows both mouse clicks and touch screen to work.
        if (this.input.activePointer.isDown)
        {
            this.physics.moveTo(this.player, this.input.activePointer.worldX, this.input.activePointer.worldY, 250);

            //If player within 5% of mouseclick, they will stop running and plays idle animation. May have to adjust the tolerance number.
            if (Math.abs(this.player.x - this.input.activePointer.worldX) < screenwidth*0.01 && Math.abs(this.player.y - this.input.activePointer.worldY) < screenheight*0.01) {
                {
                    this.player.body.velocity.setTo(0, 0);
                    this.player.anims.play('idle' + this.face, true);
                }
            }
            //Else if player's position < clicked position, player runs right.
            else if (this.player.x < this.input.activePointer.worldX)
            {
                if (this.player.y - this.input.activePointer.worldY > this.input.activePointer.worldX - this.player.x) {
                    this.player.anims.play('up', true);
                    this.face = 'up';
                }
                else if (this.input.activePointer.worldY - this.player.y > this.input.activePointer.worldX - this.player.x){
                    this.player.anims.play('down', true);
                    this.face = 'down';
                }
                else {
                    this.player.anims.play('right', true);
                    this.face = 'right';
                }
            }
            //Otherwise player runs left.
            else {
                if (this.player.y - this.input.activePointer.worldY > this.player.x - this.input.activePointer.worldX) {
                    this.player.anims.play('up', true);
                    this.face = 'up';
                }
                else if (this.input.activePointer.worldY - this.player.y > this.player.x - this.input.activePointer.worldX) {
                    this.player.anims.play('down', true);
                    this.face = 'down';
                }
                else {
                    this.player.anims.play('left', true);
                    this.face = 'left';
                }
            }
        }
        else
        {
            this.player.anims.play('idle' + this.face, true);
            this.player.body.velocity.setTo(0, 0);
            this.player.body.velocity.setTo(0, 0);
        }
        this.goldfish.anims.play('fishbowl', true);

    }

}


// Dialogue

var easter_egg = "Did you ever hear the tragedy of Darth Thompson the Fierce?\n" +
    "I thought not. It's not a program the instructors would code for you. It's a CST legend. " +
    "Darth Thompson was a Dark Lord of Python, so powerful and so wise he could use the Code to " +
    "influence the grade book to create A's... He had such knowledge of programming that he could " +
    "even keep the ones he cared about from failing. The programming of the Code is a pathway to many " +
    "abilities some consider to be unnatural. He became so powerful... the only thing he was afraid of was " +
    "losing his files, which eventually, of course, he did. Unfortunately, he taught his students to commit to GitHub," +
    " then his students deleted 'master' in his sleep. It's ironic he could save others from failing, but not himself." +
    "\n";