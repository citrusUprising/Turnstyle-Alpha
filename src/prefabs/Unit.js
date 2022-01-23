// @ts-check
//
/**
 * @typedef{{
 * name: String,
 * text: String,
 * requirement: Function,
 * effect: Function,
 * multitarget: Boolean,
 * allies: Boolean,
 * selftarget: Boolean
 * }} Ability
 */
/**
 * @type {Ability[]}
 */
this.abilities = [];
class Unit extends Phaser.GameObjects.Sprite{
    //Ability should be struct or class? hm
    constructor(scene, x, y, texture, frame, name, immunity, abilities, hp){
        super(scene, x, y, texture, frame);
        this.name = name;
        this.immunity = immunity;
        this.abilities = abilities;
        // Target is the character object, ability is the index of this characters ability, speed is a number
        this.queuedAction = {target: null, ability: null, speed: 0};
        this.hp = hp;
        this.alliedArray = null;
        this.enemyArray = null;
        this.maxHP = hp;
        this.statuses = {health : {status: "None", duration : 0, magnitude: 0},
             buff : {status: "None", duration : 0, magnitude: 0}, debuff : {status: "None", duration : 0, magnitude: 0}}
        scene.add.existing(this);
        this.fatigue = 0
        this.isActive = true;
        this.priorTarget = null;
        this.dead = false;
    }


    // Perform the players queued action
    act(){
        //No action if flinched
        if(this.statuses.debuff.status == "Flinch"){
            console.log(this.name+" flinched");
            this.statuses.debuff.status = "None"
            this.statuses.debuff.duration = 0
            return
        }
        this.getTeams();
        if(this.abilities[this.queuedAction.ability].multitarget){
            if(this.abilities[this.queuedAction.ability].allies){
                //console.log(this.alliedArray);
                this.alliedArray.forEach((ally) => {
                    //console.log(ally);
                    this.abilities[this.queuedAction.ability].effect(ally, this);
                });
            }
            else {
                this.enemyArray.forEach((enemy) => {
                    this.abilities[this.queuedAction.ability].effect(enemy, this);
                });
            }
                
        }
        else if (this.abilities[this.queuedAction.ability].selfTarget){
            this.abilities[this.queuedAction.ability].effect(this, this)
        }
        else {
            this.abilities[this.queuedAction.ability].effect(this.queuedAction.target, this);
        }
        this.queuedAction = {target: null, ability: null, speed: 0};
    }

    // Get the up to date lists of active characters.
    // This is overwritten by the children classes, enemy & friendly
    getTeams(){
        this.alliedArray = this.scene.playerUnits;
        this.enemyArray = this.scene.enemyUnits;
    }

    turnEnd(){
        // For resolving anything that happens once per turn at turn end
        console.log(this.name+" has ended their turn");
        this.priorTarget = this.queuedAction.target
        this.queuedAction = {target: null, ability: null, speed: 0}
        if(this.statuses.health.status == "Regen")
            this.hp = Math.min(this.hp + this.statuses.health.magnitude, this.maxHP)
        if(this.statuses.health.status == "Burn")
            this.hp = Math.max(0, this.hp - this.statuses.health.magnitude)
        if (this.hp == 0 && !this.dead){
            this.dead = true;
            this.setTint(0x000000);
            outputQueue.push(this.name + " died!")
        }
        if(this.name == "Yellow"){
            let fullHealth = true;
            let highest;
            let highestHP;
            let lowest;
            let lowestHP;

            for(let allies in this.alliedArray){
                if (this.alliedArray[allies].hp < this.alliedArray[allies].maxHP){
                    fullHealth = false;
                    break
                    }
                }
            if (!fullHealth){
                for(let allies in this.alliedArray){
                    if(highest == undefined || this.alliedArray[allies].hp > highestHP){
                        highest = allies;
                        highestHP = this.alliedArray[allies].hp;
                        }
                    if(lowest == undefined || this.alliedArray[allies].hp < lowestHP){
                        lowest = allies;
                        lowestHP = this.alliedArray[allies].hp;
                        }
                    }
                this.alliedArray[lowest].healSelf(4);
                this.alliedArray[highest].hp = Math.min(this.alliedArray[highest].hp-4., this.alliedArray[highest].maxHP);
                }
            }
        if(this.name == "Green"&&this.fatigue < 2){
            for(let allies in this.alliedArray){
                this.alliedArray[allies].statuses.debuff.status = "None"
            }
        }
        for(let indvStatus in this.statuses){
            if(this.statuses[indvStatus].duration > 0){
                this.statuses[indvStatus].duration -= 1;
                if(this.statuses[indvStatus].duration == 0){
                    outputQueue.push(this.name+"'s "+this.statuses[indvStatus].status+" wore off");
                    console.log(this.name+"'s "+this.statuses[indvStatus].status+" wore off");
                    this.statuses[indvStatus].status = "None"
                }
            }
        }
    }
    
    makeActive(){
        if(!this.isActive){
            if(this.name == "Pink")
                this.statuses.health.status = "None"
            this.isActive = true
        }
    }

    stopActive(){
        if(this.isActive){
            for(let indvStatus in this.statuses){
                this.statuses[indvStatus].duration = 0;
                this.statuses[indvStatus].status = "None"
            }
            if(this.name == "Pink")
                this.statuses.health.status = "Regen"
            this.isActive = false
        }
        this.fatigue = 0;
    }

    healSelf(amount){
        this.hp = Math.min(this.hp + amount, this.maxHP)
    }

    //To handle taking of damage in order to take into account statuses
    takeDamage(source, amount){
        if(this.statuses.buff.status == "Aegis")
            amount = Math.ceil(amount/2)
        if(source.statuses.buff.status == "Enrage")
            amount = amount * 2
            if(this.statuses.debuff.status == "Distracted")
            amount = amount * 2
        if(source.statuses.debuff.status == "StrungOut")
            amount = Math.ceil(amount/2)
        if(this.name == "Red" && this.queuedAction.speed >= 5 && Math.random() > 0.5){
            console.log(this.name+" dodged the attack")
            outputQueue.push(this.name+" dodged the attack")
            return}
        this.hp = Math.max(this.hp - amount, 0)
        outputQueue.push(this.name + " took " + amount + " damage.")
        if (this.hp == 0 && !this.dead){
            this.dead = true;
            this.setTint(0x000000);
            outputQueue.push(this.name + " died!")
            if(source.name == "Blue"){
                source.fatigue = 0;
                outputQueue.push(source.name + " got a second wind")
            }
        }
    }

    //Function to be called by any ability that inflicts a status
    applyStatus(newStatus, duration, magnitude = 0){
        //Check for boss immunities
        if(newStatus == this.immunity)
            return
        //This dictionariy ensures that you don't have to know the category of a status to call this function
        let statusCategoriser = {Regen : "health", Burn: "health", Flinch: "debuff", Haste: "buff", Aegis: "buff",
            Enrage: "buff", Distracted: "debuff", StrungOut : "debuff", Encumbered: "debuff", Null: "debuff"}
        let statusCategory = statusCategoriser[newStatus]
        //If we already have a status of that kind, we don't care
        if(this.statuses[statusCategory].status != "None")
            return
        //otherwise add it
        else{
            this.statuses[statusCategory].status = newStatus
            this.statuses[statusCategory].duration = duration
            this.statuses[statusCategory].magnitude = magnitude
            console.log (this.name+" has "+newStatus)
            outputQueue.push(this.name+" has "+newStatus)
        }
    }

    turnStart(){
        // For resolving anything that happens once per turn at turn start
    }
}