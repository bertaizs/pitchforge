
# Pitchforge engine documentation

# Introduction

Pitchforge is a lightweight game engine for building html text based adventure-RPG hybrids.
It also comes with a poor man's RPG system and some sample games.


Two approaches appear in Pitchforge simultaneously: 

1. Structured approach of **point-and-click** adventure games and rpgs, which model a world and defines rules and the player can act in this sandbox.

2. An unstructured approach of **multiple-choice** adventure games, where the player is offered choices and custom functions are called for each choice.

The second allows complete free thinking. Meanwhile it would require the game author to code opening/closing chests or doors and picking and dropping items to be coded individually. Let alone battles.
The first one gives a framework for these so that the game author can just refer to systems (paths, verbs or the combat system).

For some tasks both approaches can be viable, for some others one is clearly superior.

In the coming section, we shall first list the key classes used, and then give a picture of how the execution flows.


# Key Classes

## Game

This is what connects it all together. Contains the game state and its methods govern the flow of the game. At its heart is a list of Entity-s, and a scheduler which organizes the game into turns, and calls Entity functions regularly.

* `game.entities` lists entities (characters, locations, objects) in the game,
* `game.templates` lists entity types,
* `game.paths` are Paths, i.e. routes between entities,
* `game.player_id` who the selected player character is.

## Entity

Every 'noun' in the game is an Entity; this includes characters, objects, locations, etc. These all end up in the same class as one entity change its role among them. Consider an orc: it is a character, but when it dies then the dead orc is an object. The dead body can be looted, so it functions as a container. Consider a mecha: it is a huge object, but you can enter it, control it, etc, but it may also act on its own. Consider a starship: it is a location where things can happen but in the bigger picture (e.g. in a space battle) it is also an actor or merely an object.

There are two kinds of entities:

* Actual entity 'instances' appearing in the game are listed in `game.entities`, this is the basis of the initiative order.

* You can define 'templates' under `game.templates` which are not actors in the game, but types of actors that can be created; for example, you can define how a generic 'knife' looks like and create actual knives via the static `Entity.spawn`.


Each entity has a *location*, which is another entity. (Except for one, called `game.universe` which is the default location for everything and has no location itself.)

The *inventory* of an entity consists of those entities whose location is the given entity.

An entity may have a *position* at their location, this is used for describing when a sword is wielded as 'weapon', or a power armor is being 'worn', or a player is the 'pilot' within a starship.

Other important attributes:

* `id` -- a unique id of the entity; this is also their key in `game.entities`;

* `name` -- common name for the entity;

* `description` is displayed when looking at the entity; `interior_description` is displayed when looking around *inside* the entity;

* characteristics (stats), traits, etc;

* `tags` describing what the entity is; most notable ones are:

  - 'abstract': then choices are offered only and most of the 'structured' approach is not available (e.g. cannot pick up or drop items, etc);
  - 'character': the entity can act;
  - 'item': the entity can be picked up;
  - 'container': the entity can be opened/closed and entities can be taken out;
  - 'location': the entity can be visited as a location;

Special, built-in entites:

* `game.universe` default location of all entities; also the other entity without any location; its id is always `0`;
* `game.ending` is an abstract location, which is the end of the game;
* `game.chargen` another abstract location, the character generation screen;


## UI

User interface; this class is responsible for displaying anything to the user, and for collecting user input.

The most important method is `ui.refresh()` which refreshes everything on the screen.

As a general rule, methods staring with `show_` display something, while methods starting with `print_` do not display anything but return HTML which can be displayed by a `show_` method.

## Path

Connects two entities, such as a door, a road or a path. 

A Path is always uni-directional. When creating a bi-directional path, it creates two Path objects, referring to each other.

## Choice

When clicking on an entity, a player is presented options to choose from. 
Choices are returned by `Entity.get_choices()` and displayed via `UI.show_entity_choices()`.

A Choice can contains a command (Cmd) or a custom function, can have requirements, etc.

## Cmd / Command

A Command to be executed; an intended action.

## Verb

A possible action, it may have parameters, it may depend on a Challenge which may succeed or fail.

## Test

A way of measuring an Entity's performance, including characteristic(s), trait(s), etc.

## Clue

If a (player) character meets certain requirements, it may find a clue, which is displayed and information can be extracted from them.

## Info

Something a character (entity) knows or info it has. It may be extracted (e.g. mind reading) or it can be found as Clues.

## Explanation

To be removed.

## Requirements

A set of criteria for an Entity, including characteristics (stats), traits, items, equipment, known Info, etc.

