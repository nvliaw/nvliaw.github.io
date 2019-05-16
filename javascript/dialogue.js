// Dialogue logic

const COLOR_PRIMARY = 205383;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const screenwidth = window.innerWidth;
const screenheight = window.innerHeight;


export default class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'dialogue'
        })
    }

    // Collect content argument to pass through this module
    init(data) {
        this.content = data.content;
    }


    preload() {
        // Loads rexUI plugins
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
    }

    create() {
        // Sets where you want the text box to go + what size it should be
        let {width, height} = this.sys.game.canvas;
        console.log(width);
        console.log(height);
        createTextBox(this, screenwidth*0.01, screenheight*0.8, {
            wrapWidth: screenwidth*0.8,
            // fixedWidth: 300,
            // fixedHeight: 75,
        }) // .start(<content>, <typing speed>), lower number = faster speed
            .start(this.content, 10);
    }

    update() {}
}

// GetValue = Retrieves a value from an object;
// GetValue(<source>, <key>, <default>)
// <source>: the object to retrieve the value from
// <key>: name of the property to retrieve from the object
// <default>: value to return if the <key> isn't found in the <source>

const GetValue = Phaser.Utils.Objects.GetValue;
// constructor for the createTextBox object
var createTextBox = function (scene, x, y, config) {
    var wrapWidth = GetValue(config, 'wrapWidth', 0);
    var fixedWidth = GetValue(config, 'fixedWidth', 0);
    var fixedHeight = GetValue(config, 'fixedHeight', 0);
    console.log(wrapWidth, fixedWidth, fixedHeight);
    // Further documentation: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-textbox/
    var textBox = scene.rexUI.add.textBox({
        x: x,
        y: y,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY)
            .setStrokeStyle(2, COLOR_LIGHT),

        icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_DARK),

        // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
        text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

        action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),
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

var getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
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

// var config = {
//     type: Phaser.AUTO,
//     parent: 'phaser-example',
//     width: 800,
//     height: 600,
//     scene: Demo
// };
//
// var game = new Phaser.Game(config);