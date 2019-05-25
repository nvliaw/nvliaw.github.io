// Loading screen & menu

export default class Boot extends Phaser.Scene {

    constructor() {
        super({key: 'Boot'});
    }

    // Preload all images and loading screen text.
    preload() {

        // Preload images
        this.load.image('background_image', './sprite/title.png');
        this.load.spritesheet('button', './sprite/BUTTON.png', { frameWidth: 32, frameHeight: 32 });

        // Preload spritesheets
        this.load.spritesheet('foodset',
            './sprite/food.png',
            {frameWidth: 32, frameHeight: 32});

        this.load.spritesheet('shoppingset',
            './sprite/shopping.png',
            {frameWidth: 32, frameHeight: 32});

        this.load.spritesheet('trashset',
            './sprite/trash.png',
            {frameWidth: 32, frameHeight: 32});

        this.load.spritesheet('bonusset',
            './sprite/bonus.png',
            {frameWidth: 32, frameHeight: 32});

        // Preload loading bar and text
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(screenwidth / 5.95, screenheight / 2, screenwidth / 1.5, screenheight / 12);

        let loadingText = this.make.text({
            x: screenwidth / 2,
            y: screenheight / 2.3,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: screenwidth / 2,
            y: screenheight / 1.84,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        let assetText = this.make.text({
            x: screenwidth / 2,
            y: screenheight / 1.55,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });

        assetText.setOrigin(0.5, 0.5);

        // Update progress bar as game loads
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(screenwidth / 5.3, screenheight / 1.94,
                                 screenwidth / 1.6, screenheight / 19);
        });
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }

    create() {
        // Create and display background image, buttons, and text for title screen
        let background = this.add.sprite(0, 0, 'background_image').setOrigin(0).setDepth(0);
        background.displayHeight = screenheight;
        background.displayWidth = screenwidth;

        let play_button = this.add.image(screenwidth / 2, screenheight / 2, 'button').setInteractive();
        play_button.setScale(4, 4);

        let about_button = this.add.image(screenwidth / 2, screenheight / 2 + 150, 'button').setInteractive();
        about_button.setFrame(5);
        about_button.setScale(3, 3);

        let title_text = this.add.text(screenwidth / 2, screenheight / 5, 'Stomp The World',
                                       {fontFamily: 'Courier', fontSize: '4em', color: 'black', strokeThickness: 6});
        title_text.setOrigin(0.5, 0.5);

        // Add event listeners to play and about buttons.
        play_button.on('pointerover', () => {
            play_button.frame = play_button.scene.textures.getFrame('button', 1);
        });

        play_button.on('pointerout', () => {
            play_button.frame = play_button.scene.textures.getFrame('button', 0);
        });

        play_button.on('pointerdown', () => {
            play_button.frame = play_button.scene.textures.getFrame('button', 2);
        });

        play_button.on('pointerup', () => {
            this.scene.start('MainHouse', {score: 0});
        });

        about_button.on('pointerover', () => {
            about_button.frame = about_button.scene.textures.getFrame('button', 6);
        });

        about_button.on('pointerout', () => {
            about_button.frame = about_button.scene.textures.getFrame('button', 5);
        });

        about_button.on('pointerdown', () => {
            about_button.frame = about_button.scene.textures.getFrame('button', 7);
        });

        about_button.on('pointerup', () => {
            about_button.frame = about_button.scene.textures.getFrame('button', 5);
            //open_about_page();
            this.scene.start("About");
        });

    }
}

function open_about_page() {
    let about_window = window.open('./about.html', '_blank');
    about_window.focus();
}

const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;