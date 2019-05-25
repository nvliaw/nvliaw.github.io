const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;

export default class Alberto extends Phaser.Scene {
    constructor() {
        super({key: 'Alberto'});
    }
    preload(){
        this.load.image('button', './sprite/button.png');
        this.load.image("alberto", "./sprite/alberto.jpg");

    }
    create(){
        let background = this.add.sprite(0, 0, 'background_image').setOrigin(0).setDepth(0);
        background.setScale(2);
        this.alberto = this.add.image(screenwidth * 0.5, screenheight * 0.25, 'alberto');
        this.alberto.setOrigin(0.5);
        this.bio_text = "Alberto is a first term CST student. He has a lot of hair. That's all you need to know.";
        this.bio = this.add.text(screenwidth*0.05, screenheight*0.4, this.bio_text,{
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
