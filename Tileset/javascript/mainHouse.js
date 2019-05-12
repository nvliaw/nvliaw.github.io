let current_score = 0;
let mainScoreText;
const screenwidth = window.innerHeight * 1.20;
const screenheight = window.innerHeight;
let face = 'down';

export default class MainHouse extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'MainHouse'});
    }

    init (data)
    {
        current_score += data.score;
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
        let map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("house", "tileImage");

        // Create each layer, corresponds to the JSON map file //
        let floorLayer = map.createStaticLayer("floor", tileset, 0, 0);
        let wallLayer = map.createStaticLayer("wall", tileset, 0, 0);
        let objectLayer = map.createStaticLayer("object", tileset, 0, 0);
        let decorLayer = map.createStaticLayer("decor", tileset, 0, 0);
        //Stretch the lay's width and height to fit to the screen.
        floorLayer.displayWidth = screenwidth;
        floorLayer.displayHeight = screenheight;
        wallLayer.displayWidth = screenwidth;
        wallLayer.displayHeight = screenheight;
        objectLayer.displayWidth = screenwidth;
        objectLayer.displayHeight = screenheight;
        decorLayer.displayWidth = screenwidth;
        decorLayer.displayHeight = screenheight;

        // Calculate height & width of an individual tile. Height and width are equal because tiles are squares.
        let tileLength = screenheight / objectLayer.tilemap.height;

        //Player creation
        this.player = this.physics.add.sprite(screenwidth*0.25, screenheight*0.75, 'hero');

        //Scale player to specified percentage.
        this.player.setScale(1, 1);

        //Player animation when walking left. Repeat:-1 is a loop.
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

        //Prevent player from moving outside canvas walls.
        this.player.setCollideWorldBounds(true);

        // Set collision for layers
        map.setCollisionBetween(1, 999, true, true, wallLayer);
        map.setCollisionBetween(1, 999, true, true, objectLayer);
        // objectLayer.setCollisionBetween(1, 999);

        //Add collision between player and objects in layer.
        this.physics.add.collider(this.player, wallLayer);
        this.physics.add.collider(this.player, objectLayer);

        console.log(map);
        map.setLayer(2);
        // Create game object from tilemap. This allows the fridge to be clicked.
        this.fridge = map.createFromTiles(7, null, {key: 'tileSheet', frame: 6})[0];
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

        mainScoreText = this.add.text(screenwidth*0.95, screenheight*0.02, 'Score: ' + current_score, {
            font: '2em Arial Black',
            fill: 'black',
            strokeThickness: 1
        });
        mainScoreText.setOrigin(1, 0);
        this.events.on('wake', this.updateScore, this);

        // For text box to appear
        let testText = "This should pop up some text.";
        this.textBoxText = this.add.text(0, 0, testText, {
            font: '2em Arial Black',
            fill: 'black',
            strokeThickness: 1
        });
        // this.textBoxText.setOrigin(0.5);
        // this.textBoxText.visible = false;
        //this.fridge = map.createFromTiles(9, null, {key: 'tileSheet', frame: 8})[0];


        this.oven = map.createFromTiles(5, null, {key: 'tileSheet', frame: 4})[0];
        this.oven.displayHeight = tileLength;
        this.oven.displayWidth = tileLength;
        this.oven.x = this.oven.x + tileLength/2;
        this.oven.y = this.oven.y + tileLength/2;
        this.oven.setInteractive();
        this.oven.on('pointerdown', function(){
            if (this.oven.x - tileLength < this.player.x && this.player.x < this.oven.x + tileLength){
                if (this.oven.y - tileLength < this.player.y && this.player.y < this.oven.y + tileLength){
                    // this.scene.setVisible(false);
                    this.scene.pause();
                    this.scene.launch('testText');
                }
            }
        }, this);
    }

    updateScore (parent, score) {
        current_score += score.score;
        mainScoreText.setText('Score: ' + current_score)
    }

    update() {
        // Runs once per frame.
        // Activepointer allows both mouse clicks and touch screen to work.
        if (this.input.activePointer.isDown)
        {
            //Move player towards mouse click or finger touch at velocity of 250.
            this.physics.moveTo(this.player, this.input.activePointer.x, this.input.activePointer.y, 250);

            //If player within 5% of mouseclick, they will stop running and plays idle animation. May have to adjust the tolerance number.
            if (Math.abs(this.player.x - this.input.activePointer.x) < screenwidth*0.02 && Math.abs(this.player.y - this.input.activePointer.y) < screenheight*0.02) {
                {
                    this.player.body.velocity.setTo(0, 0);
                    this.player.anims.play('idle' + face, true);
                }
            }
            //Else if player's position < clicked position, player runs right.
            else if (this.player.x < this.input.activePointer.x)
            {
                if (this.player.y - this.input.activePointer.y > this.input.activePointer.x - this.player.x) {
                    this.player.anims.play('up', true);
                    face = 'up';
                }
                else if (this.input.activePointer.y - this.player.y > this.input.activePointer.x - this.player.x){
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
                if (this.player.y - this.input.activePointer.y > this.player.x - this.input.activePointer.x) {
                    this.player.anims.play('up', true);
                    face = 'up';
                }
                else if (this.input.activePointer.y - this.player.y > this.player.x - this.input.activePointer.x) {
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
