class Play extends Phaser.Scene {
    constructor(){
        super("playScene")    
    }

    init(){
        key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        key5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    create(){
        this.speedBudget = 12;
        // makes a grey background
        this.bgImage = this.add.rectangle(0, 0, game.config.width, game.config.height, 0xaaaaaa, 1).setOrigin(0,0);

        this.currentlyRotating = false;
        this.rotationPhase = false;
        this.targeting = false;
        //console.log("We did it!")

        let playerA = new Friendly(this, 800, 120, 'circle', 0, "RoundBoi", null, [basicAttack, basicHeal], 30);
        let playerB = new Friendly(this, 800, 240, 'triangle', 0, "Illuminati", null, [basicHeal, groupAttack], 25);
        let playerC = new Friendly(this, 800, 360, 'square', 0, "Boring", null, [groupAttack, heavyAttack], 20);
        let playerD = new Friendly(this, 800, 480, 'hexagon', 0, "Bestagon", null, [groupHeal, selfHeal], 35);
        let playerE = new Friendly(this, 800, 600, 'star', 0, "Starwalker", null, [basicAttack, basicHeal], 100);

        this.playerUnits = [playerA, playerE, playerD];
        this.playerUnitsBench = [playerB, playerC];
        this.playerUnits.forEach((player) => {
            player.on('pointerup', () => {
                if (this.targeting){
                    this.receiveTarget(player);
                } else {
                    console.log("Go to ability select screen");
                }
            }, this);
        });

        this.playerUnitsBench.forEach((player) => {
            player.on('pointerup', () => {
                if (this.targeting){
                    this.receiveTarget(player);
                } else {
                    console.log("Go to ability select screen");
                }
            }, this);
        });


        this.arrangePlayers();
        

        let enemyA = this.add.rectangle(1100, 360, 64, 64, 0x654597, 1);
        let enemyB = this.add.rectangle(1100, 480, 64, 64, 0x654597, 1);
        let enemyC = this.add.rectangle(1100, 240, 64, 64, 0x654597, 1);

        this.enemyUnits = [enemyA, enemyB, enemyC];
        this.enemyUnits.forEach((enemy) => {
            enemy.on('pointerup', () => {
                this.receiveTarget(enemy);
            }, this);
        });
      
        // this is the center of the pentagon UI which contains information about the party members
        this.pentagonCenterX = game.config.width * .2;
        this.pentagonCenterY = game.config.height * .6;

        // the pentagon has five states, 1-5, each of which represents a different possible rotation.
        // the states are changed in the functions rotatePentagonUp() and rotatePentagonDown() at the beginning of the turn
        this.pentagonRotationState = 1;
        
        // this is a container that holds all the parts of the pentagon UI
        // a container lets us rotate all of them at once by rotating the container
        // right now, the container just has one sprite in it, but i will add more later
        this.pentagonContainer = this.add.container(this.pentagonCenterX, this.pentagonCenterY);

        // this is a place holder for a state machine for each part of the game.
        this.uiState = "rotate";

        // this is the sprite in the top that holds the text that the game uses to describe game mechanics and such
        this.textBoxSprite = this.add.sprite(
            25, // love to use magic numbers
            25,
            "text box"
        ).setOrigin(0, 0);
        
        // this is a pretty standard text config. i was thinking about using a more interesting font but i don't think it's worth
        // the energy to get one from google fonts. if u wanna change it be my guest 
        textConfig = {
            fontFamily: "arial",
            fontSize: "24px",
            color: "#000000",
            align: "left",
            padding: 20,
            wordWrap: {width: this.textBoxSprite.width - 40},
            lineHeight: "normal"
        };

        // this is the text that goes in the text box. i edit this in the other parts of the game.
        // there is a lot of room for text in the text box. in theory i would like to animate the text so that 
        // the older text gets pushed to the top by the new text coming in
        // ANYWAY from experience this kind of thing is really hard so i won't do it lol
        // just rewrite this.textBoxText.text to change what text it is. ezpz
        this.textBoxText = this.add.text(
            this.textBoxSprite.x,
            this.textBoxSprite.y,
            "",
            textConfig
        );

        // this is the sprite for the pentagon. i will probably split this up into smaller sprites so we can do more with them.
        this.pentagon = this.add.sprite(
            0,
            0,
            "pentagon",
        );
        this.pentagonContainer.add(this.pentagon);

        // this is the bit on top of the back half of the pentagon that makes it look greyed out
        this.pentagonCover = this.add.sprite(
            this.pentagonCenterX,
            this.pentagonCenterY,
            "pentagon cover",
        ).setAlpha(.8);
        // this creates the UI that the player uses to rotate the pentagon
        // we should probably put an intro or something to space out the game at the start but idk it works like this
        this.createRotateUI();
    }

    update(){
        if (!this.targeting && !this.rotationPhase){
            if (Phaser.Input.Keyboard.JustDown(key1)){
                this.pause(this.playerUnits[0], 0);
            } else if (Phaser.Input.Keyboard.JustDown(key2)){
                this.pause(this.playerUnits[1], 1);
            } else if (Phaser.Input.Keyboard.JustDown(key3)){
                this.pause(this.playerUnits[2], 2);
            }
        }
    }

    createRotateUI(){
        this.rotationPhase = true;

        // this is used in deleteRotateUI(). it contains every sprite created in this function
        this.rotateUIArray = [];

        // instructions displayed in the text box
        this.textBoxText.text = "Rotate your party?";  
        this.textBoxText.text += "\nClick up or down to rotate, check to confirm.";
        this.textBoxText.text += "\nOnly party members in the front three slots are active.";

        // this is the arrow pointing upwards. i love using magic numbers ;-)
        this.rotateButtonUp = this.add.sprite(
            this.pentagonCenterX + this.pentagon.width/2 + 64,
            this.pentagonCenterY - 125,
            "arrow"
        ).setInteractive({           
            useHandCursor: true     // makes the button appear clickable
        });

        // this makes it actually do something when you click it
        this.rotateButtonUp.on("pointerup", () => {
            if (!this.currentlyRotating){
                this.rotatePentagonUp();
            }
        });

        // adds it to the array of sprites
        this.rotateUIArray.push(this.rotateButtonUp);

        // this is the arrow pointing downwards.
        this.rotateButtonDown = this.add.sprite(
            this.pentagonCenterX + this.pentagon.width/2 + 64,
            this.pentagonCenterY + 125,
            "arrow"
        ).setInteractive({
            useHandCursor: true     // makes the button appear clickable
        });

        // flip it!
        this.rotateButtonDown.angle = 180;

        // makes the it do something when you click it
        this.rotateButtonDown.on("pointerup", () => {
            if (!this.currentlyRotating){
                this.rotatePentagonDown();
            }
        });

        // add it to the array of sprites
        this.rotateUIArray.push(this.rotateButtonDown);

        // this is the confirm button, shaped like a check mark
        this.checkButton = this.add.sprite(
            this.pentagonCenterX + this.pentagon.width/2 + 64,
            this.pentagonCenterY,
            "check"
        ).setInteractive({
            useHandCursor: true     // makes it appear clickable
        });

        // the function that the button does
        this.checkButton.on("pointerup", () => {
            this.deleteRotateUI();
        });

        // add it to the array of sprites
        this.rotateUIArray.push(this.checkButton);
    }

    // this will need to have createUseMoveUI() or w/e added at the end of it
    deleteRotateUI(){
        // destroy all the sprites created by createRotateUI()
        for(let i = 0; i < this.rotateUIArray.length; i++) {
            this.rotateUIArray[i].destroy();
        }
        // clears the text box
        this.textBoxText.text = "";
        this.rotationPhase = false;
    }

    // this rotates all of the pentagram UI counter clockwise
    rotatePentagonUp(){
        this.currentlyRotating = true;
        //console.log("rotate UP");
        // this goes from 1-5 and loops around
        this.pentagonRotationState--;
        if (this.pentagonRotationState == 0) {
            this.pentagonRotationState = 5;
        }
        
        // the angle that it is going to tween to
        let angleTarget = 72*(this.pentagonRotationState - 1);

        // the angle that it is right now
        let angle = this.pentagonContainer.angle;
        
        // this is angle wizardry that makes it tween not ugly
        // sometimes it spins the wrong way if you click too quickly but i don't want to fix that rn
        angleTarget = Phaser.Math.Angle.WrapDegrees(angleTarget);
        if (angleTarget == -angle) {
            angleTarget = angle - 72;
        }

        //console.log("rotation state:", this.pentagonRotationState);
        //console.log("angle is:", 72*(this.pentagonRotationState - 1));
        this.tweens.add({
            targets: this.pentagonContainer,
            angle: angleTarget,
            duration: 250,
            onComplete: function(){
                this.currentlyRotating = false;
                let A = this.playerUnits.shift();
                let B = this.playerUnitsBench.shift();
                this.playerUnits.push(B);
                this.playerUnitsBench.push(A);
                this.arrangePlayers();
                //console.log("Should be able to rotate again");
            },
            onCompleteScope: this
        });
        //this.pentagonContainer.angle = 72*(this.pentagonRotationState - 1);
    }

    // it's late and i don't want to comment this. it's the same as the last function except with inversed numbers
    // it rotates the other way
    rotatePentagonDown(){
        this.currentlyRotating = true;
        //console.log("rotate DOWN");
        this.pentagonRotationState++;
        if (this.pentagonRotationState == 6) {
            this.pentagonRotationState = 1;
        }

        let angleTarget = 72*(this.pentagonRotationState - 1);
        let angle = this.pentagonContainer.angle;
        
        angleTarget = Phaser.Math.Angle.WrapDegrees(angleTarget);
        if (angleTarget == -angle) {
            angleTarget = angle + 72;
        }
        //console.log("rotation state:", this.pentagonRotationState);
        //console.log("angle is:", angleTarget);
        this.tweens.add({
            targets: this.pentagonContainer,
            angle: angleTarget,
            duration: 250,
            onComplete: function(){
                this.currentlyRotating = false;
                let A = this.playerUnits.pop();
                let B = this.playerUnitsBench.pop();
                this.playerUnits.unshift(B);
                this.playerUnitsBench.unshift(A);
                this.arrangePlayers();
                console.log("Should be able to rotate again");
            },
            onCompleteScope: this
        });
    }

    pause(char, num) {
        this.deleteRotateUI();
        let selectData = { 
            srcScene: "playScene",
            pentagonCenterX: this.pentagonCenterX,
            pentagonCenterY: this.pentagonCenterY,
            currentCharacter: char,
            charNum: num,
            maxSpeed: this.speedBudget,
            currSpeed: 0,
            currSelect: -1
        }
        //console.log(char.queuedAction);
        if (char.queuedAction.ability != null){
            //console.log(char.queuedAction.speed);
            selectData.currSelect = char.queuedAction.ability;
            selectData.currSpeed = char.queuedAction.speed;
        }
        this.scene.launch('pauseScene', selectData);
        this.scene.pause();
    }

    target(tarEnemy = true) {
        this.targeting = true;
        if (tarEnemy){
            this.enemyUnits.forEach((enemy) => {
                enemy.setInteractive();
            });
        }
        else {
            this.playerUnits.forEach((player) => {
                player.setInteractive();
            });
        }


        
        //let TARGETBOX = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x654597, 0.1).setOrigin(0,0);
    }

    receiveTarget(tar) {
        this.targeting = false;
        this.enemyUnits.forEach((enemy) => {
            enemy.removeInteractive();
        })
        this.playerUnits.forEach((player) => {
            player.removeInteractive();
        })
        //tar.setTint(0x000000);
        //tar.setScale(2);

        this.scene.wake("pauseScene");
        let scene = this.scene.get("pauseScene")
        scene.receiveTarget(tar);
    }

    arrangePlayers(){
        let i = 0;
        while (i < 5){
            let index = i % 3;
            let player;
            if (i < 3){
                player = this.playerUnits[index];
            } else {
                player = this.playerUnitsBench[index];
            }
            player.y = 120 + 120*i;
            i += 1;
        }
    }

    receiveAction(action, num){
        //console.log(num);
        let budgetChange = action.speed - this.playerUnits[num].queuedAction.speed;
        this.playerUnits[num].queuedAction = action;
        this.speedBudget -= budgetChange;
    }
}