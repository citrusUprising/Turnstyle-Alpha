class Play extends Phaser.Scene {
    constructor(){
        super("playScene")    
    }

    create(){
        console.log("We did it!")

        // Bouncing Head
        this.head = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'Head')
        this.head.setCollideWorldBounds(true)
        this.head.body.onWorldBounds = true
        this.head.setVelocity(Phaser.Math.Between(100, 300), Phaser.Math.Between(100, 300));
        this.head.setBounce(1)

        this.physics.world.on('worldbounds', this.onBounce);

    }

    onBounce(body){
        let color = new Phaser.Display.Color()
        color.random(50)
        body.gameObject.setTint(color.color)
    }

    update(){
        
    }
}