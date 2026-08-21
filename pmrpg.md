
Poor Man's RPG
===============
<https://pitchforge.berta.hu/pmrpg.md>

This document describes a simple RPG system utilized by the [pitchforge](https://pitchforge.berta.hu) engine; it follows the below principles:

  1) Simple and free rules, core part should fit on a few A4 sheets of paper.
  2) Paper and six-sided dice -- no fancy tools should be needed. Simple maths, small numbers.
  3) Unlimited progress, but will reach diminishing returns.
  4) Combat is dangerous, even for the strong if outnumbered.
  5) Allow a diverse set of viable character builds, both specialists and generalists.
  6) No powergaming (no complex stacking of bonuses).


# Character

Your character is the one you play during the game. As you become more experienced, you become better at what you do. A fresh character starts at level 1, and may gain further levels, e.g. by completing quests.
Your **level of experience** determines how much you learned, it makes you better in what you are skilled at.
Adventurers at levels 1-3 are beginners; levels 4-6 are adepts; levels 7-9 are seasoned veterans; levels 10+ are superheroes.

We shall use **Character Points** (CPs) to keep a balance between characters. 
Your level 1 character gains `14` CPs, and you gain `1` more at each level.
You can spend your CPs to increase your characteristics or pick up new traits.


## Characteristics

You have the below statistics / characteristics:

  * **Tough**: Physical strength, health, fortitude and endurance, including how you can use these effectively. Determines how much damage you can take or how much you can inflict in combat. Also includes a 'never give up, never surrender' attitude and you can use it to act as a role model or intimidate others.  
  Useful for martial characters, but everyone needs some who wants to survive rough situations.
  
  * **Cool**: Dexterity, agility, precision; allows one to consistently execute the skills they learned, and to remain calm and professional even when under pressure.
  Useful for skill-monkeys.
  
  * **Sharp**: Ability to think logically, rationally and notice tiny details and coming to quick conclusions. Describes your overall intelligence and how well you can read the situation and use their mind. Also affects how many things you can learn (see: Traits).
  Useful for brainy characters (scientists or wizards) and those very vigilant and for jack-of-all trades.
  
  * **Charm**: Charisma and harmony; the strength of your personality, allowing you to influence or seduce others and also resisting influence and remaining who you are. Expresses your spirituality and your ability to lead or empathize with others and read their feelings.
  Useful for characters who communicate a lot or those involved in the mystical arts, but everyone needs some who wants to talk to others or resist harmful effects.

Each of the above are expressed as numerical values.

- Each characteristic starts as `0`, this represents a grown up person who is not very good in the given area.
- You can increase a characteristic from `n` to `n+1` by spending `n+1` CPs. If you want to increase by multiple points, you need to purchase each point individually[^cost_of_characteristics]. 
- Alternatively, you can decrease characteristics below 0, but means your character shall have a challenge in that area; values below `-3` are unlikely to be viable. When decreasing below 0, each decrease gives you 1 CP. Later on, you may decide to increase them by paying back this 1 CP until you reach 0.

[^cost_of_characteristics]: Example: Pay 1 CP for the increase from 0 to 1; pay 2 more CPs for the increase from 1 to 2; pay 3 more CPs for the increase from 2 to 3, etc.

## Resources

* The **body** resource describes your physical condition, and your initial body value is your tough value. You may lose body points, when you get hurt, when you get tired, or when you lose your strength for some reason. 
If your body value becomes 0 or less, you pass out and collapse.
You can regain your body points via a good night's sleep (or something equivalent).
When you are wounded, you may not regain all your body points.

* The **spirit** resource describes your mental and emotional energy; your morale, your resolve and your inner strength. 
If your spirit value becomes 0 or less, you act randomly, become catathonic or just pass out and collapse.
You can regain your spirit points if you can calm down and clear your mind; this may take a few minutes or more, depending on the situation.
When you are traumatized, you may not regain all your spirit points.


## Traits

A trait may represent a skill you learned, an ability or power you acquired.

