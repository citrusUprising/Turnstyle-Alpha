class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }
    
    init(data){
        this.pausedScene = data.srcScene;
        // Variables: Max Speed, available abilities, current selections
    }

    create(){

        var spacing = 64;
        let graphics = this.add.graphics();
        
        // CENTER WINDOW START //
        // Add Background
        var JMBackgroundWidth = 200, JMBackgroundLength = 275;
        var JMBackground = graphics.fillStyle(0xBFAFA6, 1).fillRoundedRect(game.config.width/2 - JMBackgroundWidth/2, game.config.height/2 - JMBackgroundLength/2 + 25, JMBackgroundWidth, JMBackgroundLength, 8);
        let BGBorder = graphics.lineStyle(6, 0xAA968A, 1).strokeRoundedRect(game.config.width/2 - JMBackgroundWidth/2, game.config.height/2 - JMBackgroundLength/2 + 25, JMBackgroundWidth, JMBackgroundLength, 8).setScrollFactor(0);

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

}