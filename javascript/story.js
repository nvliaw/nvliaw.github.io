const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;

export default class Story extends Phaser.Scene {
    constructor() {
        super({key: 'Story'});
    }

    preload() {
        this.load.image('button', './sprite/button.png');
    }

    create(){
        let background = this.add.sprite(0, 0, 'background_image').setOrigin(0).setDepth(0);
        background.setScale(2);
        this.story_text = this.add.text(screenwidth*0.10, screenheight*0.18,
        "It was a dark and stormy night...\n" + "\n ... Our group was thinking that so many are going about their day" +
            ", forgetting about the effects of climate change.\n" +
        "Things like overusing plastic or buying excessively can lead to detrimental effects.\n" +
            "\nWe wanted to show that it is humanity's climate change apathy that's the threat to our planet." +
            " Until we change the way we live, climate change will always be a problem for us." +
            "\n" + "\nIt is time for change. We need to stop willfully ignoring the problem of climate change. " +
            "Learn by playing our game and find out exactly what makes a person a Terrestrial Annihilator as your score" +
            "increases the more harm you do to the environment.",
            {
                font: '4vw Courier',
                lineSpacing: '5',
                wordWrap: {width: screenwidth * 0.90, useAdvancedWrap: false}
            });
        this.story_text.setOrigin(0.05);
        this.story_text.setColor('black');

        // Returns to the 'Start' page when back button is pressed
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