**Core traits** describe your core competences; your **sharp** limits how many of these you can have. There is a fixed amount of core traits in the game. Core traits (or certain groups of them) are the closest this system has to character classes, where 1-3 traits describe a class..

**Supplementary traits** serve to add refine core traits and allow you to include anything else you picked up.
For example, skills with special weapons, driving certain vehicles, spells you learned, a curse that you may turn into a werewolf, etc.
Many supplementary traits have core traits as prereqs. 
There is no limit on the number of supplementary traits you can pick up and there is no cost (in Character Points) for learning them other than the time invested.


# Tests

Your character is capable adventurer and is assumed to be able to accomplish what he has been trained to do. Such mundane tasks need no special consideration. However, a **test** of you performance is necessary, if extraordinary effort is needed, or 
you need to perform under pressure (in combat for instance).

Your **performance** is expressed as a number based on your characteristics, traits, equipment and any special effects. During the test, your performance is compared against the **difficulty** of the test; this can be a fixed number[^difficulty_fixed], but is your performance is tested against another another character, then the difficulty shall be their performance value[^difficulty_vs].

[^difficulty_fixed]: Leo would like to jump across a chasm. The difficulty is determined by how wide the chasm is.

[^difficulty_vs]: The assassin Xavier would like to ambush Thorg the barbarian. Therefore, we need to test Xavier's performance in stealth vs Thorg's performance in perception.

## Performance

You are always tested for a certain **characteristic**, and your base performance value shall be this characteristic. If multiple characteristics can apply to the test, you use the number for the highest as your base performance.

The test may require a certain trait or a combination of traits.

- If you have the right trait(s), you can
add your character **level** to the base value, as you are skilled in the given task.
- It may happen that you do not have the necessary trait(s), but you have some lesser but viable option. In this case you can add *half* of your level to the base performance.
- If you do not have applicable traits, you cannot add anything to the base performance.

You may add further bonuses or modifiers:

* If your **equipment** has any modifiers to the given test, add these to your performance.
* If there are **special effects** (such as wounds, being drunk, being inspired or blessed) on that have modifiers applicable to the given test, add these too.
* based on equipment, special effects on you and the situation.

These can be tuned further based on the below rules.


### Equipment capping performance

If your equipment has a performance cap, then your performance with the given equipment cannot be higher[^performance_cap] than this cap.

[^performance_cap]: Rudolf inherited an old rifle from his father; the rifle has a performance cap of 7. Rudolf is level 1 and his cool is 3. When he aims with the rifle, his performance is 4. When Rudolf reaches level 4, his performance with the rifle is 7. He gains further levels, but he is never going to go above 7 with his rifle, as it has a limited accuracy. If he wants to shoot better, he needs to find a more accurate rifle.


### Required equipment

If the test requires equipment as a **hard requirement**:

- If you do not have the equipment, you fail[^no_equipment] the test.
- Some equipment may require a test to use, if your performance is too low to pass this test[^equipment_reqs_not_met], you cannot use the equipment properly, and you fail.
- If you have applicable equipment you can use, your performance value is not changed.

[^no_equipment]: Example: You would like to cut through a thick metal door but do not have an appropriate laser cutter. Therefore you cannot.
[^equipment_reqs_not_met]: Thorbald cannot wield a maul in battle where the maul requires a *tough* of at least 4, while his *tough* is just 1. He cannot lift the maul and swing it in battle.


### Randomized tests

Most tests mean that you do your best and you either succeed or fail, and there is no need for dice rolls. However, there are cases when there are so many factors affecting the performance and success or failure depends on tiny nuances. There is an *option* to introduce randomness for such cases.

For randomized tests, you roll two six-sided dice, let's call them a blue one (for random circumstances helping you) and red one (for random circumstances hindering you). You take number on the blue dice and subtract the red dice from it[^dice_analysis]. Add this number to your performance.

Randomized tests are for situations where things depend on pure chance, and there are no circumstances to retry or balance these chances. 
This includes combat and hit-or-miss situations where you have a single chance to do something or not.
Therefore, rolls may happen once only, and cannot be retried later.
You should use static (non-random) tests for situations where you can just try again until you succeed.

