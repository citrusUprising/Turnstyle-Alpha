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
        this.currentlyRotating = false;
        //console.log("We did it!")

        this.bgImage = this.add.rectangle(0, 0, game.config.width, game.config.height, 0xaaaaaa, 1).setOrigin(0,0);

        this.pentagonCenterX = game.config.width * .2;
        this.pentagonCenterY = game.config.height * .6;
        this.pentagonRotationState = 1;
        this.pentagonContainer = this.add.container(this.pentagonCenterX, this.pentagonCenterY);
        this.pentagonIsTweening = false;

        this.pentagon = this.add.sprite(
            0,
            0,
            "pentagon",
        );
        this.pentagonContainer.add(this.pentagon);

        this.pentagonCover = this.add.sprite(
            this.pentagonCenterX,
            this.pentagonCenterY,
            "pentagon cover",
        ).setAlpha(.8);
    }

    update(){
        if (!this.currentlyRotating){
            if ( Phaser.Input.Keyboard.JustUp(keyUP) ){
                console.log(this.currentlyRotating);
                this.rotatePentagonUp();
            }
            else if ( Phaser.Input.Keyboard.JustDown(keyDOWN) ){
                console.log(this.currentlyRotating);
                this.rotatePentagonDown();
            }
        }
    }

    rotatePentagonUp(){
        this.currentlyRotating = true;
        //console.log("rotate UP");
        this.pentagonRotationState--;
        if (this.pentagonRotationState == 0) {
            this.pentagonRotationState = 5;
        }
        
        let angleTarget = 72*(this.pentagonRotationState - 1);
        let angle = this.pentagonContainer.angle;
        
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
                console.log("Should be able to rotate again");
            },
            onCompleteScope: this
        });
        //this.pentagonContainer.angle = 72*(this.pentagonRotationState - 1);
     
    }
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
                console.log("Should be able to rotate again");
            },
            onCompleteScope: this
        });
    }
}