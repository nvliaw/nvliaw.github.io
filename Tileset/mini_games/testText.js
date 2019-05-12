const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

var content = `Did you ever hear the tragedy of Darth Plagueis the Wise?
I thought not. It's not a story the Jedi would tell you. It's a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life... He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural. He became so powerful... the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. It's ironic he could save others from death, but not himself.`;

export default class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'testText'
        })
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
        createTextBox(this, 25, 500, {
            wrapWidth: 360,
            // fixedWidth: 300,
            // fixedHeight: 75,
        }) // .start(<content>, <typing speed>), lower number = faster speed
            .start(content, 25);
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

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
            .setStrokeStyle(2, COLOR_LIGHT),

        icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),

        // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
        text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

        action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),
        actionMask: false,

        // Padding space
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            icon: 10,
            text: 10,
        }
    })
        .setOrigin(0)
        .layout();

    // Makes the textBox clickable and scrolls to the next words upon click
    console.log(this);
    textBox
        .setInteractive()
        .on('pointerdown', function () {
            this.getElement('action').setVisible(false)
            ;
            if (this.isTyping) {
                this.stop(true);
            } else {
                this.typeNextPage();
            }
        }, textBox)
        .on('pageend', function () {
            if (this.isLastPage) {
                //        if (this.timer === 0) {
                //             this.scene.stop();
                //             this.scene.wake('MainHouse', {score: this.score});
                //         }
                //     }
                scene.scene.stop();
                scene.scene.wake('MainHouse', {score: 0});
                return;
            }

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