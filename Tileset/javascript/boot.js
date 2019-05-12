
export default class Boot extends Phaser.Scene {
    constructor() {
        super({key: 'Boot'});
    }

    preload() {
        this.load.image('background_image', './assets/sky.png');

        this.load.image('play_button', './assets/play_button.png');

        this.load.image('setting_button', './assets/settings.png');

        this.load.image('close_button', './assets/close.png');

        this.load.audio('bgm', './assets/ellinia_bgm.mp3');

        let screenwidth = this.cameras.main.width;


        // stalls progress bar on loading screen
        // for (let i = 0; i < 25; i++) {
        //     this.load.image('background_image' + i, './assets/sky.png');
        // }

        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(120, 270, screenwidth-240, 50);

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
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
            progressBar.fillRect(130, 280, screenwidth - 260, 30);
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

        let play_button = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2,
            'play_button').setInteractive();
        let setting_button = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100,
            'setting_button').setInteractive();
        let title_text = this.add.text(this.game.renderer.width / 3, 100, 'Game Title', {fontSize: '32px', color: 'black'});

        let close_button = this.add.image(this.game.renderer.width / 2, 500, 'close_button').setInteractive();
        let setting_text = this.add.text(this.game.renderer.width / 3, 100, 'Settings', {fontSize: '32px', color: 'black'});

        let bgm_text = this.add.text(50, 300, 'BGM', {color: 'black'});
        let bgm_on = this.add.text(300, 300, 'ON', {color: 'black'}).setInteractive();
        let bgm_off = this.add.text(350, 300, 'OFF', {color: 'black'}).setInteractive();
        let bgm_on_box = this.add.graphics().lineStyle(2, 0xff0000).strokeRect(290, 291, 40, 30)
            .fillRect(290, 291, 40, 30).fillStyle(0x9900FF, 0.4);
        let bgm_off_box = this.add.graphics().lineStyle(2, 0xff0000).strokeRect(345, 291, 40, 30)
            .fillRect(345, 291, 40, 30).fillStyle(0x9900FF, 0.4);

        let sfx_text = this.add.text(50, 400, 'SFX', {color: 'black'});
        let sfx_on = this.add.text(300, 400, 'ON', {color: 'black'}).setInteractive();
        let sfx_off = this.add.text(350, 400, 'OFF', {color: 'black'}).setInteractive();
        let sfx_on_box = this.add.graphics().lineStyle(2, 0xff0000).strokeRect(290, 391, 40, 30)
            .fillRect(290, 391, 40, 30).fillStyle(0x9900FF, 0.4);
        let sfx_off_box = this.add.graphics().lineStyle(2, 0xff0000).strokeRect(345, 391, 40, 30)
            .fillRect(345, 391, 40, 30).fillStyle(0x9900FF, 0.4);

        let graphics = this.add.text(50, 200, 'Quality', {color: 'black'});
        let low_quality = this.add.text(300, 200, 'LOW', {color: 'black'}).setInteractive();
        let high_quality = this.add.text(350, 200, 'HIGH', {color: 'black'}).setInteractive();
        let low_quality_box = this.add.graphics().lineStyle(2, 0xff0000).strokeRect(290, 191, 50, 30)
            .fillRect(290, 191, 50, 30).fillStyle(0x9900FF, 0.4);
        let high_quality_box = this.add.graphics().lineStyle(2, 0xff0000).strokeRect(345, 191, 50, 30)
            .fillRect(345, 191, 50, 30).fillStyle(0x9900FF, 0.4);

        let bgm = this.sound.add('bgm', {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0,
        });
        bgm.play();

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