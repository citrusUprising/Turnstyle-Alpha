class Play extends Phaser.Scene {
    constructor(){
        super("playScene")    
    }

    init(){
        // Save a bunch of keys
        key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        key5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    create(){
        // This will store
        this.actionQ = [];

        // Player variables for tracking speed resource.
        this.speedPerTurn = 12;
        this.speedBudget = this.speedPerTurn;

        // If the pentagon is currently spinning
        this.currentlyRotating = false;
        // If we are in the phase of the game that the player can rotate
        this.rotationPhase = false;
        // If we are in targeting mode.
        this.targeting = false;

        // this is the text that shows in the textbox when the player isn't hovering over anything
        this.defaultText = "";
        this.hoverText = "";

        // makes a grey background
        this.bgImage = this.add.rectangle(0, 0, game.config.width, game.config.height, 0xaaaaaa, 1).setOrigin(0,0);

        
        this.playerUnits = [];
        this.playerUnitsBench = [];
        this.enemyUnits = [];

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

        // this is the sprite for the pentagon. i will probably split this up into smaller sprites so we can do more with them.
        this.pentagon = this.add.sprite(
            0,
            0,
            "pentagon",
        );
        this.pentagonContainer.add(this.pentagon);

        this.starHoverText = "";
        this.starSprite = new Friendly(this, 90, 0, 'star', 0, "Sniper", null, [shoot, flashBang, pinpoint], 10);
        this.starSprite.setScale(1.5, 1.5).setInteractive();
        this.pentagonContainer.add(this.starSprite);
        this.starSprite.hoverText = "Star";
        this.addHoverText(this.starSprite);

        this.circleHoverText = "";
        this.circleSprite = new Friendly(this, 32, -93, 'circle', 0, "Medic", null, [drone, flareGun, cure], 11);
        this.circleSprite.setScale(1.5, 1.5).setInteractive();
        this.pentagonContainer.add(this.circleSprite);
        this.circleSprite.hoverText = "Circle";
        this.addHoverText(this.circleSprite);

        this.squareHoverText = "";
        this.squareSprite = new Friendly(this, -80, -47, 'square', 0, "Juggernaut", null, [swipe, bulwark, bullrush], 20);
        this.squareSprite.setScale(1.5, 1.5).setInteractive();
        this.pentagonContainer.add(this.squareSprite);
        this.squareSprite.hoverText = "Square";
        this.addHoverText(this.squareSprite);

        this.triangleHoverText = "";
        this.triangleSprite = new Friendly(this, -69, 62, 'triangle', 0, "Bounty Hunter", null, [assault, feint, enhance], 16);
        this.triangleSprite.setScale(1.5, 1.5).setInteractive();
        this.pentagonContainer.add(this.triangleSprite);
        this.triangleSprite.hoverText = "Triangle";
        this.addHoverText(this.triangleSprite);

        this.hexagonHoverText = "";
        this.hexagonSprite = new Friendly(this, 24, 94, 'hexagon', 0, "Telepath", null, [soothe, invigorate, panicAttack], 14);
        this.hexagonSprite.setScale(1.5, 1.5).setInteractive();
        this.pentagonContainer.add(this.hexagonSprite);
        this.hexagonSprite.hoverText = "Hexagon";
        this.addHoverText(this.hexagonSprite);

        // this is the bit on top of the back half of the pentagon that makes it look greyed out
        this.pentagonCover = this.add.sprite(
            this.pentagonCenterX,
            this.pentagonCenterY,
            "pentagon cover",
        ).setAlpha(.8);

        // PlayerUnits -> playerUnitsBench store all the player team in clockwise order.
        this.totalUnits = [this.circleSprite, this.starSprite, this.hexagonSprite, this.triangleSprite, this.squareSprite];
        this.playerUnits = [this.circleSprite, this.starSprite, this.hexagonSprite];
        this.playerUnitsBench = [this.triangleSprite, this.squareSprite];

        // This gives all the players an onclick function that either targets them, or goes to their ability select screen
        let j = 0;
        while (j < this.totalUnits.length){
            let player = this.totalUnits[j];
            let z = j;
            player.on('pointerup', () => {
                if (!player.dead){
                    if (this.targeting){
                        this.receiveTarget(player);
                    } else {
                        if (!this.rotationPhase){
                            let index = (z + (this.pentagonRotationState - 1)) % 5;
                            // Currently! This never happens becaus the player is never set interactive outside of the targeting phase.
                            // To make that work, we'd need carefully set/remove interactive so players are
                                // Interactive during: Targeting Allies & Ability picking
                                // Non-interactive during: rotation & targeting enemies
                            if (index < 3){
                                this.pause(index);
                            }
                        }
                    }
                }   
            })
            j++;
        }

        // This positions the player sprites in a vertical line, top->bottom matching clockwise order
        // this.arrangePlayers();

        // creating the health bars for each of the players
        var startVal = 25; // distance from left of game boundary/objects
        var spriteY = 660; // distance from top of game boundary
        let healthDict = {}; // dictionary of {player: hp}

        for (var i = 0; i< this.playerUnits.length + this.playerUnitsBench.length; i++){
            // creating icon of the shapes
            this.healthSprite = this.add.sprite(
                startVal - 15,
                spriteY + 10,
                this.totalUnits[i].texture
            ).setOrigin(0, 0);

            // spacing between icon and next health box
            startVal += 10;

            // creating blank health boxes
            this.healthSprite = this.add.sprite(
                startVal,
                spriteY,
                "total speed"
            ).setOrigin(0, 0).setCrop(0,0,150,75);
            this.healthSprite.scaleX *= 1.5;
            this.healthSprite.scaleY *= 0.7;
            startVal += this.healthSprite.width + 50;

            //console.log(this.totalUnits[i].name, this.totalUnits[i].hp);
            healthDict[this.totalUnits[i].name] = this.totalUnits[i].hp;
            //console.log(healthDict); 
            
            let healthConfig = {
                fontFamily: "arial",
                fontSize: "26px",
                color: "#000000",
                padding: 20,
                align: "center",
                lineHeight: "normal"
            };

            // displays health based on value in healthText dictionary
            this.healthScore = this.add.text(
                startVal - 130,
                spriteY - 5,
                healthDict[this.totalUnits[i].name],
                healthConfig
            );
        }
        
        // Create the 3 enemies at fixed positions
        let enemyA = new Enemy(this, 1100, 240, 'circle', 0, "Phobos", "Strung Out", [wince, lash, flurry], 40);
        let enemyB = new Enemy(this, 1100, 480, 'circle', 0, "Mars", "Flinch", [rally, devastation, ruin], 80);
        let enemyC = new Enemy(this, 1100, 360, 'circle', 0, "Deimos", "Distracted", [exhaust, raze, fortify], 40);

        enemyA.hoverText = "this is the first enemy";

        this.addHoverText(enemyA);

        // Give each enemy an onclick behavior that returns them as a target
        j = 0;
        this.enemyUnits = [enemyA, enemyB, enemyC];
        while (j < this.enemyUnits.length){
            let enemy = this.enemyUnits[j];
            enemy.setInteractive();
            enemy.on('pointerup', () => {
                if (this.targeting && !enemy.dead){
                    this.receiveTarget(enemy);
                }
            }, this)
            j++;
        }
        
        
      

        // this is a place holder for a state machine for each part of the game.
        this.uiState = "rotate";

        this.createTextBoxAndSpeedTracker();

        this.createRotateUI();

        // When you press Escape, this prints the state (health) of all active characters
        this.input.keyboard.on("keydown-ESC", () => {
            this.printState();
        }, this);

        this.initializeAudio();
        /* this.input.keyboard.on("keydown-SPACE", () => {
            console.log(this.targeting);
        }, this); */
    }

    update(){

        this.updateHoverText();

        if (this.hoverText == "") {
            this.textBoxText.text = this.defaultText;
        } else {
            this.textBoxText.text = this.hoverText;
        }
        
    }

    // Execute all queued actions, & empty the actionQ
    execute(){
        let i = 0;
        while (i < this.actionQ.length){
            this.actionQ[i].act();
            this.actionQ.shift();
        }
    }

    // Creates the UI that rotates & sets this.RotationPhase = true
    createRotateUI(){
        this.rotationPhase = true;

        if (this.endTurnButton != null){
            this.endTurnButton.destroy();
            this.endTurnText.destroy();
        }

        // this is used in deleteRotateUI(). it contains every sprite created in this function
        this.rotateUIArray = [];

        // instructions displayed in the text box
        this.defaultText = "Rotate your party?";  
        this.defaultText += "\nClick up or down to rotate, check to confirm.";
        this.defaultText += "\nOnly party members in the front three slots are active.";

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

            // doesn't show the grey-over until the pentagon stops spinning
                this.time.addEvent({
                    delay: 550,
                    callback: ()=>{
                        if (!this.currentlyRotating){
                            this.pentagonCover.setAlpha(.8);
                        }
                    },
                    loop: false
                })
            }
        });

        // hides the grey-over for the pentagon immediately
        this.rotateButtonUp.on("pointerdown", () => {
            this.pentagonCover.setAlpha(.0);
        })

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

                // doesn't show the grey-over until the pentagon stops spinning
                this.time.addEvent({
                    delay: 550,
                    callback: ()=>{
                        if (!this.currentlyRotating){
                            this.pentagonCover.setAlpha(.8);
                        }
                    },
                    loop: false
                })
            }
        });

        // hides the grey-over for the pentagon immediately
        this.rotateButtonDown.on("pointerdown", () => {
            this.pentagonCover.setAlpha(.0);
        })

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
        console.log("Finished creating rotate UI")
    }

    // Deletes the rotation UI & sets this.RotationPhase = false
    // this will need to have createUseMoveUI() or w/e added at the end of it
    deleteRotateUI(){
        this.startTurn();
        // destroy all the sprites created by createRotateUI()
        for(let i = 0; i < this.rotateUIArray.length; i++) {
            this.rotateUIArray[i].destroy();
        }
        // clears the text box
        this.defaultText = "Click on your active party members in the pentagon to select moves and targets for them. ";
        this.defaultText += "Click \"DONE\" when you are done selecting moves for each party member.";
        this.rotationPhase = false;

        this.endTurnButton = this.add.rectangle(700 + 75, 375, 74, 30, 0xcd42ed).setOrigin(0,0);
        this.endTurnButton.setInteractive({
            useHandCursor: true     // makes it appear clickable
        });
        this.endTurnButton.on("pointerup", this.endTurn, this);
        textConfig.padding = 0;
        textConfig.fontSize = "24px";
        this.endTurnText = this.add.text(702 + 75, 377, "DONE", textConfig);
        this.selectSound.play();
    }

    endTurn(){
        if (!this.targeting){
            this.execute();
            this.printState();
            this.createRotateUI();
            this.playerUnits.forEach((player) => {
                player.turnEnd();
            });
        }
    }
    
    startTurn(){
        this.queueEnemyActs();
        this.playerUnits.forEach((player) => {
            player.turnStart();
            player.makeActive();
            player.setInteractive();
        });
        this.playerUnitsBench.forEach((player) => {
            player.stopActive();
        }) 
        this.speedBudget = this.speedPerTurn;
        console.log("Finished starting turn");
    }

    queueEnemyActs(){
        let i = 0;
        while (i < this.enemyUnits.length){
            let enemy = this.enemyUnits[i];
            let posAbil = 0;
            for(let k=0;k<3;k++){
                if(enemy.abilities[k].requirement(enemy, this.enemyUnits[1])){posAbil++;}
                console.log(enemy.abilities[k].name+" is "+enemy.abilities[k].requirement(enemy, this.enemyUnits[1]));
            }
            let ability = Math.floor(Math.random() * posAbil);
            let targetNum = Math.floor(Math.random() * 3);
            let target;
            if(!enemy.abilities[ability].allies){
            target = this.playerUnits[targetNum];}
            else{target = this.enemyUnits[targetNum];}
            let speed = Math.floor(Math.random() * 9);
            let action = {target: target, ability: ability, speed: speed};

            let j = 0;
            let correctPos = -1;
    
            while (j < this.actionQ.length){
                let compareTo = this.actionQ[j];
                if (compareTo.queuedAction.speed + compareTo.fatigue < action.speed){
                    correctPos = j;
                    j = this.actionQ.length;
                }
                j++;
            }
            if (correctPos == -1){
                correctPos = this.actionQ.length;
            }
            this.actionQ.splice(correctPos, 0, enemy);
            enemy.queuedAction = action;

            i++;
        }
    }

    createTextBoxAndSpeedTracker() {
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

        this.speedTracker = this.add.sprite(
            this.textBoxSprite.x,
            this.textBoxSprite.y + this.textBoxSprite.height + 20,
            "total speed"
        ).setOrigin(0, 0);

        textConfig.fontSize = "32px";

        this.speedTrackerText = this.add.text(
            this.speedTracker.x + 10,
            this.speedTracker.y,
            this.speedBudget,
            textConfig
        );
    }

    // this rotates all of the pentagram UI counter clockwise
    rotatePentagonUp(){
        // Tell the game we are already spinning, and do not want to do more spins
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
                // Tween is complete, we are free to spin again.
                this.currentlyRotating = false;
                // The Bench/Units arrays are updated to reflect new positions
                let A = this.playerUnits.shift();
                let B = this.playerUnitsBench.shift();
                this.playerUnits.push(B);
                this.playerUnitsBench.push(A);
                // Redraw with new order
                // this.arrangePlayers();
                //console.log("Should be able to rotate again");
            },
            onCompleteScope: this
        });
        this.scrollSound.play();
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
                // Tween is complete, we are free to spin again.
                this.currentlyRotating = false;
                // The Bench/Units arrays are updated to reflect new positions
                let A = this.playerUnits.pop();
                let B = this.playerUnitsBench.pop();
                this.playerUnits.unshift(B);
                this.playerUnitsBench.unshift(A);
                // Redraw with new order
                // this.arrangePlayers();
                //console.log("Should be able to rotate again");
            },
            onCompleteScope: this
        });
        this.scrollSound.play();
    }

    // This goes to the ability select screen. It needs the index of the acting character from PlayerUnits
    pause(num) {
        // get the character
        let char = this.playerUnits[num];

        // Construct the data to form the ability select menu
        let selectData = { 
            srcScene: "playScene",
            pausedScene: this,
            pentagonCenterX: this.pentagonCenterX,
            pentagonCenterY: this.pentagonCenterY,
            currentCharacter: char,
            charNum: num,
            maxSpeed: this.speedBudget,
            currSpeed: 0,
            currSelect: -1,
            currTar: null
        }
        // Modify the data to form the ability select menu if the character already has an ability queued
        if (char.queuedAction.ability != null){
            selectData.currSelect = char.queuedAction.ability;
            selectData.currSpeed = char.queuedAction.speed;
            selectData.maxSpeed = this.speedBudget + char.queuedAction.speed;
            selectData.currTar = char.queuedAction.target;
        }
        // Launch the ability select menu.
        this.scene.launch('pauseScene', selectData);
        this.scene.pause();
    }

    // Sets either all players or all enemies to interactive, & this.targeting to true
    // So that clicking on one will return it as a target to this.receiveTarget
    target(tarEnemy = true) {
        this.targeting = true;
        if (tarEnemy){
            //console.log("Players aren't interactive");
            this.playerUnits.forEach((player) => {
                player.removeInteractive();
            });
        }
        else {
            //console.log("Players are interactive");
            this.playerUnits.forEach((player) => {
                player.setInteractive();
            });
        }
    }

    // Turns targeting back to false, and removes interactive from all characters.
    // Wakes Pause Scene back up, passes pause scene the chosen target
    // Freezes this scene again
    receiveTarget(tar) {
        this.targeting = false;
        //console.log("Players are interactive");
        this.playerUnits.forEach((player) => {
            player.setInteractive();
        });
        //tar.setTint(0x000000);
        //tar.setScale(2);

        this.scene.resume("pauseScene");
        let myScene = this.scene.get("pauseScene")
        myScene.receiveTarget(tar);
        this.scene.pause();
    }

    // Sets all active players positions in a vertical line, top->bottom matching clockwise order on the pentagon.
    // Ideally, this would be changed such that their positions are changed to match their slice of the pentagon.
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

    // This code receives a queued action from the ability select menu.
    // It takes the actual action object, and the index of the relevant character
    receiveAction(action, num){
        //console.log(num);
        // Calculate the change this new action would have on the speed budget
        let budgetChange = action.speed - this.playerUnits[num].queuedAction.speed;
        
        // Get the character
        let char = this.playerUnits[num];

        // Boolean representing if this action is a revision of a previously queued action
        let revisedAct = (char.queuedAction.ability != null);

        // If it is a revision
        if (revisedAct){
            //console.log("Revising an action");
            // Remove the original from the actionQ
            let i = this.actionQ.indexOf(char);
            this.actionQ.splice(i,1);
        }

        // Iterate over all queued actions to find the correct place to put this new action to maintain speed order.
        let i = 0;
        let correctPos = -1;

        while (i < this.actionQ.length){
            let compareTo = this.actionQ[i];
            if (compareTo.queuedAction.speed + compareTo.fatigue < action.speed + char.fatigue){
                correctPos = i;
                i = this.actionQ.length;
            }
            i++;
        }
        if (correctPos == -1){
            correctPos = this.actionQ.length;
        }
        this.actionQ.splice(correctPos, 0, char);

        // Give the character this new action
        char.queuedAction = action;
        // Apply the budget change
        this.speedBudget -= budgetChange;

        //console.log(this.actionQ);
    }

    // Print out the health of all active characters.
    printState(){
        console.log("Player team:");
        let i = 0;
        while (i < this.playerUnits.length){
            console.log(this.playerUnits[i].name + ": " + this.playerUnits[i].hp);
            i++;
        }
        console.log("Enemy team: ");
        i = 0;
        while (i < this.enemyUnits.length){
            console.log(this.enemyUnits[i].name + ": " + this.enemyUnits[i].hp);
            /*if(this.enemyUnits[i].statuses.health.status != "None")
            {console.log(this.enemyUnits[i].name+" is "+this.enemyUnits[i].statuses.health.status);}
            if(this.enemyUnits[i].statuses.buff.status != "None")
            {console.log(this.enemyUnits[i].name+" is "+this.enemyUnits[i].statuses.buff.status);}
            if(this.enemyUnits[i].statuses.debuff.status != "None")
            {console.log(this.enemyUnits[i].name+" is "+this.enemyUnits[i].statuses.debuff.status);}*/
            i++;
        }
    }

    addHoverText(sprite) {
        sprite.setInteractive();
        sprite.on("pointerover", () => {
            this.hoverText = sprite.hoverText;
        });
        sprite.on("pointerout", () => {
            this.hoverText = "";
        });
    }

    updateHoverText() {

        this.speedTrackerText.text = this.speedBudget;
        
        this.circleHoverText = "Medic\nHP:" + this.totalUnits[0].hp + "/" + this.totalUnits[0].maxHP;

        this.circleHoverText += "\nFatigue: " + this.totalUnits[0].fatigue;
        
        this.circleHoverText += "\nStatuses: " + this.generateStatusHoverText(0);

        this.circleSprite.hoverText = this.circleHoverText;


        this.triangleHoverText = "Bounty Hunter\nHP:" + this.totalUnits[3].hp + "/" + this.totalUnits[3].maxHP;

        this.triangleHoverText += "\nFatigue: " + this.totalUnits[3].fatigue;
        
        this.triangleHoverText += "\nStatuses: " + this.generateStatusHoverText(3);

        this.triangleSprite.hoverText = this.triangleHoverText;


        this.squareHoverText = "Juggernaut\nHP:" + this.totalUnits[4].hp + "/" + this.totalUnits[4].maxHP;

        this.squareHoverText += "\nFatigue: " + this.totalUnits[4].fatigue;
        
        this.squareHoverText += "\nStatuses: " + this.generateStatusHoverText(4);

        this.squareSprite.hoverText = this.squareHoverText;


        this.hexagonHoverText = "Telepath\nHP:" + this.totalUnits[2].hp + "/" + this.totalUnits[2].maxHP;

        this.hexagonHoverText += "\nFatigue: " + this.totalUnits[2].fatigue;
        
        this.hexagonHoverText += "\nStatuses: " + this.generateStatusHoverText(2);

        this.hexagonSprite.hoverText = this.hexagonHoverText;


        this.starHoverText = "Sniper\nHP:" + this.totalUnits[1].hp + "/" + this.totalUnits[1].maxHP;

        this.starHoverText += "\nFatigue: " + this.totalUnits[1].fatigue;
        
        this.starHoverText += "\nStatuses: " + this.generateStatusHoverText(1);

        this.starSprite.hoverText = this.starHoverText;
    }

    generateStatusHoverText(n) {
        // this is kind of dense but that is just how strings are honestly
        this.statusLabel = "";
        if (this.totalUnits[n].statuses.health.status != "None") {
            this.statusLabel += this.totalUnits[n].statuses.health.status;
        }
        if (this.totalUnits[n].statuses.buff.status != "None") {
            if (this.statusLabel != "") this.statusLabel += ",";
            this.statusLabel += " " + this.totalUnits[n].statuses.buff.status;
        }
        if (this.totalUnits[n].statuses.debuff.status != "None") {
            if (this.statusLabel != "") this.statusLabel += ",";
            this.statusLabel += " " + this.totalUnits[n].statuses.debuff.status;
        }
        if (this.statusLabel == "") this.statusLabel = "None";

        return this.statusLabel;
    }

    initializeAudio(){
        this.selectSound = this.sound.add("select");
        this.backSound = this.sound.add("back");
        this.forwardSound = this.sound.add("forward");
        this.scrollSound = this.sound.add("scroll");
    }
}