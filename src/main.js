let config = {
    type: Phaser.WEBGL,
    width: 1280,
    height: 720,
    scene: [Preload, Play, Pause],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        min: {
          width: 300,
          height: 225,
        },
  
        max: {
          width: 1280,
          height: 720
        },
    },
    parent: "game_container",
    debug: true
  }

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyUP, keyDOWN, keyLEFT, keyRIGHT, keySPACE, keyESC;
let key0, key1, key2, key3, key4, key5, key6, key7, key8, key9;
let textConfig;

/*

BELOW HERE, I DEFINE ALL ABILITIES AS GLOBAL VARIABLES.

*/

/**
 * @type {Ability}
 */
 let basicAttack = {};
 basicAttack.name = "BasicAttack";
 basicAttack.text = "Deal 3 damage";
 basicAttack.requirement = function(){return true};
 basicAttack.effect = function(target,self){
   target.takeDamage(self, 3)
  };
 basicAttack.multitarget = false;
 basicAttack.allies = false;
 basicAttack.selftarget = false;

 /**
 * @type {Ability}
 */
  let basicHeal = {};
  basicHeal.name = "BasicHeal";
  basicHeal.text = "Heal 3 damage";
  basicHeal.requirement = function(){return true};
  basicHeal.effect = function(target){
    target.hp = Math.min(target.hp + 3, target.maxHP)
  };
  basicHeal.multitarget = false;
  basicHeal.allies = true;
  basicHeal.selftarget = false;

  /**
 * @type {Ability}
 */
   let groupAttack = {};
   groupAttack.name = "GroupAttack";
   groupAttack.text = "Deal 1 damage to all enemies";
   groupAttack.requirement = function(){return true};
   groupAttack.effect = function(target, self){
     target.takeDamage(self, 1)
    };
   groupAttack.multitarget = true;
   groupAttack.allies = false;
   groupAttack.selftarget = false;

    /**
 * @type {Ability}
 */
  let groupHeal = {};
  groupHeal.name = "Group Heal";
  groupHeal.text = "Heal 1 Damage to all allies";
  groupHeal.requirement = function(){return true};
  groupHeal.effect = function(target){
    target.hp = Math.min(target.hp + 1, target.maxHP)
  };
  groupHeal.multitarget = true;
  groupHeal.allies = true;
  groupHeal.selftarget = false;
 
/**
 * @type {Ability}
 */
 let heavyAttack = {};
 heavyAttack.name = "heavyAttack";
 heavyAttack.text = "Deal 8 damage";
 heavyAttack.requirement = function(){return true};
 heavyAttack.effect = function(target, self){
   target.takeDamage(self, 8)
  };
 heavyAttack.multitarget = false;
 heavyAttack.allies = false;
 heavyAttack.selftarget = false;
 
 /**
 * @type {Ability}
 */
  let selfHeal = {};
  selfHeal.name = "selfHeal";
  selfHeal.text = "Heal 5 damage";
  selfHeal.requirement = function(){return true};
  selfHeal.effect = function(target){
    target.hp = Math.min(target.hp + 5, target.maxHP)
  };
  selfHeal.multitarget = false;
  selfHeal.allies = false;
  selfHeal.selftarget = true;

  //Actual attacks
  
/**
 * @type {Ability}
 */
let drone = {};
drone.name = "Drone";
drone.text = "Give ally Regeneration 3";
drone.requiremnet = function(){return true};
drone.effect = function(target){
  target.applyStatus("Regen", 3)
};
drone.multitarget = false;
drone.allies = true;
drone.selftarget = false;

/**
 * @type {Ability}
 */
 let flareGun = {};
 flareGun.name = "Flare Gun";
 flareGun.text = "Hit enemy for 1 damage and 50% chance to inflict Burn";
 flareGun.requiremnet = function(){return true};
 flareGun.effect = function(target, self){
   target.takeDamage(self, 1);
   if(Math.random() >= 0.5) target.applyStatus("Burn", 3)
 };
 flareGun.multitarget = false;
 flareGun.allies = false;
 flareGun.selftarget = false;

 /**
 * @type {Ability}
 */
let cure = {};
cure.name = "Cure (BROKEN)";
cure.text = "Remove Ally Debuffs";
cure.requiremnet = function(){return true};
cure.effect = function(target){
  if(target.statuses.debuff.status != "None")
    target.statuses.debuff.status = "None"
};
cure.multitarget = false;
cure.allies = true;
cure.selftarget = false;

/**
 * @type {Ability}
 */
 let assault = {};
 assault.name = "Assault";
 assault.text = "Hit enemy for damage based off your speed";
 assault.requiremnet = function(){return true};
 assault.effect = function(target, self){
   target.takeDamage(self, 3 + Math.ceil(self.queuedAction.speed/2))
 };
 assault.multitarget = false;
 assault.allies = false;
 assault.selftarget = false;

 /**
 * @type {Ability}
 */
