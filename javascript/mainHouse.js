// Main function for the house; includes parsed tilemap, object interactivity, and transitions into minigames

const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;

export default class MainHouse extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'MainHouse'});
    }

    preload() {
        // Preload Audio //
        this.load.audio('house', './audio/house.mp3');

        // Preload hero spritesheet //
        this.load.spritesheet('hero',
        './sprite/hero.png',
        {frameWidth: 32, frameHeight: 46});

        // Preload map spritesheet and files //
        this.load.image("tileImage", "./sprite/house.png");
        this.load.tilemapTiledJSON("map", "./map/house.json");
        this.load.spritesheet('tileSheet',
            './sprite/house.png',
            {frameWidth: 32, frameHeight: 32});

        // Preload mute buttons //
        this.load.spritesheet('mute',
            './sprite/BUTTON.png',
            {frameWidth: 32, frameHeight: 32}
        );

    }

    create() {

        // Initialize date, score, and character's direction.
        this.current_score = 0;
        this.face = 'down';
        this.currentDate = {
            day: 1,
            timeOfDay: "Morning"
        };

        // Audio //
        this.bgm = this.sound.add('house', {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.bgm.play();

        // Set global volume 50%
        this.sound.volume = 0.5;

        // Create the map //
        this.map = this.make.tilemap({key: "map"});
        const tileset = this.map.addTilesetImage("house", "tileImage");

        // Hardset the tiles to a fixed pixel size, or camera will stutter
        let tileLength = 96;

        // Create each layer, corresponds to the JSON map file //
        let floorLayer = this.map.createStaticLayer("floor", tileset, 0, 0);
        let wallLayer = this.map.createStaticLayer("wall", tileset, 0, 0);
        let objectLayer = this.map.createDynamicLayer("object", tileset, 0, 0);
        let decorLayer = this.map.createDynamicLayer("decor", tileset, 0, 0);
        let shadowLayer = this.map.createStaticLayer("shadow", tileset, 0, 0);
        let arrowLayer = this.map.createStaticLayer("arrow", tileset, 0, 0);

        // Makes display height and width of each layer equal to the number of tiles of our map. This ensures each
        // tile is a square as long as our map size does not change.
        floorLayer.displayWidth = 12 * tileLength;
        floorLayer.displayHeight = 10 * tileLength;
        wallLayer.displayWidth = 12 * tileLength;
        wallLayer.displayHeight = 10 * tileLength;
        objectLayer.displayWidth = 12 * tileLength;
        objectLayer.displayHeight = 10 * tileLength;
        decorLayer.displayWidth = 12 * tileLength;
        decorLayer.displayHeight = 10 * tileLength;
        shadowLayer.displayWidth = 12 * tileLength;
        shadowLayer.displayHeight = 10 * tileLength;
        arrowLayer.displayWidth = 12 * tileLength;
        arrowLayer.displayHeight = 10 * tileLength;

        //Player creation, starts on the bed (1103, 170)
        this.player = this.physics.add.sprite(1103, 170, 'hero');

        //Scale player to the specified size
        this.player.displayHeight = 92;
        this.player.displayWidth = 64;
        this.player.setDepth(10);

        //Player animation when walking. Repeat: -1 means loop the frames.
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('hero', {start: 6, end: 8}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('hero', {start: 9, end: 11}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('hero', {start: 3, end: 5}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('hero', {start: 0, end: 2}),
            frameRate: 10,
            repeat: -1
        });

        // The idle animations are used to determine where the player faces when movement stops.
        this.anims.create({
            key: 'idledown',
            frames: this.anims.generateFrameNumbers('hero', {start: 0, end: 0})
        });

        this.anims.create({
            key: 'idleup',
            frames: this.anims.generateFrameNumbers('hero', {start: 3, end: 3})
        });

        this.anims.create({
            key: 'idleright',
            frames: this.anims.generateFrameNumbers('hero', {start: 7, end: 7})
        });

        this.anims.create({
            key: 'idleleft',
            frames: this.anims.generateFrameNumbers('hero', {start: 10, end: 10})
        });

        // Arrow animation
        this.anims.create({
            key: 'arrow',
            frames: this.anims.generateFrameNumbers('tileSheet', {start: 53, end: 55}),
            frameRate: 3,
            repeat: -1
        });

        // Create the moving fishbowl animation
        this.anims.create({
            key: 'fishbowl',
            frames: this.anims.generateFrameNumbers('tileSheet', {start: 49, end: 50}),
            frameRate: 3,
            repeat: -1
        });

        // Create the running water animation for the sink
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

        // Create the TV animation when turned on
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

        // Create the computer animation when turned on
        this.anims.create({
            key: 'computeron',
            frames: this.anims.generateFrameNumbers('tileSheet', {start: 39, end: 41}),
            frameRate: 2
        });

        // Prevent camera from going past boundaries
        this.cameras.main.setBounds(0, 0, tileLength * 12, tileLength * 10);

        // Makes camera follow player
        this.cameras.main.startFollow(this.player);

        //Prevent player from moving outside the map borders.
        this.physics.world.setBounds(0, 0, tileLength * 12, tileLength * 10);
        this.player.setCollideWorldBounds(true);

        // Set collision for specified layers.
        this.map.setCollisionBetween(0, 999, true, true, wallLayer);
        this.map.setCollisionBetween(0, 999, true, true, objectLayer);

        //Add collision between player and objects in layer.
        this.physics.add.collider(this.player, wallLayer);
        this.physics.add.collider(this.player, objectLayer);

        // Gui Background

        // Create and show the accumulated score from playing the mini games. The score is positioned in the top right
        // corner of the screen and is always shown in this scene.
        this.mainScoreText = this.add.text(screenwidth * 0.95, screenheight * 0.02, 'Score: ' + this.current_score, {
            fontSize: '20px',
            fill: 'black',
            strokeThickness: 1
        });
        this.mainScoreText.setOrigin(1, 0);
        this.mainScoreText.setScrollFactor(0);
        this.mainScoreText.setDepth(10);

        // Shows the current day and time of day. This is positioned in the top left corner of the screen and is always shown.
        this.dateText = this.add.text(screenwidth * 0.05, screenheight * 0.02, "Day " + this.currentDate.day + " " + this.currentDate.timeOfDay, {
            fontSize: '20px',
            fill: 'black',
            strokeThickness: 1
        });
        this.dateText.setScrollFactor(0);
        this.dateText.setDepth(10);

        // Create a mute button that can be toggled on and off
        this.mute_button = this.physics.add.sprite(screenwidth * 0.85, screenheight * 0.1, 'mute', 3).setInteractive();
        this.mute_button.setScrollFactor(0);
        this.mute_button.setDepth(30);
        this.mute_button.setScale(2, 2);
        this.mute_button.on('pointerup', () => {
            if (this.sound.mute === false) {
                this.sound.mute = true;
                this.mute_button.setFrame(4);
            } else {
                this.sound.mute = false;
                this.mute_button.setFrame(3);
            }
        });
        if (this.sound.mute === true) {
            this.mute_button.setFrame(4);
        }

        // Create game objects from the OBJECT LAYER (2)
        this.map.setLayer(2);

        // Place shadow layer above all other layers and set opacity to 0.2
        shadowLayer.setDepth(20);
        shadowLayer.setAlpha(0.2);

        // Create interactive objects from a specified tile

        this.fridge = this.map.createFromTiles(7, null, {key: 'tileSheet', frame: 6})[0];
        // Adjust height and width to match the current size of a tile.
        this.fridge.displayHeight = tileLength;
        this.fridge.displayWidth = tileLength;
        this.fridge.setInteractive();

        // By default the origin is set to the middle of the object. Therefore, adjust the object so that it is in the middle of the tile.
        this.fridge.x = this.fridge.x + tileLength / 2;
        this.fridge.y = this.fridge.y + tileLength / 2;

        // Make the fridge interactive
        this.fridge.on('pointerdown', function () {
            // Only works if player is within 1 tile length from center of object
            if (this.fridge.x - tileLength < this.player.x && this.player.x < this.fridge.x + tileLength) {
                if (this.fridge.y - tileLength < this.player.y && this.player.y < this.fridge.y + tileLength) {
                    this.scene.setVisible(false);
                    this.scene.sleep();
                    this.scene.launch('startMiniGame', {object: "food"});
                    this.bgm.play();
                    this.bgm.pause();
                }
            }
        }, this);


        // Easter egg
        this.oven = this.map.createFromTiles(5, null, {key: 'tileSheet', frame: 4})[0];
        this.oven.displayHeight = tileLength;
        this.oven.displayWidth = tileLength;
        this.oven.x = this.oven.x + tileLength / 2;
        this.oven.y = this.oven.y + tileLength / 2;
        this.oven.setInteractive();
        this.oven.on('pointerdown', function () {
            // Only works if player is within 1 tile length from center of object
            if (this.oven.x - tileLength < this.player.x && this.player.x < this.oven.x + tileLength) {
                if (this.oven.y - tileLength < this.player.y && this.player.y < this.oven.y + tileLength) {
                    this.scene.pause();
                    this.scene.launch('dialogue', {content: easter_egg, spriteSet: "bonusset", spriteFrame: 5});
                }
            }
        }, this);

        // Garbage
        this.garbage = this.map.createFromTiles(43, null, {key: 'tileSheet', frame: 42})[0];
        this.garbage.displayHeight = tileLength;
        this.garbage.displayWidth = tileLength;
        this.garbage.x = this.garbage.x + tileLength / 2;
        this.garbage.y = this.garbage.y + tileLength / 2;
        this.garbage.setInteractive();
        this.garbage.on('pointerdown', function () {
            // Only works if player is within 1 tile length from center of object
            if (this.garbage.x - tileLength < this.player.x && this.player.x < this.garbage.x + tileLength) {
                if (this.garbage.y - tileLength < this.player.y && this.player.y < this.garbage.y + tileLength) {
                    this.scene.setVisible(false);
                    this.scene.pause();
                    this.scene.launch('startMiniGame', {object: "trash"});
                    this.bgm.play();
                    this.bgm.pause();
                }
            }
        }, this);

        // Lightswitch
        this.lights = "off";
        this.shadowOpacity = shadowLayer;
        this.switch = this.map.createFromTiles(52, null, {key: 'tileSheet', frame: 51})[0];
        this.switch.displayHeight = tileLength;
        this.switch.displayWidth = tileLength;
        this.switch.x = this.switch.x + tileLength / 2;
        this.switch.y = this.switch.y + tileLength / 2;
        this.switch.setInteractive();
        this.switch.on('pointerdown', function () {
            // Only works if player is within 1 tile length from center of object
            if (this.switch.x - tileLength < this.player.x && this.player.x < this.switch.x + tileLength) {
                if (this.switch.y - tileLength < this.player.y && this.player.y < this.switch.y + tileLength) {
                    // Turns on light if it's off
                    if (this.lights === 'off') {
                        shadowLayer.setVisible(false);
                        this.lights = 'on';
                        this.switch.setFrame(52);
                    }
                    // Else turns off light if it's on
                    else {
                        shadowLayer.setVisible(true);
                        this.lights = 'off';
                        this.switch.setFrame(51);
                    }
                }
            }
        }, this);

        // TV
        this.tvpower = "off";
        this.tvleft = this.map.createFromTiles(30, null, {key: 'tileSheet', frame: 29})[0];
        this.tvleft.displayHeight = tileLength;
        this.tvleft.displayWidth = tileLength;
        this.tvleft.x = this.tvleft.x + tileLength / 2;
        this.tvleft.y = this.tvleft.y + tileLength / 2;
        this.tvleft.setInteractive();
        this.tvleft.on('pointerdown', function () {
            if (this.tvleft.x - tileLength < this.player.x && this.player.x < this.tvleft.x + tileLength) {
                if (this.tvleft.y - tileLength < this.player.y && this.player.y < this.tvleft.y + tileLength) {
                    this.animateTV();
                }
            }
        }, this);

        this.tvright = this.map.createFromTiles(31, null, {key: 'tileSheet', frame: 30})[0];
        this.tvright.displayHeight = tileLength;
        this.tvright.displayWidth = tileLength;
        this.tvright.x = this.tvright.x + tileLength / 2;
        this.tvright.y = this.tvright.y + tileLength / 2;
        this.tvright.setInteractive();
        this.tvright.on('pointerdown', function () {
            if (this.tvright.x - tileLength < this.player.x && this.player.x < this.tvright.x + tileLength) {
                if (this.tvright.y - tileLength < this.player.y && this.player.y < this.tvright.y + tileLength) {
                    this.animateTV();
                }
            }
        }, this);

        // Create game objects from the DECOR LAYER (3)
        this.map.setLayer(3);

        // Appendix
        // Name the sprite objects in separate arrays
        this.objectnames = {
            'foodset': ['Meat', 'Rice', 'Cheese', 'Fish', 'Broccoli'],
            'shoppingset': ['FaceWash', 'Razor', 'Toothbrush', 'Cloth', 'Soap'],
            'trashset': ['PlasticCutlery', 'SaranWrap', 'Napkins', 'TeaBags', 'AppleCore']
        };

        // Picking a random set from the index of spriteSet
        // Can't access the properties of spriteSet through index because it's an object, so first create an array through object.Keys()
        let spriteKeys = Object.keys(this.objectnames);

        this.book = this.map.createFromTiles(49, null, {key: 'tileSheet', frame: 48})[0];
        this.book.displayHeight = tileLength;
        this.book.displayWidth = tileLength;
        this.book.x = this.book.x + tileLength / 2;
        this.book.y = this.book.y + tileLength / 2;
        this.book.setInteractive();
        this.book.on('pointerdown', function () {
            if (this.book.x - tileLength < this.player.x && this.player.x < this.book.x + tileLength) {
                if (this.book.y - tileLength < this.player.y && this.player.y < this.book.y + tileLength) {
                    this.scene.pause();
                    // Randomly access a set in spriteKeys
                    let randomSet = spriteKeys[Phaser.Math.Between(0, 2)];
                    // Randomly selects a number in the objectnames array to load corresponding to the spritesheet
                    let randomObj = Phaser.Math.Between(0, 4);
                    // Loads the corresponding item name to reference which dialogue to print
                    let appendixName = this.objectnames[randomSet][randomObj];
                    this.scene.launch('dialogue', {
                        content: appendix_script[appendixName],
                        spriteSet: randomSet,
                        spriteFrame: randomObj
                    });
                }
            }
        }, this);

        // Thank you poster!
        let thank_you_names = ["Alberto", "Frances", "Henry", "Nick", "Geoff"];

        this.poster = this.map.createFromTiles(28, null, {key: 'tileSheet', frame: 27})[0];
        this.poster.displayHeight = tileLength;
        this.poster.displayWidth = tileLength;
        this.poster.x = this.poster.x + tileLength / 2;
        this.poster.y = this.poster.y + tileLength / 2;
        this.poster.setInteractive();
        this.poster.on('pointerdown', function () {
            if (this.poster.x - tileLength < this.player.x && this.player.x < this.poster.x + tileLength) {
                if (this.poster.y - tileLength < this.player.y && this.player.y < this.poster.y + tileLength) {
                    this.scene.pause();
                    // Random name in the array
                    let randomNum = [Phaser.Math.Between(0, 4)];
                    let randomName = thank_you_names[randomNum];
                    this.scene.launch('dialogue', {
                        content: thank_you[randomName],
                        spriteSet: "bonusset",
                        spriteFrame: randomNum,
                    });
                }
            }
        }, this);

        // Cactus
        this.cactus = this.map.createFromTiles(29, null, {key: 'tileSheet', frame: 28})[0];
        this.cactus.displayHeight = tileLength;
        this.cactus.displayWidth = tileLength;
        this.cactus.x = this.cactus.x + tileLength / 2;
        this.cactus.y = this.cactus.y + tileLength / 2;
        this.cactus.setInteractive();
        this.cactus.on('pointerdown', function () {
            if (this.cactus.x - tileLength < this.player.x && this.player.x < this.cactus.x + tileLength) {
                if (this.cactus.y - tileLength < this.player.y && this.player.y < this.cactus.y + tileLength) {
                    this.scene.pause();
                    this.scene.launch('dialogue', {content: cactus, spriteSet: "bonusset", spriteFrame: 5});
                }
            }
        }, this);


        // DECOR LAYER ANIMATIONS
        // Fish bowl
        this.goldfish = this.map.createFromTiles(50, null, {key: 'tileSheet', frame: 49})[0];
        this.goldfish.displayHeight = tileLength;
        this.goldfish.displayWidth = tileLength;
        this.goldfish.x = this.goldfish.x + tileLength / 2;
        this.goldfish.y = this.goldfish.y + tileLength / 2;

        // Sink object and animation
        this.runningwater = false;
        this.resourcescore = 0;
        this.sink = this.map.createFromTiles(13, null, {key: 'tileSheet', frame: 12})[0];
        this.sink.displayHeight = tileLength;
        this.sink.displayWidth = tileLength;
        this.sink.x = this.sink.x + tileLength / 2;
        this.sink.y = this.sink.y + tileLength / 2;
        this.sink.setInteractive();
        this.sink.on('pointerdown', function () {
            if (this.sink.x - tileLength < this.player.x && this.player.x < this.sink.x + tileLength) {
                if (this.sink.y - tileLength < this.player.y && this.player.y < this.sink.y + tileLength) {

                    // Turns on sink if it's off
                    if (this.runningwater === false) {
                        this.sink.anims.play('runningwater', true);
                        this.runningwater = true;
                    }

                    // Else turns off sink if it's on
                    else {
                        this.sink.anims.play('stopwater');
                        this.runningwater = false;
                    }
                }
            }
        }, this);

        // Computer
        let computerpower = "off";
        this.computer = this.map.createFromTiles(40, null, {key: 'tileSheet', frame: 39})[0];
        this.computer.displayHeight = tileLength;
        this.computer.displayWidth = tileLength;
        this.computer.x = this.computer.x + tileLength / 2;
        this.computer.y = this.computer.y + tileLength / 2;
        this.computer.setInteractive();
        this.computer.on('pointerdown', function () {
            if (this.computer.x - tileLength < this.player.x && this.player.x < this.computer.x + tileLength) {
                if (this.computer.y - tileLength < this.player.y && this.player.y < this.computer.y + tileLength) {
                    if (computerpower === "off") {
                        this.computer.anims.play('computeron', true);
                        this.input.enabled = false;
                    } else {
                        this.computer.anims.playReverse('computeron', true);
                    }
                    this.computer.disableInteractive();
                }
            }
        }, this);
        this.computer.on('animationcomplete', function () {
            if (computerpower === "on") {
                computerpower = "off";
                this.computer.setInteractive();
            } else {
                computerpower = "on";
                setTimeout(function (scene) {
                    scene.scene.setVisible(false);
                    scene.scene.sleep();
                    scene.scene.launch('startMiniGame', {object: "shopping"});
                    scene.bgm.play();
                    scene.bgm.pause();
                    scene.computer.setInteractive();
                    scene.input.enabled = true;
                }, 60, this);
            }
        }, this);

        // Arrow animations
        this.map.setLayer(5);
        this.arrows = this.map.createFromTiles(54, -1, {key: 'tileSheet', frame: 53});
        // Loop through each arrow created from the tilemap and animate them
        for (let i = 0; i < this.arrows.length; i++) {
            this.arrows[i].displayHeight = tileLength;
            this.arrows[i].displayWidth = tileLength;
            this.arrows[i].x = this.arrows[i].x + tileLength / 2;
            this.arrows[i].y = this.arrows[i].y + tileLength / 2;
            this.arrows[i].setInteractive();
            this.arrows[i].anims.play('arrow', true);
        }

        // Create event listeners for "wake" only when the scene first starts up.
        if (this.events.listenerCount('wake') === 0) {

            // Update the score after each mini game is played
            this.events.on('wake', this.updateScore, this);

            // Update the day and time of day each time a mini game is played
            this.events.on('wake', this.updateDate, this);

            // Resume bgm
            this.events.on('wake', function () {
                this.bgm.resume();
            }, this);
        }


        // Run the starting dialogue.
        this.startGame();
    }

    // Animate both sides of the TV at the same time
    animateTV () {
        if (this.tvpower === "off") {
            this.tvleft.anims.play('leftscreenon', true);
            this.tvright.anims.play('rightscreenon', true);
            this.tvpower = "on";
        }
        else {
            this.tvleft.anims.play('leftscreenoff');
            this.tvright.anims.play('rightscreenoff');
            this.tvpower = "off";
        }
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
                this.shadowOpacity.setAlpha(0.2);
            }
            else if (this.currentDate.timeOfDay === "Morning"){
                this.currentDate.timeOfDay = "Noon";
                this.shadowOpacity.setAlpha(0);
            }
            else{
                this.currentDate.timeOfDay = "Night";
                this.shadowOpacity.setAlpha(0.5);
            }
            this.dateText.setText("Day " + this.currentDate.day + " " + this.currentDate.timeOfDay);
        }
        // Sets the window to the correct time of day
        this.updateWindow();
        // Ends the game if a certain day is reached
        this.endGame();
    }

    // Easter Egg Implementation
    // The plant slowly withers as the player's score increases (higher score = worse for the environment!)
    updatePlant(){
        // Set to decor layer then remove the plant sprites
        this.map.setLayer(3);
        this.map.removeTileAt(5, 1);
        this.map.removeTileAt(5, 0);
        // Set the plant sprite according to the right score
        if (this.current_score < 125){
            this.map.putTileAt(16, 5, 1);
            this.map.putTileAt(17, 5, 0);
        }
        if (125 <= this.current_score && this.current_score < 250){
            this.map.putTileAt(16, 5, 1);
            this.map.putTileAt(18, 5, 0);
        }
        if (250 <= this.current_score && this.current_score < 375){
            this.map.putTileAt(16, 5, 1);
            this.map.putTileAt(19, 5, 0);
        }
        if (375 <= this.current_score && this.current_score < 500){
            this.map.putTileAt(20, 5, 1);
        }
        if (500 <= this.current_score){
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

    startGame(){
        // opens dialog when game begins
        if (this.currentDate.day === 1 && this.currentDate.timeOfDay === "Morning"){
            this.scene.pause();
            this.scene.launch('dialogue', {content: game_story});
        }
    }

    endGame(){
        // End the game after 3 days
        if (this.currentDate.day === 4 && this.currentDate.timeOfDay === "Morning"){
            this.scene.stop();
            // Start the Endgame scene as well as sending the final score as data
            this.scene.start('Endgame', {score: this.current_score});
        }
    }

    update() {
        // Runs once per frame. Default is 60 frames per second.
        // Activepointer allows both mouse clicks and touch screen to work.
        if (this.input.activePointer.isDown)
        {
            // Move player to mouse pointer with a velocity of 250 pixels per second.
            this.physics.moveTo(this.player, this.input.activePointer.worldX, this.input.activePointer.worldY, 250);

            // If player within 1% of mouseclick, they will stop running and plays idle animation. This is necessary otherwise player will stutter on the spot.
            if (Math.abs(this.player.x - this.input.activePointer.worldX) < screenwidth*0.01 && Math.abs(this.player.y - this.input.activePointer.worldY) < screenheight*0.01) {
                {
                    this.player.body.velocity.setTo(0, 0);
                    this.player.anims.play('idle' + this.face, true);
                }
            }
            // Run the correct animation based on where the player is and where the screen was touched.
            // If horizontal distance > vertical distance, play the correct left or right animation.
            // If vertical distance > horizontal distance, play the correct up or down animation.
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
        // If there is no input, play the idle animation and set velocity to 0.
        else
        {
            this.player.anims.play('idle' + this.face, true);
            this.player.body.velocity.setTo(0, 0);
        }

        // Play fishbowl animation
        this.goldfish.anims.play('fishbowl', true);

        // Increases score if sink, lights, or TV is on.
        if (this.runningwater === true) {
            this.resourcescore += 1;
        }
        if (this.tvpower === "on") {
            this.resourcescore += 1;
        }
        if (this.lights === "on") {
            this.resourcescore += 1;
        }
        if (this.resourcescore >= 200) {
            this.current_score += 1;
            this.mainScoreText.setText('Score: ' + this.current_score);
            this.resourcescore -= 200;
        }
    }
}


// Dialogue scripts

let game_story = "Terrestrial Annihilator.....\n\n" +
    "Your awakening has begun. It is time for your calling. This so called 'Planet Earth' is much too clean. " +
    "You must rid the world of its purity and obliterate it with darkness. Failure is not an option.\n" +
    "Commence, my Lord!";

// Appendix script
let appendix_script = {Meat:
                            "Factory farming and industrial agriculture requires a large expanse of land to produce " +
                            "fodder, and space to keep the livestock. Additionally, the quantity of waste produced " +
                            "from the animals is far too large to decompose without suffocating surrounding ecosystems.",
                        Rice:
                            "Rice paddies are one of the largest man-made sources of methane gas. The crop must be " +
                            "cultivated in flooded lands during the growing period, creating ideal conditions for " +
                            "methanogenesis to be released into the atmosphere.",
                        Cheese:
                            "With the demand for dairy products comes a demand for dairy cows, and the land required " +
                            "to raise them. Lower-fat cheeses, such as skim mozzarella, gouda, and cottage cheese " +
                            "contain less dairy and fat, reducing the environmental impact of the production process.",
                        Fish:
                            "Smaller fish like mackerel are caught and harvested in more natural and eco-friendly ways, " +
                            "reducing environmental impact. Being so low on the food-chain, smaller fish tend to breed " +
                            "quickly, with few concerns of overfishing.",
                        Broccoli:
                            "Pesticides and fertilizer account for a significantly large amount of greenhouse gasses " +
                            "emitted into the atmosphere. Broccoli plants are naturally pest-resistant, requiring less " +
                            "chemicals to grow.",
                        FaceWash:
                            "Micro-beads are tiny pieces of plastic present in many cosmetics and hygienic products. " +
                            "Used for physical exfoliation, the plastic is non-biodegradable, yet small enough to flow " +
                            "through water filters, littering the oceans and harming marine life.",
                        Razor:
                            "Disposable razor blades are composed of many different materials, with only two " +
                            "factories in the world manufacturing them. Because the composition of the cartridges " +
                            "are so complex, recycling the components of a discarded blade is almost impossible.",
                        Toothbrush:
                            "Being disposable in nature, the mass production and consumption of toothbrushes leave " +
                            "behind harmful plastic by-products. Fortunately, several biodegradable toothbrush " +
                            "and toothpaste brands are available on the market.",
                        Cloth:
                            "Microfiber cloth is commonly used to clean without the need for chemical agents and " +
                            "disposable paper towels. Alternatively, they can be used for physical exfoliation in the " +
                            "place of micro-beads. However, during the process of washing a microfiber cloth, synthetic " +
                            "non-biodegradable microfibers may become loose and enter the waterways.",
                        Soap:
                            "Traditionally made of olive oil, modern castile soap may also contain coconut, castor, " +
                            "or hemp oils. Used as a shampoo, body wash, and a cleaning agent, the natural ingredients " +
                            "are both gentle on the skin and the eco-system.",
                        PlasticCutlery:
                            "The mass production of plastic cutlery utilizes large amounts of energy, emitting carbon " +
                            "into the atmosphere. Because they are only used once, discarded cutlery will quickly " +
                            "accumulate in landfills and waterways.",
                        SaranWrap:
                            "Plastic wrap is often used once before being discarded into the trash. While possible to " +
                            "recycle, information on how to dispose of specific types of cling film is not common " +
                            "knowledge leaving most of them in landfills.",
                        Napkins:
                            "Paper towels generally take 2 ~ 4 weeks to decompose, releasing methane in the process. " +
                            "Commonly used in for several day-to-day functions, a large amount of resources for the " +
                            "manufacturing and delivery process is used to meet consumer demand.",
                        TeaBags:
                            "Throwing a moist tea bag into a compost bin may increase the decomposition speed of the " +
                            "surrounding matter. If the bag is slippery to the touch, it may contain the plastic " +
                            "polypropylene and will not decompose. However, the damp leaves inside can still be used " +
                            "as fertilizer.",
                        AppleCore:
                            "Like any other organic matter, discarded food will eventually break down into soil. " +
                            "However, resources are still required to produce, distribute, and package food products. " +
                            "The process of decomposition will also produce methane gas."};


let thank_you = {
                Alberto:
                    "Alberto: ...",
                Frances:
                    "Frances: We worked really hard on this project. Please give us a good grade.",
                Henry:
                    "Henry: RIP Co-op.",
                Nick:
                    "Nick: Hello!",
                Geoff:
                    "Geoff: Maplestory is love. Maplestory is life. ChineseGang FTW.",};

let cactus = "Tommy May told me to put a cactus here.";

let easter_egg = "Did you ever hear the tragedy of Darth Thompson the Fierce?\n" +
    "I thought not. It's not a program the instructors would code for you. It's a CST legend. " +
    "Darth Thompson was a Dark Lord of Python, so powerful and so wise he could use the Code to " +
    "influence the grade book to create A's... He had such knowledge of programming that he could " +
    "even keep the ones he cared about from failing. The programming of the Code is a pathway to many " +
    "abilities some consider to be unnatural. He became so powerful... the only thing he was afraid of was " +
    "losing his files, which eventually, of course, he did. Unfortunately, he taught his students to commit to GitHub," +
    " then his students deleted 'master' in his sleep. It's ironic he could save others from failing, but not himself.";


