// @ts-check
//
/**
 * @typedef{{
 * name: String,
 * text: String,
 * requirement: Function,
 * Effect: Function,
 * Multitarget: Boolean,
 * Allies: Boolean 
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
    //this really doesn't need to be a function on this level
    //act(target, ability){
    //    ability(target)
    //}
}