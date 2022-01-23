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

//All between-turns feedback here
let outputQueue = []

/*

BELOW HERE, I DEFINE ALL ABILITIES AS GLOBAL VARIABLES.

*/

/**
 * @type {Ability}
 */
 let basicAttack = {};
 basicAttack.name = "BasicAttack";
 basicAttack.text = "Deal 3 damage.";
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
  basicHeal.text = "Heal 3 damage.";
  basicHeal.requirement = function(){return true};
  basicHeal.effect = function(target,self){
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
   groupAttack.text = "Deal 1 damage to all enemies.";
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
  groupHeal.text = "Heal 1 Damage to all allies.";
  groupHeal.requirement = function(){return true};
  groupHeal.effect = function(target,self){
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
 heavyAttack.text = "Deal 8 damage.";
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
  selfHeal.text = "Heal 5 damage.";
  selfHeal.requirement = function(){return true};
  selfHeal.effect = function(target,self){
    target.hp = Math.min(target.hp + 5, target.maxHP)
  };
  selfHeal.multitarget = false;
  selfHeal.allies = false;
  selfHeal.selftarget = true;

  //Actual attacks
  
/**
 * @type {Ability}
 */
let mitigate = {};
mitigate.name = "Mitigate";
mitigate.text = "Give ally Regeneration (3,4).";
mitigate.requirement = function(caster, castee){return true};
mitigate.effect = function(target,self){
  console.log(self.name+" used "+mitigate.name+" on "+target.name);
  outputQueue.push(self.name+" used "+mitigate.name+" on "+target.name)
  target.applyStatus("Regen", 3, 4)
};
mitigate.multitarget = false;
mitigate.allies = true;
mitigate.selftarget = false;

/**
 * @type {Ability}
 */
 let flareGun = {};
 flareGun.name = "Flare Gun";
 flareGun.text = "Hit enemy for 1 damage and 50% chance to inflict Burn.";
 flareGun.requirement = function(caster, castee){return true};
 flareGun.effect = function(target, self){
  console.log(self.name+" used "+flareGun.name+" on "+target.name);
  outputQueue.push(self.name+" used "+flareGun.name+" on "+target.name);
  target.takeDamage(self, 1);
  if(Math.random() >= 0.5) target.applyStatus("Burn", 3)
 };
 flareGun.multitarget = false;
 flareGun.allies = false;
 flareGun.selftarget = false;

/**
 * @type {Ability}
 */
let scrum = {};
scrum.name = "Scrum";
scrum.text = "Cure an ally of debuffs, then inflict them with Null(3)";
scrum.requirement = function(caster, castee){return true};
scrum.effect = function(target,self){
  console.log(self.name+" used "+scrum.name+" on "+target.name);
  outputQueue.push(self.name+" used "+scrum.name+" on "+target.name);
  if(target.statuses.debuff.status != "None"){
    console.log(target.name+" was cured of "+target.statuses.debuff.status+" and given Null");
    outputQueue.push(target.name+" was cured of "+target.statuses.debuff.status+" and given Null");
  }else{
    console.log(target.name+" was given Null");
    outputQueue.push(target.name+" was given Null");
  }
  target.statuses.debuff.status = "None";
  target.applyStatus("Null", 3);
};
scrum.multitarget = false;
scrum.allies = true;
scrum.selftarget = false;

/**
 * @type {Ability}
 */
let smolder = {};
smolder.name = "Smolder";
smolder.text = "Hit enemy with fire, damaging them based on your speed";
smolder.requirement = function(caster, castee){return true};
smolder.effect = function(target, self){
  console.log(self.name+" used "+smolder.name+" on "+target.name);
  outputQueue.push(self.name+" used "+smolder.name+" on "+target.name);
  target.takeDamage(self, 3 + Math.ceil(self.queuedAction.speed/2))
};
smolder.multitarget = false;
smolder.allies = false;
smolder.selftarget = false;

/**
 * @type {Ability}
 */
let feint = {};
feint.name = "Feint";
feint.text = "Flinch an enemy.";
feint.requirement = function(caster, castee){return true};
feint.effect = function(target,self){
  console.log(self.name+" used "+feint.name+" on "+target.name);
  outputQueue.push(self.name+" used "+feint.name+" on "+target.name);
  target.applyStatus("Flinch", 1)
};
feint.multitarget = false;
feint.allies = false;
feint.selftarget = false;

/**
 * @type {Ability}
 */
let imbibe = {};
imbibe.name = "Imbibe";
imbibe.text = "Give self Haste(2,5) and Strung Out(2)";
imbibe.requirement = function(caster, castee){return true};
imbibe.effect = function(target,self){
  console.log(self.name+" used "+imbibe.name+" on themself");
  outputQueue.push(self.name+" used "+imbibe.name+" on themself");
  self.applyStatus("Haste", 2, 5)
  self.applyStatus("StrungOut", 2)
};
imbibe.multitarget = true;
imbibe.allies = false;
imbibe.selftarget = false;

/**
 * @type {Ability}
 */
let repel = {};
repel.name = "Repel";
repel.text = "Hit all enemies for 2 damage.";
repel.requirement = function(caster, castee){return true};
repel.effect = function(target, self){
  console.log(self.name+" used "+repel.name+" on enemy team");
  outputQueue.push(self.name+" used "+repel.name+" on enemy team");
  target.takeDamage(self, 2);
};
repel.multitarget = true;
repel.allies = false;
repel.selftarget = false;

/**
 * @type {Ability}
 */
let fallGuy = {};
fallGuy.name = "Fall Guy";
fallGuy.text = "Give all allies Aegis(1), give self Distracted(1).";
fallGuy.requirement = function(caster, castee){return true};
fallGuy.effect = function(target,self){
  console.log(self.name+" used "+fallGuy.name);
  outputQueue.push(self.name+" used "+fallGuy.name);
  target.applyStatus("Aegis", 1)
  if(self.statuses.buff.status = "Aegis"){
    self.statuses.buff.status = "None";
    self.applyStatus("Distracted", 1);
  }
};
fallGuy.multitarget = true;
fallGuy.allies = true;
fallGuy.selftarget = false;

/**
 * @type {Ability}
 */
let crush = {};
crush.name = "Crush";
crush.text = "Deal 8 damage to a target and 4 damage to self.";
crush.requirement = function(caster, castee){return true};
crush.effect = function(target, self){
  console.log(self.name+" used "+crush.name+" on "+target.name);
  outputQueue.push(self.name+" used "+crush.name+" on "+target.name);
  target.takeDamage(self, 8)
  self.hp = Math.min(self.hp-4., self.maxHP)
};
crush.multitarget = false;
crush.allies = false;
crush.selftarget = false;

/**
 * @type {Ability}
 */
let rally = {};
rally.name = "Rally";
rally.text = "Heal ally for 8 damage, while dealing 2 damage to self";
rally.requirement = function(caster, castee){return true};
rally.effect = function(target,self){
  console.log(self.name+" used "+rally.name+" on "+target.name);
  outputQueue.push(self.name+" used "+rally.name+" on "+target.name);
  target.healSelf(8);
  self.hp = Math.min(self.hp-2., self.maxHP)
};
rally.multitarget = false;
rally.allies = true;
rally.selftarget = false;

/**
 * @type {Ability}
 */
let invigorate = {};
invigorate.name = "Invigorate";
invigorate.text = "Give ally Enrage 1.";
invigorate.requirement = function(caster, castee){return true};
invigorate.effect = function(target,self){
  console.log(self.name+" used "+invigorate.name+" on "+target.name);
  outputQueue.push(self.name+" used "+invigorate.name+" on "+target.name);
  target.applyStatus("Enrage", 1)
};
invigorate.multitarget = false;
invigorate.allies = true;
invigorate.selftarget = false;

/**
 * @type {Ability}
 */
let stunnerClap = {};
stunnerClap.name = "Stunner Clap";
stunnerClap.text = "Deal 2 damage to targeted enemy and inflict Strung Out 1.";
stunnerClap.requirement = function(caster, castee){return true};
stunnerClap.effect = function(target, self){
  console.log(self.name+" used "+stunnerClap.name+" on "+target.name);
  outputQueue.push(self.name+" used "+stunnerClap.name+" on "+target.name);
  target.takeDamage(self, 2)
  target.applyStatus("StrungOut", 1)
};
stunnerClap.multitarget = false;
stunnerClap.allies = false;
stunnerClap.selftarget = false;

/**
 * @type {Ability}
 */
let soulRip = {};
soulRip.name = "Soul Rip";
soulRip.text = "Deal 10 damage. Accuracy -25% for each level of fatigue";
soulRip.requirement = function(caster, castee){return true};
soulRip.effect = function(target, self){
  console.log(self.name+" possessed "+target.name);
  outputQueue.push(self.name+" possessed "+target.name);
  if(self.fatigue <= 0 || Math.random() <= (1-.25*self.fatigue)){
    console.log(target.name+"'s soul was torn")
    outputQueue.push(target.name+"'s soul was torn")
    target.takeDamage(self, 10);}
  else{console.log(self.name+" couldn't manifest");
    outputQueue.push(self.name+" couldn't manifest")}  
};
soulRip.multitarget = false;
soulRip.allies = false;
soulRip.selftarget = false;

/**
 * @type {Ability}
 */
let dazzle = {};
dazzle.name = "Dazzle";
dazzle.text = "Targets all enemies, 35% chance to Flinch, 35% chance to Burn";
dazzle.requirement = function(caster, castee){return true};
dazzle.effect = function(target,self){
  if(Math.random() <= 0.35){
    console.log(self.name+"'s "+dazzle.name+" flinched "+target.name);
    outputQueue.push(self.name+"'s "+dazzle.name+" flinched "+target.name);
    target.applyStatus("Flinch", 1)
  }else if(Math.random() <= 0.35){
    console.log(self.name+"'s "+dazzle.name+" burned "+target.name);
    outputQueue.push(self.name+"'s "+dazzle.name+" burned "+target.name);
    target.applyStatus("Burn", 2, 4)
  }else{console.log(target.name+" avoided the "+dazzle.name)
    outputQueue.push(target.name+" avoided the "+dazzle.name);}
};
dazzle.multitarget = true;
dazzle.allies = false;
dazzle.selftarget = false;

/**
 * @type {Ability}
 */
let scry = {};
scry.name = "Scry";
scry.text = "Afflicts one targeted enemy with Distracted 2.";
scry.requirement = function(caster, castee){return true};
scry.effect = function(target,self){
  console.log(self.name+" used "+scry.name+" on "+target.name);
  outputQueue.push(self.name+" used "+scry.name+" on "+target.name);
  target.applyStatus("Distracted", 2)
};
scry.multitarget = false;
scry.allies = false;
scry.selftarget = false;

/**
 * @type {Ability}
 */
let motivate = {};
motivate.name = "Motivate";
motivate.text = "Grants Random effect (Enrage 1, Aegis 1, Haste 2,3)to an ally";
motivate.requirement = function(caster, castee){return true};
motivate.effect = function(target,self){
  let rng = Math.random();
  if(rng <= 0.33){
    console.log(self.name+"'s "+motivate.name+" gave "+target.name+" Aegis 1");
    outputQueue.push(self.name+"'s "+motivate.name+" gave "+target.name+" Aegis 1");
    target.applyStatus("Aegis", 1);
  }
  else if(rng <= 0.66){
    console.log(self.name+"'s "+motivate.name+" gave "+target.name+" Enrage 1");
    outputQueue.push(self.name+"'s "+motivate.name+" gave "+target.name+" Enrage 1");
    target.applyStatus("Enrage", 1);
  }
  else {
    console.log(self.name+"'s "+motivate.name+" gave "+target.name+" Haste 2,3");
    outputQueue.push(self.name+"'s "+motivate.name+" gave "+target.name+" Haste 2,3");
    target.applyStatus("Haste", 2,3);
  }
};
motivate.multitarget = false;
motivate.allies = true;
motivate.selftarget = false;

/**
 * @type {Ability}
 */
let devastation = {};
devastation.name = "Devastation";
devastation.text = "Deal 5 damage to all active enemies.";
devastation.requirement = function(caster, castee){
  if(caster.enemyArray[0].hp <=0 && caster.enemyArray[2].hp <=0){
    return true
  }else{return false}
};
devastation.effect = function(target,self){
  console.log(self.name+"'s "+devastation.name+" hit "+target.name);
  outputQueue.push(self.name+"'s "+devastation.name+" hit "+target.name);
  target.takeDamage(self, 5);
};
devastation.multitarget = true;
devastation.allies = false;
devastation.selftarget = false;

/**
 * @type {Ability}
 */
let ruin = {};
ruin.name = "Ruin";
ruin.text = "Deal 10 damage to targeted enemy.";
ruin.requirement = function(caster, castee){
  if(caster.enemyArray[0].hp <=0 && caster.enemyArray[2].hp <=0){
    return true
  }else{return false}
};
ruin.effect = function(target,self){
  target.takeDamage(self, 10);
  console.log(self.name+" used "+ruin.name+" on "+target.name);
  outputQueue.push(self.name+" used "+ruin.name+" on "+target.name);
};
ruin.multitarget = false;
ruin.allies = false;
ruin.selftarget = false;

/**
 * @type {Ability}
 */
let wince = {};
wince.name = "Wince";
wince.text = "Hit Targeted enemy for 2 damage, inflict Flinch.";
wince.requirement = function(caster, castee){return true};
wince.effect = function(target,self){
  console.log(self.name+" used "+wince.name+" on "+target.name);
  outputQueue.push(self.name+" used "+wince.name+" on "+target.name);
  target.takeDamage(self, 2);
  target.applyStatus("Flinch", 1);
};
wince.multitarget = false;
wince.allies = false;
wince.selftarget = false;

/**
 * @type {Ability}
 */
let lash = {};
lash.name = "Lash";
lash.text = "Hit targeted enemy for 8 damage, if enemy has Aegis Active, deal 16 damage instead.";
lash.requirement = function(caster, castee){return true};
lash.effect = function(target,self){  
  console.log(self.name+" used "+lash.name+" on "+target.name);
  outputQueue.push(self.name+" used "+lash.name+" on "+target.name);
  if(target.statuses.buff.status == "Aegis"){target.takeDamage(self, 16);}
  else {target.takeDamage(self, 8);}
};
lash.multitarget = false;
lash.allies = false;
lash.selftarget = false;

/**
 * @type {Ability}
 */
let flurry = {};
flurry.name = "Flurry";
flurry.text = "50% chance to hit all enemies for 6 damage.";
flurry.requirement = function(caster, castee){return true};
flurry.effect = function(target,self){
  if(Math.random()>0.5){
    console.log(self.name+" hit "+target.name+" in a "+flurry.name);
    outputQueue.push(self.name+" hit "+target.name+" in a "+flurry.name);
    target.takeDamage(self, 6);
  }
  else {console.log(self.name+"'s "+flurry.name+" missed "+target.name);
  outputQueue.push(self.name+"'s "+flurry.name+" missed "+target.name);}
};
flurry.multitarget = true;
flurry.allies = false;
flurry.selftarget = false;
      
/**
 * @type {Ability}
 */
let fortify = {};
fortify.name = "Fortify";
fortify.text = "deal 10 damage to self and heal ally for 10 damage.";
fortify.requirement = function(caster, castee){
  if(castee.hp <= castee.maxHP - 10 && castee.hp > 0&&caster.hp >10){return true}
  else {return false}
};
fortify.effect = function(target, self){
  console.log(self.name+" used "+fortify.name+" on "+target.name+" and took 10 damage");
  outputQueue.push(self.name+" used "+fortify.name+" on "+target.name+" and took 10 damage");
  self.hp = Math.max(self.hp-10, 0)
  target.healSelf(10);
};
fortify.multitarget = false;
fortify.allies = true;
fortify.selftarget = false;

/**
 * @type {Ability}
 */
let exhaust = {};
exhaust.name = "Exhaust";
exhaust.text = "Hit targeted enemy for 2 damage and inflict Encumbered.";
exhaust.requirement = function(caster, castee){return true};
exhaust.effect = function(target,self){
  console.log(self.name+" used "+exhaust.name+" on "+target.name);
  outputQueue.push(self.name+" used "+exhaust.name+" on "+target.name);
  target.takeDamage(self, 2);
  target.applyStatus("Encumbered",999);
};
exhaust.multitarget = false;
exhaust.allies = false;
exhaust.selftarget = false;

/**
 * @type {Ability}
 */
let raze = {};
raze.name = "Raze";
raze.text = "Hit all enemies for 1 damage and 50% chance to inflict Burn 5.";
raze.requirement = function(caster, castee){return true};
raze.effect = function(target,self){
  console.log(self.name+"'s "+raze.name+" hit "+target.name);
  outputQueue.push(self.name+"'s "+raze.name+" hit "+target.name)
  target.takeDamage(self, 1);
  if(Math.random()>0.5){target.applyStatus("Burn", 5);}
};
raze.multitarget = true;
raze.allies = false;
raze.selftarget = false;

/**
 * @type {Ability}
 */
 let slump = {};
 slump.name = "Slump";
 slump.text = "Grants self Regen (1,6)";
 slump.requirement = function(caster, castee){return true};
 slump.effect = function(target, self){
   console.log(self.name+" "+slump.name+"ed");
   outputQueue.push(self.name+" "+slump.name+"ed");
   self.applyStatus("Regen",1,6);
 };
 slump.multitarget = true;
 slump.allies = true;
 slump.selftarget = false;

 /**
 * @type {Ability}
 */
  let hunker = {};
  hunker.name = "Hunker";
  hunker.text = "Grants self Aegis (2))";
  hunker.requirement = function(caster, castee){return true};
  hunker.effect = function(target, self){
    console.log(self.name+" "+hunker.name+"ed");
    outputQueue.push(self.name+" "+hunker.name+"ed");
    self.applyStatus("Aegis", 2);
  };
  hunker.multitarget = true;
  hunker.allies = true;
  hunker.selftarget = false;
    

  