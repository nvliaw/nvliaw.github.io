const screenwidth = window.innerHeight * 1.20;
const screenheight = window.innerHeight;


export default class MiniGame2 extends Phaser.Scene {


    constructor() {
        super({key: 'MiniGame2'});
    }

    preload() {
        this.load.image('tree1', 'mini_games/assets/tree.png');
        this.load.image('tree2', 'mini_games/assets/tree2.png');
        this.load.image('tree3', 'mini_games/assets/tree3.png');
    }

    create() {
        // I think this is just tree1.
        // let treeSprite = game.add.sprite(400, 300, 'tree');
        // treeSprite.anchor.setTo(0.5, 0.5);

        let treeData = [
            {name: "Tree1", image: 'tree1', maxHP: 10},
            {name: "Tree2", image: 'tree2', maxHP: 20},
            {name: "Tree3", image: 'tree3', maxHP: 30},
        ];
        let trees = this.physics.add.group();

        treeData.forEach(function(data){
            let tree = trees.create(screenwidth*2, screenheight*2, data.image);
            // tree.anchor.setTo(0.5);
            tree.setScale(0.5,0.5);
            tree.details = data;

            // Incorporating the tree's "health"
            tree.health = tree.maxHP = data.maxHP;

            // Allows clicking input
            tree.setInteractive();
            tree.on('pointerdown', function() {
                console.log(this);
                // this.currentTree.damage(this.player.clickDamage);
                //
                // var dmgText = this.dmgTextGroup.getFirstExists(false);
                // if (dmgText){
                //     dmgText.text = this.player.clickDamage;
                //     dmgText.reset(game.input.activePointer.x, game.input.activePointer.y);
                //     dmgText.alpha = 1;
                //     dmgText.tween.start();
                // }
                // update the tree's health text
                treeHealthText.text = "TREE DIED" ? currentTree.health + ' HP' : 'DEAD';

                // Increase score by 1 for each click
                player.score += 1;
                tree.health -= 1;

                if (tree.health === 0) {
                    player.score += tree.maxHP;
                    tree.health = tree.maxHP;
                    tree.x = screenwidth*2;
                    tree.y = screenheight*2;
                    currentTree = allTrees[Phaser.Math.Between(0,2)];
                    currentTree.x = screenwidth/2;
                    currentTree.y = screenheight/2;
                    console.log(currentTree.details.name)
                }

                // update the player's score text
                scoreText.text = "score: " + player.score;
                MiniGame2.prototype.updateScore(player.score);
                MiniGame2.prototype.playtween(this, currentTree);
            }, this);

            // Incorporating the tree's "health"

            // Using Phaser's built in methods for sprites (comes with HP and Lifespan components)
            // tree.events.onKilled.add(state.onKilledTree, state);
            // tree.events.onRevived.add(state.onRevivedTree, state);
        }, this);

        // Get a random tree to chop down in the center of the screen
        let allTrees = trees.getChildren();
        var currentTree = allTrees[Phaser.Math.Between(0,2)];
        currentTree.x = screenwidth/2;
        currentTree.y = screenheight/2;
        console.log(currentTree.details.name);
        // this.currentTree.position.set(screenwidth/2, screenheight/2);
        // tree info
        // this.treeInfo = this.add.group();
        // this.treeInfo.position.setTo(this.currentTree.x - 200, this.currentTree.y + 100);
        // this.treeInfo.x = currentTree.x - 200;
        // this.treeInfo.y = currentTree.y + 100;
        let treeNameText = this.add.text(0, 0, currentTree.details.name, {
            font: '48px Arial Black',
            fill: '#fff',
            strokeThickness: 1
        });
        treeNameText.setPosition(currentTree.x, currentTree.y + 200);
        treeNameText.setOrigin(0.5, 0.5);
        let treeHealthText = this.add.text(screenwidth/2, screenheight - 20, currentTree.health + ' HP', {
            font: '32px Arial Black',
            fill: '#fff',
            strokeThickness: 1
        });
        treeHealthText.setOrigin(0.5, 1);

        // Represents the player
        let player = {
            clickDamage: 1,
            score: 0
        };

        // Show the score on screen
        let scoreText = this.add.text(screenwidth/2, 80 , "Score: " + player.score, {
            font: '28px Arial Black',
            fill: '#fff',
            strokeThickness: 1
        });
        scoreText.setOrigin(0.5, 0.5);

        // Timer on the top right of the screen
        this.timer = 500;
        this.timerText = this.add.text(screenwidth - 20, 20, 'Time left: ' + this.timer, {
            font: '28px Arial Black',
            fill: '#fff',
            strokeThickness: 1
        });
        this.timerText.setOrigin(1, 0)
    }

