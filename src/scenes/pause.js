class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }
    
    init(data){
        this.pausedScene = data.srcScene;
        this.pentagonCenterX = data.pentagonCenterX;
        this.pentagonCenterY = data.pentagonCenterY;
        this.currentCharacter = data.currentCharacter;
        this.charNum = data.charNum;
        this.currentSpeed = data.currSpeed;
        this.maxSpeed = data.maxSpeed;
        this.originalSelection = data.currSelect + 1;
        this.selection = data.currSelect;
        // Variables: Max Speed, available abilities, current selections
        
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

        this.moveSelectFrameX = this.pentagonCenterX + 250;
        this.moveSelectFrameY = this.pentagonCenterY - 200;
        this.moveSelectFrameWidth = 250;
        this.moveSelectFrameHeight = 400;
        this.moveWidth = 215;
        this.moveHeight = 70;
        this.spacing = 15;

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

        this.leftArrowSprite = this.add.sprite(
            this.moveSelectFrameX + this.spacing,
            this.moveSelectFrameY + this.spacing,
            "small arrow"
        ).setOrigin(0, 0);
        this.leftArrowSprite.setInteractive();
        this.leftArrowSprite.on("pointerup", () => {
            if (this.currentSpeed > 0){
                this.currentSpeed -= 1;
                this.updateText();
            }
        }, this)

        this.rightArrowSprite = this.add.sprite(
            this.moveSelectFrameX + this.moveSelectFrameWidth - this.spacing,
            this.moveSelectFrameY + this.spacing,
            "small arrow"
        ).setOrigin(1, 0);
        this.rightArrowSprite.flipX = true;
        this.rightArrowSprite.setInteractive();
        this.rightArrowSprite.on("pointerup", () => {
            if (this.currentSpeed < this.maxSpeed){
                this.currentSpeed += 1;
                this.updateText();
            }
        }, this)

        this.speedText = this.add.text(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2, 
            this.moveSelectFrameY, 
            this.currentSpeed,
            textConfig
        );
        this.speedText.setOrigin(0,0)

        

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

        this.add.text(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 - this.moveWidth/2, 
            this.leftArrowSprite.y + this.leftArrowSprite.height + this.spacing, 
            this.currentCharacter.abilities[0].name,
            textConfig
        );

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

        this.add.text(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 - this.moveWidth/2, 
            this.leftArrowSprite.y + this.leftArrowSprite.height + this.spacing*2 + this.moveHeight, 
            this.currentCharacter.abilities[1].name,
            textConfig
        );

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

        this.characterSprite = this.add.sprite(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2,
            this.moveSelectFrameY + this.moveSelectFrameHeight - this.spacing,
            this.currentCharacter.texture.key
        ).setOrigin(.5, 1);

        this.input.keyboard.on("keydown-ESC", () => {
            this.scene.resume(this.pausedScene);
            let scene = this.scene.get("playScene")
            if (this.selection != -1){
                let action = {target: this.currentTar, ability: this.selection, speed: this.currentSpeed}
                scene.receiveAction(action, this.charNum);
            }
            this.scene.stop();
        }, this);

        this.selectMove(this.originalSelection);

        // Add Reset text & button
        /* var resetButton = this.add.bitmapText(game.config.width/2, game.config.height/2 - JMBackgroundLength/4 + spacing, 'gem', 'RESET', 32).setOrigin(0.5);
        resetButton.setInteractive();
        resetButton.on('pointerdown', () => {
            this.sound.play('sfx_select');
            this.scene.stop(this.pausedScene);
            this.scene.start('playTileScene', this.pausedLevel);
        }); */
    }

    update() {
    }

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

        if (this.selection >= 0 && this.selection < 2){
            let multi = this.currentCharacter.abilities[this.selection].multitarget;
            let self = this.currentCharacter.abilities[this.selection].selftarget;
            let ally = this.currentCharacter.abilities[this.selection].allies;
        
            if (!multi && !self){
                this.scene.sleep();
                this.scene.resume(this.pausedScene);
                let scene = this.scene.get("playScene")
                scene.target(!ally);
            }
        }
        
    }

    updateText(){
        this.speedText.text = this.currentSpeed;
    }

    receiveTarget(tar){
        this.currentTar = tar;
    }
}