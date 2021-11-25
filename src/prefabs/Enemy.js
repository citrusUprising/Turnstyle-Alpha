class Enemy extends Unit{
    constructor(scene, x, y, texture, frame, name, passive, abilities, hp){
        super(scene, x, y, texture, frame, name, passive, abilities, hp)
        this.enemyArray = scene.playerUnits;
        this.alliedArray = scene.enemyUnits;
    }

    getTeams(){
        this.enemyArray = this.scene.playerUnits;
        this.alliedArray = this.scene.enemyUnits;
    }
}