    update() {
        console.log(this);
        if (this.timer > 0){
            this.decrement();
        }
        if (this.timer === 0){
            this.scene.sleep();
            console.log(this.score);
        }
    }

    updateScore(score) {
        console.log(this);
        this.score = score;
    }

    decrement() {
        this.timer -= 1;
        this.timerText.setText('Time left: ' + this.timer);
    }

    // Shows the damage text when clicking
    playtween(scene, currentTree) {
        let dmgText = scene.add.text(currentTree.x + Phaser.Math.Between(-25, 25), currentTree.y, '1', {
            font: '64px Arial Black',
            fill: '#fff',
            strokeThickness: 1
        });

        dmgText.exists = false;
        dmgText.tween = scene.tweens.add({
            targets: dmgText,
            alpha: 0,
            x: currentTree.x + Phaser.Math.Between(-100, 100),
            y: currentTree.y + Phaser.Math.Between(-250, -100),
            ease: 'Cubic.easeInOut',
            duration: 1500,
            repeat: 0,
            yoyo: false
        });
    }

    // render() {
    // game.debug.text('Time to chop some trees!', 250, 250);
    // game.debug.text(this.currentTree.details.name,
    //     this.game.world.centerX - this.currentTree.width/2,
    //     this.game.world.centerY - this.currentTree.height/2);
    // }

    //Added to function above..
    // onClickTree() {
    // this.currentTree.damage(this.player.clickDamage);
    //
    // var dmgText = this.dmgTextGroup.getFirstExists(false);
    // if (dmgText){
    //     dmgText.text = this.player.clickDamage;
    //     dmgText.reset(game.input.activePointer.x, game.input.activePointer.y);
    //     dmgText.alpha = 1;
    //     dmgText.tween.start();
    // }
    // update the tree's health text
    //     this.treeHealthText.text = "TREE DIED" ? this.currentTree.health + ' HP' : 'DEAD';
    //
    //     // Increase score by 1 for each click
    //     this.player.score += 1;
    //     console.log(this.player.score);
    //
    //     // update the player's score text
    //     this.scoreText.text = "score: " + this.player.score;
    // }

    // onKilledTree() {
    //     // Move tree off screen if it's killed
    //     this.currentTree.position.set(1000, this.game.world.centerY);
    //     // Increase the player's score depending on the tree they killed
    //     if (this.currentTree.details.name == "Tree1"){
    //         this.player.score += 10;
    //     }
    //     if (this.currentTree.details.name == "Tree2"){
    //         this.player.score += 20;
    //     }
    //     if (this.currentTree.name == "Tree3"){
    //         this.player.score += 30;
    //     }
    //     console.log(this.player.score);
    //     // Pick a new random monster
    //     this.currentTree = this.trees.getRandom();
    //     // Ensure the tree has full hp
    //     this.currentTree.revive(this.currentTree.maxHP);
    // }

    // onRevivedTree(tree) {
    //     // Set the new tree's position
    //     this.currentTree.position.set(this.game.world.centerX, this.game.world.centerY);
    //     // Update the text to match the current tree
    //     this.treeNameText.text = tree.details.name;
    //     this.treeHealthText.text = tree.health + ' HP';
    // }

}