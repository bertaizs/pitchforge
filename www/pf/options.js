
var options = {}

options.pictures_location = '../pics'
options.picture_ext = 'png'

// check if running online
if(String(document.location).match(/^http/)) {
  options.pictures_location = 'https://storage.googleapis.com/static-files-revamped-berta-hu/pics'
  options.picture_ext = 'jpg'
}

options.log_clicks_on_verbs = false
options.log_clicks_on_entities = true
options.log_clicks_on_paths = false

options.log_tests = false
// options.log_test_details = false
options.log_test_results = false

options.log_damage = true
options.log_threat = true

options.log_move = false
options.log_move_actions = true

options.log_turn_start = true       // log when a game turn starts (i.e. not entity's turn)
// options.log_ticks = true
options.log_entity_ticks = false     // log tick for every entity (incl. items, locations)
options.log_character_turns = true  // log when a character's turn starts

options.log_perception_on_charsheets = false

options.log_matching = true // log when matches are found or if no match is found
options.log_matching_details = false  // log each comparison (cmp what with what)
options.log_matching_details2 = false // inner details of comparison (Entity, regexp, etc)

options.log_commands = true
options.log_player_turn_milestones = true
options.log_events = true       // also log anything outputted as an event

options.show_tags = false

options.log_game_fns = false

options.debug = false    // debug mode

options.npcs_passive = false // if true, npcs do not act
options.no_ticks = false // if true, ticks/time is turned off

options.end_game_on_player_down = true

options.show_full_knowledge = false  // quests/journal shows the full Info block as JSON

options.show_events_at_other_locations = false

options.show_choice_source = false

options.randomize_attacks = true
options.randomize_tests_by_default = false // except for attacks
options.log_random = true