In cases where the randomness is purely an advantage with no negative outcomes (or disadvantage with no positive ones), we tweak the above rule to always subtract the lower dice value from the higher one (or vice versa).

[^dice_analysis]: If the two dice are equal, this randomness equals to 0. The highest bonus you can get this way is 5, the lowest is -5. The most likely result of the randomness is 0 (1 to 6), and numbers close to 0 are more likely than extreme numbers like 5 and -5 (which have a likelihood of 1 to 36).


## Result

Compare your performance with the difficulty of the test.
If you performance is:

- Higher or equal to the difficulty, you **succeed**.
- Less than the difficulty, you **fail**.

In rare cases where we need to measure the degree of success or failure, we can treat the result as a number to show the magnitude.

When your performance is tested against another character's, if the two are equal it can mean you both succeed to some degree. This can lead to a pause, a stalemate or a case where e.g. both fighters can hurt each other.

If you are taking an action, success means you can perform the action. Meanwhile, failure can mean that while you carried out what you wanted some unexpected things happened, or you could not carry it out at all.



# Mortality

## Damage

Damage you take can be physical -- expressed in body points, or non-physical -- expressed in spirit points. When either of these reach zero or below, you go down.

## Threat

When you are hurt, you take damage. However, whenever you successfully avoid getting hurt (for example by blocking or evading an attack), you accumulate **threat**.
Each point of threat decreases your performance on tests when you defend yourself, i.e. it appears as a penalty or any defensive tests.
This means that you can defend yourself for a limited time only, and will eventually get overwhelmed.

You get rid of all threat when:

* you are no longer in danger; or
* if you have a combat trait, you can remove all threat from yourself at the cost of 1 spirit point.

## Wounds

When you are seriously hurt, you receive a **wound**. 

* If you have a light wounds only, you get a `-1` penalty on all tests. You recover from light wounds with time.
* If you have a serious wound, then in addition to the penalty for light wounds, your performance is halved all tests. Serious wounds will need treatment, or you do not recover.
* If you have a critical wound, automatically fail all tests. If a critical wound does not get treatment, you die.

## Death

Death is irreversible.



# Core Traits

## Combat-related

  * **melee**: All melee weapons and throwing weapons. 
    Generic trait, specialized science traits require this, such as:
    - **swordfighting**: special attacks for one handed swords
    - **martial arts**: unarmed fighting techniques
  
  * **marksmanship**: all ranged weapons
    - firearms (free supplementary trait, based on game world)
    - archery (free supplementary trait, based on game world)
  
  * **simple weapons** (free supplementary trait): Limited use of simple weapons (knives, clubs, simple pistols) that do not need serious training.
  
  * **initiative**: determines turn-order (who goes first in combat )
  
  * **evasion**: allows using *cool* when defending if you are not wearing armor
  
  * **assassination**: If the target is not aware of your attack and you land an attack that would do at least one point of damage, you kill the target immediately. This requires that you know where the target's vital organs are[^assassination_vital_organs].

[^assassination_vital_organs]: You may know how to kill an ogre with one blow, as it is a humanoid. Still you might not know how to land a killing blow on a giant amoeba.


## Survival-related

* **perception**: Noticing details, threats or anything unusual; being aware of your environment.

* **survival**
* **resistance**: resisting an external effect

* **nature**: Understanding nature and being in harmony with it. 
  The below specialized traits require this and may use it as cross-trait:
  - **horse riding**, **animal taming**, etc.
  - specialized traits for biomes (desert, arctic, etc)

## Skill-related

  * **athletics**

  * **piloting**: Driving vehicles (carts, cars), aircrafts or spaceships, controlling drones, etc.
  
  * **stealth**: hiding, sneaking, acting undetected

  * **stealing**: pickpocketing items

  * **lockpicking**
  
  * **crafting**: Generic trait for crafting items, fixing or building things.
  The below specialized traits require this and may use it as cross-trait:
    - **blacksmithing**, **tailoring**, **mechanics**, **electronics**, **hacking**, etc.

  * **first-aid**: Treating wounds like a skilled nurse. Note:
    - You do not need this trait for very basic first aid, as that can be done via a **cool** test.
    - For performing operations, you will need science trait(s) like **medicine** to have the theoretical background.