Requirements objects are almost always passed in arrays. To a set of requirements to be fulfilled, *any* of the Requirements can be fulfilled, but within a Requirements object, *all* criteria must be met. (An array of Requirements means ORs of ANDs).

## Damage

Amount of damage done; damage value, damage type and damage tier going hand in hand.
Very often goes in arrays (e.g. a flaming sword doing both kinetic and energy damage).

## Value

Returned as a measure of an Entity's *performance*. Contains a number and an explanation on why that number was reached and potentially other data.

# Flow


## Startup
When the game starts, it first load the libraries, and settings are read from `options.js`. Finally, the game executes any initizalization commands from `init.js`.

This is the point when a custom adventure should be created and initialized.

Finally, the game invokes invokes `game.run()`, which starts the main loop of the game via `game.main_loop()`.

## Main loop
The main loop is responsible for organizing the game into turns. 
First it builds an initiative order for entities and goes through each entity and does what they need to do for each turn.

The `main_loop` method first calls `Entity.tick()` for all entities, which is the clock of the game: statues expire, cooldowns proceed, etc.

* Non-player characteres act via their `Entity.act()` method, `main_loop` calls these in the order of initiative.

* Player characters are implemented differently. When a player's turn comes, `main_loop` exists and the user falls back to the user interface. When the player issues a command, it eventually calls `game.main_loop()` again, and it resumes processing entities in the initiative order.

* Non-characters don't have any action.

Entities that are stunned, dead, etc skip their action.

When an entity's turn ends, `game.next_entity()` is called for proceeding to the next one. If this was the last entity in the initiative order, then it is rebuilt, and `game.end_turn()` is called, which resolves move actions (and entities following others, etc).

When entities act, their actions are resolved immediately, except for move actions, because these always happen at turn end. (Otherwise initiative becomes irrelevant, because the player is the one who moves, and everyone would act *after* the player, so the player would always act last in combat.)

When entities act, their actions are not displayed immediately, but are put into the event queue `ui.events` and are displayed together when the user interface is refreshed.

## User interface and player actions

The user interface is refreshed via `ui.refresh()` which is called whenever control is handed over to the player. This displays the player environment, displays events in the event queue and now the player is free to roam on the UI and take actions.

Actions can be:

* Clicking on paths, which initiates a move -- this counts as an action;
* Clicking on entities to display options via `Entity.get_options()` which is formatted by `ui` -- this does NOT count as an action;
* Selecting one of the offered options which executes a Command (Cmd) -- most commands count as an action and end the player's turn, except for "quick" commands which do not. A commands can consist of:

  - a Verb which operands (such as picking up an item or opening a door), or
  - a custom function (which is implemented via the special verb 'custom').

The command always resides in a Cmd object, which is transferred through most methods going forward.

Player commands are executed via `ui.exec()` which calls `game.exec()` and then `Entity.exec()` (for the player entity). This latter branches, and may run Challenges, and may add events into the event queue e.g. via `ui.text()` so that they will be displayed and the next `ui.refresh()`.

## Npc actions

Non-player actions a resolved similarly, but they start differently:
They are not issued via the user interface, but via the given entity's `Entity.act()`. There is a default auto-attack action (searches for a viable target and attacks it and passes if there is no viable target), or a custom function can be called instead. 

Eventually, `game.exec()` is called with a Cmd object, and this command is executed exactly the same way as the user commands.

## Actions via Verbs

Every command (Cmd) has a Verb. It either executes something predefined (structured, point-and-click approach) or a custom function (multiple-choice approach).

Verbs can contain a Challenge, where the acting Entity's *performance* is compared vs a difficulty. In case the acting Entity is challenged by another entity, then the difficulty is usually the other Entity's performance. If the acting Entity's performance is higher or equal to the difficulty, then the challenge is *successful*, otherwise the challenge *fails*. Verbs have a hooks which are called for executing the challenge or for success and fail.

Terminology:

* A *command* (Cmd) is the intention for performing an *action*.

* An *action* means doing something.

* A *verb* is a type of action that can be performed. Most verbs have a *challenge* and functions to call in case of success and failure. (If a verb has no challenge then success is called automatically.)

* A *challenge* means comparing an entity's *performance* with a difficulty (which can be another's performance).

* Performance means how the entity can fare on a *test*, performance is expressed with a *value*.

* A *test* means how an entity's performance is measured. A test always refers to:

  - a characterstic (stat); if more than one is provided then the best one is used,
  - optionally a trait; if more than one is provided, it is checked if the given entity has at least one of those;
  - other parameters (bonuses, minuses, half-traits, etc).
