class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }
    
    init(data){
        // Process necessary data to render menu
        this.pausedScene = data.srcScene;
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
        this.leftArrowSprite.setInteractive();
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
        this.rightArrowSprite.setInteractive();
        this.rightArrowSprite.on("pointerup", () => {
            if (this.currentSpeed < this.maxSpeed){
                this.currentSpeed += 1;
                this.updateText();
            }
        }, this)

        // Add text that shows the speed value
        this.speedText = this.add.text(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2, 
            this.moveSelectFrameY, 
            this.currentSpeed,
            textConfig
        );
        this.speedText.setOrigin(0,0)

        
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
        this.selectMove(this.originalSelection);
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
    selectMove(i){
        this.moveOneFill.fillColor = 0xFFFFFF;
        this.moveTwoFill.fillColor = 0xFFFFFF;
        this.moveThreeFill.fillColor = 0xFFFFFF;
        if (i == 1){
            this.moveOneFill.fillColor = 0xFF00FF;
        } else if (i == 2){
            this.moveTwoFill.fillColor = 0xFF00FF;
        } else if (i == 3){
            this.moveThreeFill.fillColor = 0xFF00FF;
        }
        this.selection = i - 1;

        // TEMPORARY: for purposes of testing, I only gave characters 2 abilities, and thus even though a 3rd ability can be highlighted, we shouldn't perform logic on it.
        if (this.selection >= 0 && this.selection < 2){
            let multi = this.currentCharacter.abilities[this.selection].multitarget;
            let self = this.currentCharacter.abilities[this.selection].selftarget;
            let ally = this.currentCharacter.abilities[this.selection].allies;
        
            // If a target is necessary
            if (!multi && !self){
                // Put this to sleep
                this.scene.sleep();
                // Resume play
                this.scene.resume(this.pausedScene);
                // Tell play to go to target mode
                let scene = this.scene.get("playScene")
                scene.target(!ally);
            }
        }
        
    }

    // Update the text showing speed value
    updateText(){
        this.speedText.text = this.currentSpeed;
    }

    // Receive targt data from playscene
    receiveTarget(tar){
        this.currentTar = tar;
    }
}