## Knowledge-related
  
  * **science**: 
    Generic trait, specialized science traits require this, such as:
    - **mathematics**, **medicine**, **biology**, **quantum physics**, **interstellar navigation**, etc.

  * **lore**: Generic trait about cultural background knowledge and being able to understand such works.
  The below specialized traits require this and may use it as cross-trait:
    - * **history**, **culture**, **religion**, etc.


## Communications-related

  * **leadership**: Inspiring others, diving directions, setting basic tactics, etc.
  * **influencing**: Changing the other side's opinion by arguing in a rational or convincing way. Diplomacy or persuasion.
  * **intimidation**: Threatening the other side.
  * **sexuality**: Seducing someone or pleasing them in bed.
  
  * **art**: Generic trait for creating art. 
    The below specialized traits require this and may use it as cross-trait:
    - **acting**, **painting**, **music**, etc.

# Combat

## Turn Order

Everyone performs an *initiative* test using *sharp*, they act based on their performance in decreasing order. The highest performance acts first, the lowest last. 

## Actions

You can take one action during your turn, in addition to some movement. You can use your action for attacking, taking cover, drinking a potion, or you can do something else.

Each offensive action you take is a *test*, where you compare your attack performance vs the target's defense performance.

### Defenses

  * melee defense for melee attacks:
    - *melee* trait & *tough* & any weapon and shield; or
    - *evasion* trait & *cool*, if you are not wearing armor;

  * ranged defense for ranged attacks:
    - *melee* or *marksmanship* & *tough*, using any cover (where cover may cap your performance); or
    - *evasion* trait & *cool*, if you are not wearing armor;

  * *survival* trait and *tough* for anything affecting your health (disease, poison, nausea);

  * *resistance* trait and *charm* for anything affecting your mind, your morale or trying to change what you are;

  * *perception* trait and *sharp* for spotting tricks or sneaky attempts (often tested vs stealth);


### Offensive actions

  * melee attack:
    - *melee* trait & *tough* (or other characteristic required by weapon) & weapon and offhand;
    - tested vs melee defense;
    - damage is taken on success, threat is built on failure;

  * ranged attack:
    - *marksmanship* trait & *tough* (or other characteristic required by weapon) & weapon;
    - tested vs ranged defense;
    - damage is taken on success, threat is built on failure;
  
  * feint [melee]: 
    - *melee* trait & *tough* (or other characteristic required by weapon) & weapon;
    - tested vs *perception* and *sharp*;
    - double threat on success (but no damage), no threat on failure;

  * sweep attack [melee] (affecting multiple enemies):
    - *tough* (no trait used)
    - tested vs melee defense;
    - damage is taken on success;

  * warcry (affecting multiple enemies):
    - *intimidation* trait and *charm*;
    - tested vs *resistance* trait and *charm*;
    - threat is built on success;

  * way of the rock [martial arts]:
    - *martial arts* trait and *tough*;
    - tested vs melee defense;
    - damage is taken on success, threat is built on failure;

  * way of the gale [martial arts]:
    - *martial arts* trait and *cool*;
    - tested vs *melee* trait and *cool*;
    - damage is taken on success, threat is built on failure;

  * way of the spark [martial arts]:
    - *martial arts* trait and *sharp*;
    - tested vs *melee* trait and *sharp*;
    - damage is taken on success, threat is built on failure;

  * way of the spring [martial arts]:
    - *martial arts* trait and *charm*;
    - tested vs *resistance* trait and *charm*;
    - double threat on success (but no damage), no threat on failure;

  * sword attack [swordfighting]:
    - *swordfighting* trait and *cool*;
    - tested vs *melee* trait and *sharp*;
    - damage is taken on success, threat is built on failure;
