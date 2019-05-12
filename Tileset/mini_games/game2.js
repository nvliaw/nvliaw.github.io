let game = new Phaser.Game(750, 500, Phaser.AUTO, '');

// Adds a 'play' object to the game state
game.state.add('play', {
    preload: function(){
        game.load.image('tree1', 'assets/tree.png');
        game.load.image('tree2', 'assets/tree2.png');
        game.load.image('tree3', 'assets/tree3.png');
    },
    create: function(){
        let state = this;
        // let treeSprite = game.add.sprite(400, 300, 'tree');
        // treeSprite.anchor.setTo(0.5, 0.5)

        let treeData = [
            {name: "Tree1", image: 'tree1', maxHP: 10},
            {name: "Tree2", image: 'tree2', maxHP: 20},
            {name: "Tree3", image: 'tree3', maxHP: 30},
        ];
        this.trees = this.game.add.group();

        var tree;
        treeData.forEach(function(data){
            tree = state.trees.create(500, state.game.world.centerY, data.image);
            tree.anchor.setTo(0.5);
            tree.scale.setTo(0.5,0.5);
            tree.details = data;

            // Allows clicking input
            tree.inputEnabled = true;
            tree.events.onInputDown.add(state.onClickTree, state);

            // Incorporating the tree's "health"
            tree.health = tree.maxHP = data.maxHP;
            // Using Phaser's built in methods for sprites (comes with HP and Lifespan components)
            tree.events.onKilled.add(state.onKilledTree, state);
            tree.events.onRevived.add(state.onRevivedTree, state);
        });

        // Get a random tree to chop down in the center of the screen
        this.currentTree = this.trees.getRandom();
        this.currentTree.position.set(this.game.world.centerX, this.game.world.centerY);

        // tree info
        this.treeInfo = this.game.add.group();
        this.treeInfo.position.setTo(this.currentTree.x - 200, this.currentTree.y + 100);
        this.treeNameText = this.treeInfo.addChild(this.game.add.text(0, 0, this.currentTree.details.name, {
            font: '48px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));
        this.treeHealthText = this.treeInfo.addChild(this.game.add.text(0, 80, this.currentTree.health + ' HP', {
            font: '32px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));

        // Shows the damage text when clicking
        this.dmgTextGroup = this.add.group();
        let dmgText;
        for (let i=0; i<50; i++){
            dmgText = this.add.text(0, 0, '1', {
                font: '64px Arial Black',
                fill: '#fff',
                strokeThickness: 4
            });
            dmgText.exists = false;
            dmgText.tween = game.add.tween(dmgText)
                .to({
                alpha: 0,
                y: 100,
                x: this.game.rnd.integerInRange(100, 500),
            }, 1000, Phaser.Easing.Cubic.Out);
            dmgText.tween.onComplete.add(function(text, tween){
                text.kill();
            });
            this.dmgTextGroup.add(dmgText);
        }

        // Represents the player
        this.player = {
            clickDamage: 1,
            score: 0
        };

        // Show the score on screen
        this.scoreText = this.game.add.text(20, 20, "score: " + this.player.score, {
            font: '28px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });

        // Timer on the top right of the screen
        this.timer = 500;
        this.timerText = this.add.text(500, 20, 'Time left: ' + this.timer, {
            font: '28px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });

    },
    // Used for the timer
    update: function(){
        if (this.timer > 0){
            this.decrement();
        }
        if (this.timer == 0){
            this.game.gamePaused();
            console.log(this.player.score);
        }
    },
    decrement: function(){
        this.timer -= 1;
        this.timerText.setText('Time left: ' + this.timer);
    },
    // Happens after update (which may not be used)
    render: function(){
        game.debug.text('Time to chop some trees!', 250, 250);
        game.debug.text(this.currentTree.details.name,
            this.game.world.centerX - this.currentTree.width/2,
            this.game.world.centerY - this.currentTree.height/2);
    },
    onClickTree: function(tree, pointer){
        // this.currentTree.position.set(1000, this.game.world.centerY);
        // this.currentTree = this.trees.getRandom();
        // this.currentTree.position.set(this.game.world.centerX, this.game.world.centerY);
        this.currentTree.damage(this.player.clickDamage);

        var dmgText = this.dmgTextGroup.getFirstExists(false);
        if (dmgText){
            dmgText.text = this.player.clickDamage;
            dmgText.reset(pointer.positionDown.x, pointer.positionDown.y);
            dmgText.alpha = 1;
            dmgText.tween.start();
        }
        // update the tree's health text
        this.treeHealthText.text = this.currentTree.alive ? this.currentTree.health + ' HP' : 'DEAD';

        // Increase score by 1 for each click
        this.player.score += 1;
        console.log(this.player.score);

        // update the player's score text
        this.scoreText.text = "score: " + this.player.score;
    },
    onKilledTree: function(){
        // Move tree off screen if it's killed
        this.currentTree.position.set(1000, this.game.world.centerY);
        // Increase the player's score depending on the tree they killed
        if (this.currentTree.details.name == "Tree1"){
            this.player.score += 10;
        }
        if (this.currentTree.details.name == "Tree2"){
            this.player.score += 20;
        }
        if (this.currentTree.name == "Tree3"){
            this.player.score += 30;
        }
        console.log(this.player.score);
        // Pick a new random monster
        this.currentTree = this.trees.getRandom();
        // Ensure the tree has full hp
        this.currentTree.revive(this.currentTree.maxHP);
    },
    onRevivedTree: function(tree){
        // Set the new tree's position
        this.currentTree.position.set(this.game.world.centerX, this.game.world.centerY);
        // Update the text to match the current tree
        this.treeNameText.text = tree.details.name;
        this.treeHealthText.text = tree.health + ' HP';
    }
});

// Initialize the 'play' object for the game
game.state.start('play');