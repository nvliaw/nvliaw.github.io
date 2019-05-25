// About Us page

const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;

export default class About extends Phaser.Scene {
    constructor() {
        super({key: 'About'});
    }
    preload(){
        // Preload all necessary images for this scene
        this.load.image('button', './sprite/button.png');
        this.load.image('background_image', './sprite/sky.png');
        this.load.image("geoff", "./sprite/geoff.jpg");
        this.load.image("henry", "./sprite/henry.jpg");
        this.load.image("frances", "./sprite/frances.jpg");
        this.load.image("nick", "./sprite/nick.jpg");
        this.load.image("alberto", "./sprite/alberto.jpg");
    }
    create(){
        let background = this.add.sprite(0, 0, 'background_image').setOrigin(0).setDepth(0);
        background.setScale(2);

        this.instructions = this.add.text(screenwidth*0.50, screenheight*0.18, "Click on any face to see our bio!" +
            "\n Or the book to see our story!");
        this.instructions.setOrigin(0.5);
        this.instructions.setColor('black');

        this.henry = this.add.image(screenwidth * 0.15, screenheight * 0.28, 'henry').setInteractive();
        this.henry.setScale(0.75);
        this.henry_text = this.add.text(screenwidth*0.50, screenheight*0.28, "Henry Liu");
        this.henry.on("pointerdown", () => {
            this.scene.sleep();
            this.scene.start("Henry")
        });
        this.henry_text.setColor('black');

        this.geoff = this.add.image(screenwidth * 0.15, screenheight * 0.43, 'geoff').setInteractive();
        this.geoff.setScale(0.75);
        this.geoff_text = this.add.text(screenwidth*0.50, screenheight*0.43, "Geoff Hui");
        this.geoff.on("pointerdown", () => {
            this.scene.start("Geoff");
        });
        this.geoff_text.setColor('black');

        this.frances = this.add.image(screenwidth * 0.15, screenheight * 0.58, 'frances').setInteractive();
        this.frances.setScale(0.75);
        this.frances_text = this.add.text(screenwidth*0.50, screenheight*0.58, "Frances Mach");
        this.frances.on("pointerdown", () => {
            this.scene.start("Frances")
        });
        this.frances_text.setColor('black');

        this.nick = this.add.image(screenwidth * 0.15, screenheight * 0.73, 'nick').setInteractive();
        this.nick.setScale(0.75);
        this.nick_text = this.add.text(screenwidth*0.50, screenheight*0.73, "Nicholas Liaw");
        this.nick.on("pointerdown", () => {
            this.scene.start("Nick")
        });
        this.nick_text.setColor('black');

        this.alberto = this.add.image(screenwidth * 0.15, screenheight * 0.88, 'alberto').setInteractive();
        this.alberto.setScale(0.75);
        this.alberto_text = this.add.text(screenwidth*0.50, screenheight*0.88, "Alberto Iglesias");
        this.alberto.on("pointerdown", () => {
            this.scene.start("Alberto")
        });
        this.alberto_text.setColor('black');

        // Returns to the 'Start' page when back button is pressed
        let back_button = this.add.image(screenwidth*0.50 - 40, screenheight * 0.07, 'button').setInteractive();
        back_button.setFrame(17);
        back_button.setScale(1.5, 1.5);

        back_button.on('pointerup', () => {
            this.scene.start('Boot');
        });

        back_button.on('pointerover', () => {
            back_button.frame = back_button.scene.textures.getFrame('button', 18);
        });

        back_button.on('pointerout', () => {
            back_button.frame = back_button.scene.textures.getFrame('button', 17);
        });

        back_button.on('pointerdown', () => {
            back_button.frame = back_button.scene.textures.getFrame('button', 19);
        });

        // Home button to our story
        let book_button = this.add.image(screenwidth*0.50 + 40, screenheight * 0.07, 'button').setInteractive();
        book_button.setFrame(11);
        book_button.setScale(1.5, 1.5);

        book_button.on('pointerup', () => {
            this.scene.start('Story');
        });

        book_button.on('pointerover', () => {
            book_button.frame = book_button.scene.textures.getFrame('button', 12);
        });

        book_button.on('pointerout', () => {
            book_button.frame = book_button.scene.textures.getFrame('button', 11);
        });

        book_button.on('pointerdown', () => {
            book_button.frame = book_button.scene.textures.getFrame('button', 13);
        });
    }
}