let feint = {};
feint.name = "Feint";
feint.text = "Flinch an enemy";
feint.requiremnet = function(){return true};
feint.effect = function(target){
  target.applyStatus("Flinch", 1)
};
feint.multitarget = false;
feint.allies = false;
feint.selftarget = false;

/**
 * @type {Ability}
 */
 let enhance = {};
 enhance.name = "Enhance";
 enhance.text = "Give self Haste 3 for 3 turns";
 enhance.requiremnet = function(){return true};
 enhance.effect = function(target){
   target.applyStatus("Haste", 3, 3)
 };
 enhance.multitarget = false;
 enhance.allies = false;
 enhance.selftarget = true;

 /**
 * @type {Ability}
 */
let swipe = {};
swipe.name = "Swipe ";
swipe.text = "Hit all enemies for 2 damage";
swipe.requiremnet = function(){return true};
swipe.effect = function(target, self){
  target.takeDamage(self, 2);
};
swipe.multitarget = true;
swipe.allies = false;
swipe.selftarget = false;

/**
 * @type {Ability}
 */
 let bulwark = {};
 bulwark.name = "Bulwark";
 bulwark.text = "Give all allies Aegis 1";
 bulwark.requiremnet = function(){return true};
 bulwark.effect = function(target){
   target.applyStatus("Aegis", 1)
 };
 bulwark.multitarget = true;
 bulwark.allies = true;
 bulwark.selftarget = true;

 /**
 * @type {Ability}
 */
let bullrush = {};
bullrush.name = "Bullrush";
bullrush.text = "Deal 8 damage to a target and 4 damage to self";
bullrush.requiremnet = function(){return true};
bullrush.effect = function(target, self){
  target.takeDamage(self, 8)
  self.hp = Math.min(self.hp-4., self.maxHP)
};
bullrush.multitarget = false;
bullrush.allies = false;
bullrush.selftarget = false;

/**
 * @type {Ability}
 */
 let soothe = {};
 soothe.name = "Soothe";
 soothe.text = "Heal ally for 6 damage";
 soothe.requiremnet = function(){return true};
 soothe.effect = function(target){
   target.hp = Math.min(target.hp + 6, target.maxHP);
 };
 soothe.multitarget = false;
 soothe.allies = true;
 soothe.selftarget = false;

 /**
 * @type {Ability}
 */
let invigorate = {};
invigorate.name = "Invigorate";
invigorate.text = "Give ally Enrage 1";
invigorate.requiremnet = function(){return true};
invigorate.effect = function(target){
  target.applyStatus("Enrage", 1)
};
invigorate.multitarget = false;
invigorate.allies = true;
invigorate.selftarget = false;

/**
 * @type {Ability}
 */
 let panicAttack = {};
 panicAttack.name = "Panic Attack";
 panicAttack.text = "Deal 2 damage to targeted enemy and inflict Strung Out 1";
 panicAttack.requiremnet = function(){return true};
 panicAttack.effect = function(target, self){
   target.takeDamage(self, 2)
   target.applyStatus("StrungOut", 1)
 };
 panicAttack.multitarget = false;
 panicAttack.allies = false;
 panicAttack.selftarget = false;

 /**
 * @type {Ability}
 */
  let shoot = {};
  shoot.name = "Shoot";
  shoot.text = "Deal 10 damage. If you have more than 1 fatigue, 30% accuracy";
  shoot.requiremnet = function(){return true};
  shoot.effect = function(target, self){
    if(self.fatigue <= 1 || Math.random() <= 0.3){
      target.takeDamage(self, 10)
    //else{Print "Missed"}  
    }
  };
  shoot.multitarget = false;
  shoot.allies = false;
  shoot.selftarget = false;

   /**
 * @type {Ability}
 */
    let flashBang = {};
    flashBang.name = "Flash Bang";
    flashBang.text = "Targets all enemies, 50% chance to Flinch";
    flashBang.requiremnet = function(){return true};
    flashBang.effect = function(target){
      if(Math.random() <= 0.5)
        target.applyStatus("Flinch", 1)
    };
    flashBang.multitarget = true;
    flashBang.allies = false;
    flashBang.selftarget = false;

     /**
 * @type {Ability}
 */
      let target = {};
      target.name = "Target";
      target.text = "Afflicts one targeted enemy with Distracted 2";
      target.requiremnet = function(){return true};
      target.effect = function(target){
        target.applyStatus("Distracted", 2)
      };
      target.multitarget = false;
      target.allies = false;
      target.selftarget = false;

  