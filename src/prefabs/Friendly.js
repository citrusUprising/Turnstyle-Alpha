class Friendly extends Unit{
    constructor(scene, x, y, texture, frame, name, passive, abilities, hp){
        super(scene, x, y, texture, frame, name, passive, abilities, hp)
        this.alliedArray = scene.playerUnits;
        this.enemyArray = scene.enemyUnits
    }

    getTeams(){
        this.alliedArray = this.scene.playerUnits;
        this.enemyArray = this.scene.enemyUnits;
    }
}