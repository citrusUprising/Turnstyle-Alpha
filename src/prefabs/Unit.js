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
 * selfTarget: Boolean
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
        this.queuedAction = {target: null, ability: null, speed: 0}
        this.hp = hp
    }


    act(){
        if(this.queuedAction.ability.multitarget){
            if(this.queuedAction.ability.allies){
                this.scene.playerUnits.forEach(this.queuedAction.ability)
            }
            else
                this.scene.enemyUnits.forEach(this.queuedAction.ability)
        }
        if (this.queuedAction.ability.selfTarget)
            this.queuedAction.ability(this)
        this.queuedAction.ability(this.queuedAction.target)
    }

    turnEnd(){
        // For resolving anything that happens once per turn at turn end
        this.queuedAction = {target: null, ability: null, speed: 0}
    }

    turnStart(){
        // For resolving anything that happens once per turn at turn start
    }
}