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
 basicAttack.effect = function(target){
   target.hp -= 3
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
    target.hp += 3
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
   groupAttack.effect = function(target){
     target.hp -= 1
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
    target.hp += 1;
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
 heavyAttack.effect = function(target){
   target.hp -= 8
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
    target.hp += 5
  };
  selfHeal.multitarget = false;
  selfHeal.allies = false;
  selfHeal.selftarget = true;

  //Actual attacks
  
/**
 * @type {Ability}
 */
let drone = {};
drone.name = "Drone (BROKEN)";
drone.text = "Give ally Regeneration 3";
drone.requiremnet = function(){return true};
drone.effect = function(target){
  //target.hStatus = 1; temporary variables, hStatus = Health Status Effect, hsTimer = duration of health status effect
  //target.hsTimer = 3;
};
drone.multitarget = false;
drone.allies = true;
drone.selftarget = false;

/**
 * @type {Ability}
 */
 let flareGun = {};
 flareGun.name = "Flare Gun (BROKEN)";
 flareGun.text = "Hit enemy for 1 damage and 50% chance to inflict Burn";
 flareGun.requiremnet = function(){return true};
 flareGun.effect = function(target){
   target.hp -= 1;
  //target.hStatus = 2; temporary variables, hStatus = Health Status Effect, hsTimer = duration of health status effect
   //target.hsTimer = 3;
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
  //target.dStatus = 0; temporary variable, dStatus = Debuff Status Effect, dsTimer = duration of debuff status effect
  //targer.dsTimer = 0;
  //if(target.hStatus == 2){
  //target.hStatus = 0;
  //target.hsTimer = 0;
  //}
};
cure.multitarget = false;
cure.allies = true;
cure.selftarget = false;

/**
 * @type {Ability}
 */
 let assault = {};
 assault.name = "Assault (BROKEN)";
 assault.text = "Hit enemy for damage based off your speed";
 assault.requiremnet = function(){return true};
 assault.effect = function(target){
   //target.hp -= 3+int(this.speed/2)
 };
 assault.multitarget = false;
 assault.allies = false;
 assault.selftarget = false;

 /**
 * @type {Ability}
 */
let feint = {};
feint.name = "Feint (BROKEN)";
feint.text = "Flinch an enemy";
feint.requiremnet = function(){return true};
feint.effect = function(target){
  //target.dStatus = (Flinch#);
  //target.dsTimer = 1;
};
feint.multitarget = false;
feint.allies = false;
feint.selftarget = false;

/**
 * @type {Ability}
 */
 let enhance = {};
 enhance.name = "Enhance (BROKEN)";
 enhance.text = "Give self Haste 3 for 3 turns";
 enhance.requiremnet = function(){return true};
 enhance.effect = function(target){
   //target.bStatus = (Haste#); bStatus = Buff Status Effect
   //target.bsScale = 3; bsScale = Strnegth of Buff Status Effect
   //target.bsTimer = 3; bsTimer = Duration of Buff Status Effect
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
swipe.effect = function(target){
  target.hp -= 2;
};
swipe.multitarget = true;
swipe.allies = false;
swipe.selftarget = false;

/**
 * @type {Ability}
 */
 let bulwark = {};
 bulwark.name = "Bulwark (BROKEN)";
 bulwark.text = "Give all allies Aegis 1";
 bulwark.requiremnet = function(){return true};
 bulwark.effect = function(target){
   //target.bStatus = (Aegis#)
   //target.bsTimer = 1;
 };
 bulwark.multitarget = true;
 bulwark.allies = true;
 bulwark.selftarget = true;

 /**
 * @type {Ability}
 */
let bullrush = {};
bullrush.name = "Bullrush (BROKEN)";
bullrush.text = "Deal 8 damage to a target and 4 damage to self";
bullrush.requiremnet = function(){return true};
bullrush.effect = function(target){
  target.hp -= 8;
  //this.hp -= 4; 
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
   target.hp += 6;
 };
 soothe.multitarget = false;
 soothe.allies = true;
 soothe.selftarget = false;

 /**
 * @type {Ability}
 */
let invigorate = {};
invigorate.name = "Invigorate (BROKEN)";
invigorate.text = "Give ally Enrage 1";
invigorate.requiremnet = function(){return true};
invigorate.effect = function(target){
  //target.bStatus = (Enrage#);
  //target.hsTimer = 1;
};
invigorate.multitarget = false;
invigorate.allies = true;
invigorate.selftarget = false;

/**
 * @type {Ability}
 */
 let panicAttack = {};
 panicAttack.name = "Panic Attack (BROKEN)";
 panicAttack.text = "Deal 2 damage to targeted enemy and inflict Strung Out 1";
 panicAttack.requiremnet = function(){return true};
 panicAttack.effect = function(target){
   target.hp -= 2;
   //target.dStatus = (StrungOut#);
   //target.dsTimer = 1;
 };
 panicAttack.multitarget = false;
 panicAttack.allies = false;
 panicAttack.selftarget = false;

 /**
 * @type {Ability}
 */
  let shoot = {};
  shoot.name = "Shoot (BROKEN)";
  shoot.text = "Deal 10 damage. If you have more than 1 fatigue, 30% accuracy";
  shoot.requiremnet = function(){return true};
  shoot.effect = function(target){
    //if(this.fatigue <= 1){
      target.hp -= 10;
    //}else{
    //let rng = rndi(0,10);
    //if(rng<=3){target.hp-=10;}
    //else{Print "Missed"}  
    //}
  };
  shoot.multitarget = false;
  shoot.allies = false;
  shoot.selftarget = false;

   /**
 * @type {Ability}
 */
    let flashBang = {};
    flashBang.name = "Flash Bang (BROKEN)";
    flashBang.text = "Targets all enemies, 50% chance to Flinch";
    flashBang.requiremnet = function(){return true};
    flashBang.effect = function(target){
      //let rng = rndi(0,2);
      //if(rng < 2){
      //  target.dStatus = (Flinch#);
      //  target.dTimer = 1;
      //}
    };
    flashBang.multitarget = true;
    flashBang.allies = false;
    flashBang.selftarget = false;

     /**
 * @type {Ability}
 */
      let target = {};
      target.name = "Target (BROKEN)";
      target.text = "Afflicts one targeted enemy with Distracted 2";
      target.requiremnet = function(){return true};
      target.effect = function(target){
        //  target.dStatus = (Distracted#);
        //  target.dTimer = 2;
      };
      target.multitarget = false;
      target.allies = false;
      target.selftarget = false;

  