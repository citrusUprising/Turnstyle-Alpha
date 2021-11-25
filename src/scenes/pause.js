class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }
    
    init(data){
        this.pausedScene = data.srcScene;
        this.pentagonCenterX = data.pentagonCenterX;
        this.pentagonCenterY = data.pentagonCenterY;
        this.currentCharacter = data.currentCharacter;
        // Variables: Max Speed, available abilities, current selections
    }

    create(){

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
        this.selectedMove = 0;

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

        this.rightArrowSprite = this.add.sprite(
            this.moveSelectFrameX + this.moveSelectFrameWidth - this.spacing,
            this.moveSelectFrameY + this.spacing,
            "small arrow"
        ).setOrigin(1, 0);

        this.rightArrowSprite.flipX = true;

        this.moveOneFill = this.add.rectangle(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 - this.moveWidth/2, 
            this.leftArrowSprite.y + this.leftArrowSprite.height + this.spacing, 
            this.moveWidth, 
            this.moveHeight, 
            0xFFFFFF
        ).setInteractive({           
            useHandCursor: true
        }).setOrigin(0, 0).on("pointerup", () => {
            this.selectedMove = 1;
        });

        this.moveOneStroke = graphics.lineStyle(6, 0x000000, 5).strokeRect(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 - this.moveWidth/2, 
            this.leftArrowSprite.y + this.leftArrowSprite.height + this.spacing, 
            this.moveWidth, 
            this.moveHeight, 
            8
        ).setScrollFactor(0);

        this.add.text();
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
            this.selectedMove = 2;
        });
        


        this.moveTwoStroke = graphics.lineStyle(6, 0x000000, 5).strokeRect(
            this.moveSelectFrameX + this.moveSelectFrameWidth/2 - this.moveWidth/2, 
            this.leftArrowSprite.y + this.leftArrowSprite.height + this.spacing*2 + this.moveHeight, 
            this.moveWidth, 
            this.moveHeight
        ).setScrollFactor(0);

        this.add.text();
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
            this.selectedMove = 3;
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
            this.scene.stop();
        });

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
        
        if (this.selectedMove == 1) {
            this.moveOneFill.fillColor = 0xFF00FF;
            this.moveTwoFill.fillColor = 0xFFFFFF;
            this.moveThreeFill.fillColor = 0xFFFFFF;
        } else if (this.selectedMove == 2) {
            this.moveOneFill.fillColor = 0xFFFFFF;
            this.moveTwoFill.fillColor = 0xFF00FF;
            this.moveThreeFill.fillColor = 0xFFFFFF;
        } else if (this.selectedMove == 3) {
            this.moveOneFill.fillColor = 0xFFFFFF;
            this.moveTwoFill.fillColor = 0xFFFFFF;
            this.moveThreeFill.fillColor = 0xFF00FF;
        } else {
            this.moveOneFill.fillColor = 0xFFFFFF;
            this.moveTwoFill.fillColor = 0xFFFFFF;
            this.moveThreeFill.fillColor = 0xFFFFFF;
        }

    }

}