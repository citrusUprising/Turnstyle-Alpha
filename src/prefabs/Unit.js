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
    

    act(target, ability){
        if(ability.multitarget){
            if(ability.allies){
                this.scene.playerUnits.forEach(ability)
            }
            else
                this.scene.enemyUnits.forEach(ability)
        }
        if (ability.selfTarget)
            ability(this)
        ability(target)
    }
}