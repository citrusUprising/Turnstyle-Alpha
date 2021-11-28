class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }
    
    init(data){
        // Process necessary data to render menu
        this.pausedScene = data.srcScene;
        this.pausedSceneObject = data.pausedScene;
        this.pentagonCenterX = data.pentagonCenterX;
        this.pentagonCenterY = data.pentagonCenterY;
        this.currentCharacter = data.currentCharacter;
        this.charNum = data.charNum;
        this.currentSpeed = data.currSpeed;
        this.maxSpeed = data.maxSpeed;
        this.originalSelection = data.currSelect + 1;
        this.selection = data.currSelect;
    }

    create(){
        this.currentTar = null;
        let graphics = this.add.graphics();
        
        // CENTER WINDOW START //
        // Add Background
        // this.moveSelectFrame = this.add.rectangle(
        //     this.pentagonCenterX + 250, 
        //     this.pentagonCenterY - 200,
        //     frameWidth, 
        //     frameHeight, 
        //     0xFFFFFF
        // ).setOrigin(0,0);

        // Get some position numbers
        this.moveSelectFrameX = this.pentagonCenterX + 250;
        this.moveSelectFrameY = this.pentagonCenterY - 200;
        this.moveSelectFrameWidth = 250;
        this.moveSelectFrameHeight = 400;
        this.moveWidth = 215;
        this.moveHeight = 70;
        this.spacing = 15;

        // Draw background box
        this.moveSelectFill = graphics.fillStyle(0xFFFFFF, 1).fillRect(
            this.moveSelectFrameX,
            this.moveSelectFrameY,
            this.moveSelectFrameWidth,
            this.moveSelectFrameHeight
        );

        this.moveSelectBorder = graphics.lineStyle(6, 0x000000, 5).strokeRect(
            this.pentagonCenterX + 250, 
            this.pentagonCenterY - 200, 
            this.moveSelectFrameWidth, 
            this.moveSelectFrameHeight, 
            8
        ).setScrollFactor(0);

        // Draw Left Arrow
        this.leftArrowSprite = this.add.sprite(
            this.moveSelectFrameX + this.spacing,
            this.moveSelectFrameY + this.spacing,
            "small arrow"
        ).setOrigin(0, 0);
        // Make left arrow modify a speed value
        this.leftArrowSprite.setInteractive({           
            useHandCursor: true
        });
        this.leftArrowSprite.on("pointerup", () => {
            if (this.currentSpeed > 0){
                this.currentSpeed -= 1;
                this.updateText();
            }
        }, this)

        // Draw right arrow
        this.rightArrowSprite = this.add.sprite(
            this.moveSelectFrameX + this.moveSelectFrameWidth - this.spacing,
            this.moveSelectFrameY + this.spacing,
            "small arrow"
        ).setOrigin(1, 0);
        this.rightArrowSprite.flipX = true;
        // Make right arrow modify a speed value
        this.rightArrowSprite.setInteractive({           
            useHandCursor: true
        });
        this.rightArrowSprite.on("pointerup", () => {
            if (this.currentSpeed < this.maxSpeed){
                this.currentSpeed += 1;
                this.updateText();
            }
        }, this)

        // Add text that shows the speed value
        this.speedText = this.add.text(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 -30, 
            this.moveSelectFrameY, 
            this.currentSpeed,
            textConfig
        );
        this.speedText.setOrigin(0,0)

        textConfig.fontSize = "16px";
        this.speedLabelText = this.add.text(
            this.speedText.x - 20,
            this.speedText.y + 30,
            "Speed",
            textConfig
        ).setOrigin(0, 0);
        
        // Draw ability 1's box
        this.moveOneFill = this.add.rectangle(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 - this.moveWidth/2, 
            this.leftArrowSprite.y + this.leftArrowSprite.height + this.spacing, 
            this.moveWidth, 
            this.moveHeight, 
            0xFFFFFF
        ).setInteractive({           
            useHandCursor: true
        }).setOrigin(0, 0).on("pointerup", () => {
            this.selectMove(1);
        });

        this.moveOneStroke = graphics.lineStyle(6, 0x000000, 5).strokeRect(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 - this.moveWidth/2, 
            this.leftArrowSprite.y + this.leftArrowSprite.height + this.spacing, 
            this.moveWidth, 
            this.moveHeight, 
            8
        ).setScrollFactor(0);

        // Add the name of ability 1
        this.add.text(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 - this.moveWidth/2, 
            this.leftArrowSprite.y + this.leftArrowSprite.height + this.spacing, 
            this.currentCharacter.abilities[0].name,
            textConfig
        );

        // Draw ability 2s box
        this.moveTwoFill = this.add.rectangle(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 - this.moveWidth/2, 
            this.leftArrowSprite.y + this.leftArrowSprite.height + this.spacing*2 + this.moveHeight, 
            this.moveWidth, 
            this.moveHeight,
            0xFFFFFF
        ).setInteractive({           
            useHandCursor: true
        }).setOrigin(0, 0).on("pointerup", () => {
            this.selectMove(2);
        });
        this.moveTwoStroke = graphics.lineStyle(6, 0x000000, 5).strokeRect(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 - this.moveWidth/2, 
            this.leftArrowSprite.y + this.leftArrowSprite.height + this.spacing*2 + this.moveHeight, 
            this.moveWidth, 
            this.moveHeight
        ).setScrollFactor(0);

        // add the name of ability 2
        this.add.text(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 - this.moveWidth/2, 
            this.leftArrowSprite.y + this.leftArrowSprite.height + this.spacing*2 + this.moveHeight, 
            this.currentCharacter.abilities[1].name,
            textConfig
        );

        // Draw ability 3s box
        this.moveThreeFill = this.add.rectangle(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 - this.moveWidth/2, 
            this.leftArrowSprite.y + this.leftArrowSprite.height + this.spacing*3 + this.moveHeight*2, 
            this.moveWidth, 
            this.moveHeight,
            0xFFFFFF
        ).setInteractive({           
            useHandCursor: true
        }).setOrigin(0, 0).on("pointerup", () => {
            this.selectMove(3);
        });

        this.moveThreeStroke = graphics.lineStyle(6, 0x000000, 5).strokeRect(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 - this.moveWidth/2, 
            this.leftArrowSprite.y + this.leftArrowSprite.height + this.spacing*3 + this.moveHeight*2, 
            this.moveWidth, 
            this.moveHeight
        ).setScrollFactor(0);

        // TODO: We would add the name of ability 3 here (but for purposes of testing, I only gave characters 2 abilities)
        // add the name of ability 33
        this.add.text(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 - this.moveWidth/2, 
            this.leftArrowSprite.y + this.leftArrowSprite.height + this.spacing*2 + this.moveHeight, 
            this.currentCharacter.abilities[2].name,
            textConfig
        );

        // Add a sprite at the bottom of menu showing the character we are selecting action for
        this.characterSprite = this.add.sprite(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2,
            this.moveSelectFrameY + this.moveSelectFrameHeight - this.spacing,
            this.currentCharacter.texture.key
        ).setOrigin(.5, 1);

        // On pressing escape, submit the queued action back to playScene
        this.input.keyboard.on("keydown-ESC", function() {
            this.submitAction()}, this);

        // Highlight a selected move if there already was one
        this.selectMove(this.originalSelection, true);

        // create the text box and the speed tracker
        // this is nessicary because they need to exist in this scene so that we can edit them here
        this.createTextBoxAndSpeedTracker();
    }

    update() {
    }

    // Submits a queued action back to playScene, shutting this down
    submitAction(){
        this.scene.resume(this.pausedScene);
        let scene = this.scene.get("playScene")
        if (this.selection != -1){
            let action = {target: this.currentTar, ability: this.selection, speed: this.currentSpeed}
            scene.receiveAction(action, this.charNum);
        }
        this.scene.stop();
    }

    // Visually highlights a selected move, and swaps into tareting mode if a target is needed
    selectMove(i, ignoreTar = false){
        this.moveOneFill.fillColor = 0xFFFFFF;
        this.moveTwoFill.fillColor = 0xFFFFFF;
        this.moveThreeFill.fillColor = 0xFFFFFF;
        
        // TEMPORARY: for purposes of testing, I only gave characters 2 abilities, and thus even though a 3rd ability can be highlighted, we shouldn't perform logic on it.
        if (this.selection >= 0 && this.selection < 3 && !ignoreTar){
            let multi = this.currentCharacter.abilities[this.selection].multitarget;
            let self = this.currentCharacter.abilities[this.selection].selftarget;
            let ally = this.currentCharacter.abilities[this.selection].allies;
        
            // If a target is necessary
            if (!multi && !self){
                // Put this to sleep
                this.scene.pause();
                // Resume play
                this.scene.resume(this.pausedScene);
                // Tell play to go to target mode
                let scene = this.scene.get("playScene")
                scene.target(!ally);
            }
        }

        if (i == 1){
            this.moveOneFill.fillColor = 0xFF00FF;
        } else if (i == 2){
            this.moveTwoFill.fillColor = 0xFF00FF;
        } else if (i == 3){
            this.moveThreeFill.fillColor = 0xFF00FF;
        }
        this.selection = i - 1;
    }

    // Update the text showing speed value
    updateText(){
        this.speedText.text = this.currentSpeed;

        this.speedTrackerText.text = this.maxSpeed - this.currentSpeed;
        this.pausedSceneObject.speedTrackerText.text = this.maxSpeed - this.currentSpeed;
    }

    // Receive targt data from playscene
    receiveTarget(tar){
        this.currentTar = tar;
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
            this.maxSpeed - this.currentSpeed,
            textConfig
        );
    }
}