todo
====

# top bugs

- a dead player can still walk away if walks just before receiving a finishing blow

# bugs

greataxe damage is explicitly defined, so returned as an array
  ... some things don't work with damage arrays
  same with flaming sword
default damage is returned as an object

# must have

- ? high tier damage should ignore armor (order of halving and minus) ?

- ? graze hits: half damage




- grenades
  - frag grenade
  - emp grenade
  - poison grenade

- robots
  - patrol droid
  - cyber droid
  - battle droid
  - drone

events should look nicer, there should be an event class


# lesser multi-choice bugs


- choices should use builtin test features of verbs

- do not offer any choices when the game is over...

- minor bugs remain around punctuation utils / sentence:
  * may add a period (.) after a whitespace
  * may add a period (.) inside a link

- choices from templates do not work properly :( workaroud: global choices.. not good...
  --> hook table with functions, remains static, refer to these functions


# rework as multiple-choice

- common actions
  * combat
  * unlocking doors

- mark source of choices, make it possible to disable this via options

# features

- talking to the Butler
  * get info
  * let into cellar

- let into study

# mvp

## revamped - story
! write texts for mvp

## core, mvp
! clean up mobile interface -- leszed?
? sneaking ??
? hints for mobile
? explanations ?

* proceed with work panel clickable/colored entities

# future releases  

## bugs

  - only increase is possible during level-up (part of it is already implemented but not working)

## revamped story

restoring power

?? roof, clues:
  - no escape route
  - escape route after idol destroyed

crafting lockpicks

dog, can be freed

cemetery, ghost

### polish the end of game

## wrapping
* generate pmrpg docs from help texts
  - markdown frame
  - populate template with javascript
  - convert markdown to html
  - makefile to generate these

## core function, in next release

?? darkness
- in cellar
- light sources

* weapon reqs, penalties
  weapon bonuses

* alternative moves
  - feint
  - aim / snipe
  - kick / martial arts

* equipment
  - handle other equipment too, not just weapons

* create trait for non-turn ending examine

* initiative: revisit as it does not help now ???
  - if X enters a location, other entities should not be able to react to them if they are after them in initiative order

### save and load game

<!--* figure rules for movement, initiative and 
  attacks (if you enter, you always get auto-attacked)
  + you get one move and one action in your turn; action ends turn
    - solves dashing/running
    - if you move when not in combat, you first end turn and then move?
  - nope: set status for 'just entered'-->

* second operand of verbs
  - use selector for text operands

* explanations
  * hide explanation on new click
  * properly explain performance too, not just stats
  
* go to respec/levelup as a creation step

* safe in the study
  
## rules

??? spec required --> full value if spec, otherwise penalty
??? spec not required --> spec not taken into account? minor bonus only?

## interface


## nice to have

* character generator
  - add hobby

* allow unlimited operands for verbs ???

* options?



# appendix

doors
• keyring - img

items
• broken samurai sword
• broken pot
• almost accurate earth globe
• diary (vamp)
• diary (lady)
• abandoned birds nest
• chimney (prop)
• silver knife
• candelabra, silver


generator, light, light switch
