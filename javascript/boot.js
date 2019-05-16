
export default class Boot extends Phaser.Scene {
    constructor() {
        super({key: 'Boot'});
    }

    preload() {
        this.load.image('background_image', './assets/sky.png');

        this.load.image('play_button', './assets/play_button.png');

        this.load.image('setting_button', './assets/settings.png');

        this.load.image('close_button', './assets/close.png');

        //this.load.audio('bgm', './assets/ellinia_bgm.mp3');


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

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(screenwidth / 5.3, screenheight / 1.94, screenwidth / 1.6, screenheight / 19);
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
        let background = this.add.sprite(0, 0, 'background_image').setOrigin(0).setDepth(0);
        background.setScale(2);

        let play_button = this.add.image(screenwidth / 2, screenheight / 2,
            'play_button').setInteractive();
        play_button.setScale(0.5);
        let setting_button = this.add.image(screenwidth / 2, screenheight / 2 + 100,
            'setting_button').setInteractive();
        setting_button.setScale(0.5);
        let title_text = this.add.text(screenwidth / 2, screenheight / 5, 'Stomp The World', {fontSize: '2.5em', color: 'black', strokeThickness: 2});
        title_text.setOrigin(0.5, 0.5);

        let close_button = this.add.image(screenwidth / 2, screenheight / 1.15, 'close_button').setInteractive();
        let setting_text = this.add.text(screenwidth / 2, screenheight / 8, 'Settings', {fontSize: '32px', color: 'black'});
        setting_text.setOrigin(0.5, 0.5);

        let bgm_text = this.add.text(screenwidth / 6, screenheight / 2, 'BGM', {color: 'black'});
        let bgm_on = this.add.text(screenwidth / 1.4, screenheight / 2, 'ON', {color: 'black'}).setInteractive();
        let bgm_off = this.add.text(screenwidth / 1.2, screenheight / 2, 'OFF', {color: 'black'}).setInteractive();
        let bgm_on_box = this.add.graphics().lineStyle(2, 0xff0000)
            .strokeRect(screenwidth / 1.44, screenheight / 2.05,screenwidth / 10, screenheight / 20)
            .fillRect(screenwidth / 1.44, screenheight / 2.05, screenwidth / 10, screenheight / 20).fillStyle(0x9900FF, 0.4);
        let bgm_off_box = this.add.graphics().lineStyle(2, 0xff0000)
            .strokeRect(screenwidth / 1.22, screenheight / 2.05, screenwidth / 10, screenheight / 20)
            .fillRect(screenwidth / 1.22, screenheight / 2.05, screenwidth / 10, screenheight / 20).fillStyle(0x9900FF, 0.4);

        let sfx_text = this.add.text(screenwidth / 6, screenheight / 1.5, 'SFX', {color: 'black'});
        let sfx_on = this.add.text(screenwidth / 1.4, screenheight / 1.49, 'ON', {color: 'black'}).setInteractive();
        let sfx_off = this.add.text(screenwidth / 1.2, screenheight / 1.49, 'OFF', {color: 'black'}).setInteractive();
        let sfx_on_box = this.add.graphics().lineStyle(2, 0xff0000)
            .strokeRect(screenwidth / 1.44, screenheight / 1.52, screenwidth / 10, screenheight / 20)
            .fillRect(screenwidth / 1.44, screenheight / 1.52, screenwidth / 10, screenheight / 20).fillStyle(0x9900FF, 0.4);
        let sfx_off_box = this.add.graphics().lineStyle(2, 0xff0000)
            .strokeRect(screenwidth / 1.22, screenheight / 1.52, screenwidth / 10, screenheight / 20)
            .fillRect(screenwidth / 1.22, screenheight / 1.52, screenwidth / 10, screenheight / 20).fillStyle(0x9900FF, 0.4);

        let graphics = this.add.text(screenwidth / 6, screenheight / 3, 'Quality', {color: 'black'});
        let low_quality = this.add.text(screenwidth / 1.4, screenheight / 3, 'LOW', {color: 'black'}).setInteractive();
        let high_quality = this.add.text(screenwidth / 1.2, screenheight / 3, 'HIGH', {color: 'black'}).setInteractive();
        let low_quality_box = this.add.graphics().lineStyle(2, 0xff0000)
            .strokeRect(screenwidth / 1.432, screenheight / 3.1, screenwidth / 9, screenheight / 20)
            .fillRect(screenwidth / 1.432, screenheight / 3.1, screenwidth / 9, screenheight / 20).fillStyle(0x9900FF, 0.4);
        let high_quality_box = this.add.graphics().lineStyle(2, 0xff0000)
            .strokeRect(screenwidth / 1.21, screenheight / 3.1, screenwidth / 9, screenheight / 20)
            .fillRect(screenwidth / 1.21, screenheight / 3.1, screenwidth / 9, screenheight / 20).fillStyle(0x9900FF, 0.4);

        // let bgm = this.sound.add('bgm', {
        //     mute: false,
        //     volume: 1,
        //     rate: 1,
        //     detune: 0,
        //     seek: 0,
        //     loop: true,
        //     delay: 0,
        // });
        // bgm.play();

        close_button.visible = false;
        setting_text.visible = false;

        bgm_on.visible = false;
        bgm_off.visible = false;
        bgm_text.visible = false;
        bgm_on_box.visible = false;
        bgm_off_box.visible = false;

        sfx_on.visible = false;
        sfx_off.visible = false;
        sfx_text.visible = false;
        sfx_on_box.visible = false;
        sfx_off_box.visible = false;

        graphics.visible = false;
        low_quality.visible = false;
        high_quality.visible = false;
        low_quality_box.visible = false;
        high_quality_box.visible = false;

        this.sound.pauseOnBlur = false;

        play_button.on('pointerdown', () => {
            this.scene.start('MainHouse', {score: 0});
        });

        setting_button.on('pointerdown', () => {
            play_button.visible = false;
            setting_button.visible = false;
            title_text.visible = false;

            close_button.visible = true;
            setting_text.visible = true;

            bgm_on.visible = true;
            bgm_off.visible = true;
            bgm_text.visible = true;
            bgm_on_box.visible = true;
            bgm_off_box.visible = false;

            sfx_on.visible = true;
            sfx_off.visible = true;
            sfx_text.visible = true;
            sfx_on_box.visible = true;
            sfx_off_box.visible = false;

            graphics.visible = true;
            low_quality.visible = true;
            high_quality.visible = true;
            low_quality_box.visible = false;
            high_quality_box.visible = true;
        });

        close_button.on('pointerdown', () => {
            play_button.visible = true;
            setting_button.visible = true;
            title_text.visible = true;

            close_button.visible = false;
            setting_text.visible = false;

            bgm_on.visible = false;
            bgm_off.visible = false;
            bgm_text.visible = false;
            bgm_on_box.visible = false;
            bgm_off_box.visible = false;

            sfx_on.visible = false;
            sfx_off.visible = false;
            sfx_text.visible = false;
            sfx_on_box.visible = false;
            sfx_off_box.visible = false;

            graphics.visible = false;
            low_quality.visible = false;
            high_quality.visible = false;
            low_quality_box.visible = false;
            high_quality_box.visible = false;
        });

        bgm_on.on('pointerdown', () => {
            bgm_on_box.visible = true;
            bgm_off_box.visible = false;
            bgm.resume();
        });

        bgm_off.on('pointerdown', () => {
            bgm_on_box.visible = false;
            bgm_off_box.visible = true;
            bgm.pause();
        });

        sfx_on.on('pointerdown', () => {
            sfx_on_box.visible = true;
            sfx_off_box.visible = false;
        });

        sfx_off.on('pointerdown', () => {
            sfx_on_box.visible = false;
            sfx_off_box.visible = true;
        });

        low_quality.on('pointerdown', () => {
            low_quality_box.visible = true;
            high_quality_box.visible = false;
        });

        high_quality.on('pointerdown', () => {
            low_quality_box.visible = false;
            high_quality_box.visible = true;
        });
    }
}

const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;