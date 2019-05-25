// Dialogue logic

const COLOR_PRIMARY = 0x4fa19e;
const COLOR_LIGHT = 0x383838;
const COLOR_DARK = 0xc1f9f7;
const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;


export default class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'dialogue'
        })
    }

    // Collect content argument passed to this module
    init(data) {
        this.content = data.content;
        this.spriteSet =  data.spriteSet;
        this.spriteFrame = data.spriteFrame;
    }


    preload() {
        // Loads rexUI plugins
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        // Load appendix
        this.load.image('appendix', './sprite/appendix.png');

        // Load arrow for normal dialogue
        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
    }

    create() {

        // If the spriteSet key is empty, no images will be loaded
        if (this.spriteSet != null) {
            // Creates a random image, scaled to 96 x 96
            // 'Appendix' is the background, appendixObj is the actual object pictured
            let appendix = this.add.image(screenwidth / 2, screenheight / 2, 'appendix');
            let appendixObj = this.physics.add.sprite(screenwidth / 2, screenheight / 2, this.spriteSet, this.spriteFrame);
            // Scaling
            appendix.setScale(6, 6);
            appendixObj.setScale(4, 4);
        }

        // Sets where you want the text box to go + what size it should be
        let {width, height} = this.sys.game.canvas;
        createTextBox(this, screenwidth*0.01, screenheight*0.8, {
            wrapWidth: screenwidth*0.8
        }, 'nextPage') // .start(<content>, <typing speed>), lower number = faster speed
            .start(this.content, 10);

    }
}

// GetValue = Retrieves a value from an object;
// GetValue(<source>, <key>, <default>)
// <source>: the object to retrieve the value from
// <key>: name of the property to retrieve from the object
// <default>: value to return if the <key> isn't found in the <source>

const GetValue = Phaser.Utils.Objects.GetValue;
// constructor for the createTextBox object
let createTextBox = function (scene, x, y, config, image) {
    let wrapWidth = GetValue(config, 'wrapWidth', 0);
    let fixedWidth = GetValue(config, 'fixedWidth', 0);
    let fixedHeight = GetValue(config, 'fixedHeight', 0);
    // Further documentation: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-textbox/
    let textBox = scene.rexUI.add.textBox({
        x: x,
        y: y,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY)
            .setStrokeStyle(2, COLOR_LIGHT),

        icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_DARK),

        // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
        text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

        action: scene.add.image(0, 0, image).setVisible(false),
        actionMask: true,

        // Padding space
        space: {
            left: 5,
            right: 5,
            top: 5,
            bottom: 5,
            icon: 5,
            text: 5,
        }
    })
        .setOrigin(0)
        .layout();

    // Makes the textBox clickable and scrolls to the next words upon click
    textBox
        .setInteractive()
        .on('pointerdown', function () {
            this.getElement('action').setVisible(false)
            ;
            if (this.isLastPage && this.isTyping === false) {
                scene.scene.stop();
                scene.scene.wake('MainHouse', {score: 0, checkGame: false})
            }
            if (this.isTyping) {
                this.stop(true);
            } else {
                this.typeNextPage();
            }
        }, textBox)
        .on('pageend', function () {
            // Animation for the arrow
            var icon = this.getElement('action').setVisible(true);
            icon.y -= 30;
            var tween = scene.tweens.add({
                targets: icon,
                y: '+=30', // '+=100'
                ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                repeat: 0, // -1: infinity
                yoyo: false
            });
        }, textBox);
    //.on('type', function () {
    //})

    return textBox;
};

var getBuiltInText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.add.text(0, 0, '', {
        fontSize: '20px',
        wordWrap: {
            width: wrapWidth
        },
        maxLines: 3
    })
        .setFixedSize(fixedWidth, fixedHeight);
};


let getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,

        fontSize: '20px',
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        maxLines: 3
    })
};