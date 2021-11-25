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
        this.targeting = false;
        //console.log("We did it!")

        this.playerUnits = [];
        this.playerUnits.forEach((player) => {
            player.on('pointerdown', () => {
                if (this.targeting){
                    this.receiveTarget(player);
                } else {
                    console.log("Go to ability select screen");
                }
            }, this);
        });

        

        this.bgImage = this.add.rectangle(0, 0, game.config.width, game.config.height, 0xaaaaaa, 1).setOrigin(0,0);

        let enemyA = this.add.rectangle(1100, 360, 64, 64, 0x654597, 1);
        let enemyB = this.add.rectangle(1100, 480, 64, 64, 0x654597, 1);
        let enemyC = this.add.rectangle(1100, 240, 64, 64, 0x654597, 1);

        this.enemyUnits = [enemyA, enemyB, enemyC];
        this.enemyUnits.forEach((enemy) => {
            enemy.on('pointerdown', () => {
                this.receiveTarget(enemy);
            }, this);
        });

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

        this.input.keyboard.on("keydown-ESC", () => {
            this.pause();
        });
        this.input.keyboard.on("keydown-SPACE", () => {
            this.target();
        });
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

    pause() {
        this.scene.launch('pauseScene', { srcScene: "playScene" });
        this.scene.pause();
    }

    target(tarEnemy = true) {
        this.targeting = true;
        if (tarEnemy){
            this.enemyUnits.forEach((enemy) => {
                enemy.setInteractive();
            })
        }
        else {
            this.playerUnits.forEach((player) => {
                player.setInteractive();
            })
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
        tar.setScale(2);
    }
}