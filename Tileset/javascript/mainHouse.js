const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;
let current_score = 0;
let face = 'down';
let currentDate = {day: 1,
    timeOfDay: "Morning"};
let dateText;

export default class MainHouse extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'MainHouse'});
    }

    preload() {
        // Preload hero //
        this.load.spritesheet('hero',
        'sprite/hero.png',
        {frameWidth: 32, frameHeight: 46}
    );

        // Preload spritesheet and map file //
        this.load.image("tileImage", "sprite/house.png");
        this.load.tilemapTiledJSON("map", "map/house.json");
        this.load.spritesheet('tileSheet',
            'sprite/house.png',
            {frameWidth: 32, frameHeight: 32}
        );
    }

    create() {
        // Create the map //
        this.map = this.make.tilemap({ key: "map" });
        const tileset = this.map.addTilesetImage("house", "tileImage");

        // Calculate height & width of an individual tile. Height and width are equal because tiles are squares.
        let tileLength = screenheight / 8;

        // Create each layer, corresponds to the JSON map file //
        let floorLayer = this.map.createStaticLayer("floor", tileset, 0, 0);
        let wallLayer = this.map.createStaticLayer("wall", tileset, 0, 0);
        let objectLayer = this.map.createStaticLayer("object", tileset, 0, 0);
        let decorLayer = this.map.createDynamicLayer("decor", tileset, 0, 0);

        // Using an aspect ratio of 16:9, we modify our canvas to show 8 tiles high. The width will be determined by the screen size.
        let aspectHeight = 8;
        let aspectWidth = 4.5;

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

        //Player creation
        this.player = this.physics.add.sprite(screenwidth*0.25, screenheight*0.75, 'hero');

        //Scale player to specified percentage. Will need to change this to tileLength maybe?
        //Current player size is set to 70% of tileLength while keeping the ratio of 46:32 (height:width)
        this.player.displayHeight = tileLength * 0.70;
        this.player.displayWidth = tileLength * 32/46 * 0.70;

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
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idleup',
            frames: this.anims.generateFrameNumbers('hero', { start: 3, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idleright',
            frames: this.anims.generateFrameNumbers('hero', { start: 7, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idleleft',
            frames: this.anims.generateFrameNumbers('hero', { start: 10, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        //Prevent player from moving outside canvas walls. Currently this does not work as intended due to changing the camera to scroll with player.
        // this.player.setCollideWorldBounds(true);

        // Set collision for layer.
        this.map.setCollisionBetween(1, 999, true, true, wallLayer);
        this.map.setCollisionBetween(1, 999, true, true, objectLayer);
        // objectLayer.setCollisionBetween(1, 999);

        //Add collision between player and objects in layer.
        this.physics.add.collider(this.player, wallLayer);
        this.physics.add.collider(this.player, objectLayer);

        console.log(this.map);
        this.map.setLayer(2);
        // Create game object from tilemap. This allows the fridge to be clicked.
        this.fridge = this.map.createFromTiles(7, null, {key: 'tileSheet', frame: 6})[0];
        console.log(this.fridge);

        // Adjust height and width to match the current size of a tile.
        this.fridge.displayHeight = tileLength;
        this.fridge.displayWidth = tileLength;
        this.fridge.setInteractive();

        this.fridge.on('pointerdown', function() {
            if (this.fridge.x - tileLength < this.player.x && this.player.x < this.fridge.x + tileLength) {
                if (this.fridge.y - tileLength < this.player.y && this.player.y < this.fridge.y + tileLength) {
                    this.scene.setVisible(false);
                    this.scene.sleep();
                    this.scene.launch('MiniGame2');
                }
            }
        }, this);

        // Because the origin is set to the middle of the object, set the x and y coordinate to the middle of the tile
        this.fridge.x = this.fridge.x + tileLength/2;
        this.fridge.y = this.fridge.y + tileLength/2;

        this.mainScoreText = this.add.text(screenwidth*0.95, screenheight*0.02, 'Score: ' + current_score, {
            font: '2em Arial Black',
            fill: 'black',
            strokeThickness: 1
        });
        // Shows the accumulated score from playing the mini games
        this.mainScoreText.setOrigin(1, 0);
        this.mainScoreText.setScrollFactor(0);

        // Update the score after each mini game is played
        this.events.on('wake', this.updateScore, this);

        // Update the day and time of day each time a mini game is played
        this.events.on('wake', this.updateDate, this);


        // Shows the current day and time of day
        dateText = this.add.text(screenwidth*0.05, screenheight*0.02, "Day " + currentDate.day + " " + currentDate.timeOfDay,{
            font: '2em Arial Black',
            fill: 'black',
            strokeThickness: 1
        });
        dateText.setScrollFactor(0);

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
                    this.scene.launch('Dialog');
                }
            }
        }, this);

        // prevents camera from going past boundaries
        this.cameras.main.setBounds(0, 0, tileLength * 12, tileLength * 10);

        // makes camera follow player
        this.cameras.main.startFollow(this.player);

        // Goes to decor layer
        this.map.setLayer(3);
        this.goldfish = this.map.createFromTiles(50, null, {key: 'tileSheet', frame: 49})[0];
        this.goldfish.displayHeight = tileLength;
        this.goldfish.displayWidth = tileLength;
        this.goldfish.x = this.goldfish.x + tileLength/2;
        this.goldfish.y = this.goldfish.y + tileLength/2;
        this.goldfish.setInteractive();
        this.goldfish.on('pointerdown', function(){
            if (this.goldfish.x - tileLength < this.player.x && this.player.x < this.goldfish.x + tileLength){
                if (this.goldfish.y - tileLength < this.player.y && this.player.y < this.goldfish.y + tileLength){
                    this.scene.pause();
                    this.scene.launch('MiniGame1');
                }
            }
        }, this);


        // this.updatePlant(map)
        // map.setLayer(3);
        //
        // this.plant = map.replaceByIndex(16, 20);
        // this.plant = map.replaceByIndex(17, 19);
        // this.map.setLayer(3);
        // this.map.removeTileAt(5, 1);
        // this.map.removeTileAt(5, 0);
        // console.log(current_score)
        // if (current_score >= 50){
        //     map.putTileAt(16, 5, 1);
        //     map.putTileAt(17, 5, 0);
        // }

    }

    updateScore (parent, score) {
        current_score += score.score;
        this.mainScoreText.setText('Score: ' + current_score);
        // Update the plant's look to correspond to the score (The higher the score, the more the plant dies)
        this.updatePlant()
    }

    updateDate(parent, dateBoolean){
        // Only update the current date if player clicked on a mini game
        if (dateBoolean.checkGame === true){
            if (currentDate.timeOfDay === "Night"){
                currentDate.day += 1;
                currentDate.timeOfDay = "Morning";
            }
            else if (currentDate.timeOfDay === "Morning"){
                currentDate.timeOfDay = "Noon";
            }
            else{
                currentDate.timeOfDay = "Night";
            }
            dateText.setText("Day " + currentDate.day + " " + currentDate.timeOfDay);
        }
        // Sets the window to the correct time of day
        this.updateWindow();
    }

    // Easter Egg Implementation
    // The plant slowly withers as the player's score increases (higher score = worser for the environment!)
    updatePlant(){
        // Set to decor layer then remove the plant sprites
        this.map.setLayer(3);
        this.map.removeTileAt(5, 1);
        this.map.removeTileAt(5, 0);
        // Set the plant sprite according to the right score
        if (0 <= current_score && current_score < 50){
            this.map.putTileAt(16, 5, 1);
            this.map.putTileAt(17, 5, 0);
        }
        if (50 <= current_score && current_score < 100){
            this.map.putTileAt(16, 5, 1);
            this.map.putTileAt(18, 5, 0);
        }
        if (100 <= current_score && current_score < 150){
            this.map.putTileAt(16, 5, 1);
            this.map.putTileAt(19, 5, 0);
        }
        if (150 <= current_score && current_score < 200){
            this.map.putTileAt(20, 5, 1);
        }
        if (200 <= current_score){
            this.map.putTileAt(21, 5, 1);
        }
    }

    updateWindow(){
        // Set to decor layer and remove the window sprites
        this.map.setLayer(3);
        this.map.removeTileAt(3, 0);
        this.map.removeTileAt(4, 0);
        // Set the window sprite according to the right time of day
        if (currentDate.timeOfDay == "Morning"){
            this.map.putTileAt(22, 3, 0);
            this.map.putTileAt(23, 4, 0);
        }
        if (currentDate.timeOfDay == "Noon"){
            this.map.putTileAt(24, 3, 0);
            this.map.putTileAt(25, 4, 0);
        }
        if (currentDate.timeOfDay == "Night"){
            this.map.putTileAt(26, 3, 0);
            this.map.putTileAt(27, 4, 0);
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
                    this.player.anims.play('idle' + face, true);
                }
            }
            //Else if player's position < clicked position, player runs right.
            else if (this.player.x < this.input.activePointer.worldX)
            {
                if (this.player.y - this.input.activePointer.worldY > this.input.activePointer.worldX - this.player.x) {
                    this.player.anims.play('up', true);
                    face = 'up';
                }
                else if (this.input.activePointer.worldY - this.player.y > this.input.activePointer.worldX - this.player.x){
                    this.player.anims.play('down', true);
                    face = 'down';
                }
                else {
                    this.player.anims.play('right', true);
                    face = 'right';
                }
            }
            //Otherwise player runs left.
            else {
                if (this.player.y - this.input.activePointer.worldY > this.player.x - this.input.activePointer.worldX) {
                    this.player.anims.play('up', true);
                    face = 'up';
                }
                else if (this.input.activePointer.worldY - this.player.y > this.player.x - this.input.activePointer.worldX) {
                    this.player.anims.play('down', true);
                    face = 'down';
                }
                else {
                    this.player.anims.play('left', true);
                    face = 'left';
                }
            }
        }
        else
        {
            this.player.anims.play('idle' + face, true);
            this.player.body.velocity.setTo(0, 0);
            this.player.body.velocity.setTo(0, 0);
        }

    }

}
