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
    constructor(scene, x, y, texture, frame, name, passive, abilities, hp){
        super(scene, x, y, texture, frame);
        this.name = name;
        this.passive = passive;
        this.abilities = abilities;
        this.queuedAction = {target: null, ability: null, speed: 0};
        this.hp = hp;
        this.alliedArray = null;
        this.enemyArray = null;
        this.maxHP = hp;

        scene.add.existing(this);
    }


    act(){
        this.getTeams();
        if(this.abilities[this.queuedAction.ability].multitarget){
            if(this.abilities[this.queuedAction.ability].allies){
                console.log(this.alliedArray);
                this.alliedArray.forEach((ally) => {
                    console.log(ally);
                    this.abilities[this.queuedAction.ability].effect(ally);
                });
            }
            else {
                this.enemyArray.forEach((enemy) => {
                    this.abilities[this.queuedAction.ability].effect(enemy);
                });
            }
                
        }
        else if (this.abilities[this.queuedAction.ability].selfTarget){
            this.abilities[this.queuedAction.ability].effect(this)
        }
        else {
            this.abilities[this.queuedAction.ability].effect(this.queuedAction.target);
        }
    }

    getTeams(){
        this.alliedArray = this.scene.playerUnits;
        this.enemyArray = this.scene.enemyUnits;
    }

    turnEnd(){
        // For resolving anything that happens once per turn at turn end
        this.queuedAction = {target: null, ability: null, speed: 0}
    }

    turnStart(){
        // For resolving anything that happens once per turn at turn start
    }
}