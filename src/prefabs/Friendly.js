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

    turnEnd(){
        // For resolving anything that happens once per turn at turn end
        this.priorTarget = this.queuedAction.target
        this.queuedAction = {target: null, ability: null, speed: 0}
        if(this.statuses.health.status == "Regen")
            this.hp = Math.min(this.hp + 3, this.maxHP)
        if(this.statuses.health.status == "Burn")
            this.hp = Math.max(0, this.hp- 3)
        if(this.isActive)
            this.fatigue += (this.statuses.debuff.status == "Encumbered")? 2: 1
        for(let indvStatus in this.statuses){
            if(this.statuses[indvStatus].duration > 0){
                this.statuses[indvStatus].duration -= 1;
                if(this.statuses[indvStatus].duration == 0)
                    this.statuses[indvStatus].status = "None"
            }
        }
        
    }
}