// The game config that is used by Phaser
var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

// Create a new Phaser Game object
var game = new Phaser.Game(config);

function preload () {
    // Load the plugin
    //this.load.plugin('DialogModalPlugin', './dialogue_plugin.js');
}

function create () {
    // Install the plugin in the Phaser scene that I want
    // this.sys.install('DialogModalPlugin');
    // console.log(this.sys.dialogModal);
    // this.sys.dialogModal.init();
    // this.sys.dialogModal.setText('Hey this is my sick mini game text', true);
    let plugin = this.plugins.get('DialogModalPlugin');

}