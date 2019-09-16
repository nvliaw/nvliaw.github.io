const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;

export default class Geoff extends Phaser.Scene {
    constructor() {
        super({key: 'Geoff'});
    }
    preload(){
        this.load.image('button', './sprite/button.png');
        this.load.image("geoff", "assets/geoff.jpg");

    }
    create(){
        let background = this.add.sprite(0, 0, 'background_image').setOrigin(0).setDepth(0);
        background.setScale(2);
        this.geoff = this.add.image(screenwidth * 0.5, screenheight * 0.25, 'geoff');
        this.geoff.setOrigin(0.5);
        let bio_text = "Geoff Hui is a first term CST student at BCIT who is looking to pursue a career in game development. He came in not knowing whether it was the right path for him, but now he can safely say that he is happy about his choice. Geoff enjoys playing video games, but can also be found at the billiards playing pool."
        this.bio = this.add.text(screenwidth*0.05, screenheight*0.4, bio_text, {
            lineSpacing: '10',
            wordWrap: {width: screenwidth * 0.95, useAdvancedWrap: false}
        });
        this.bio.setColor('black');

        // Returns back to previous page when pressed
        let back_button = this.add.image(screenwidth*0.50 - 40, screenheight * 0.07, 'button').setInteractive();
        back_button.setFrame(17);
        back_button.setScale(1.5, 1.5);

        back_button.on('pointerup', () => {
            this.scene.start('About');
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

        // Return to home
        let home_button = this.add.image(screenwidth*0.50 + 40, screenheight * 0.07, 'button').setInteractive();
        home_button.setFrame(8);
        home_button.setScale(1.5, 1.5);

        home_button.on('pointerup', () => {
            this.scene.start('Boot');
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
    }
    update(){

    }
}
