# pokeclicker-automator
Some automation scripts for pokeclicker.com.

## auto_clicker.js

The clicker script automatically attacks every 50 ms (that's as fast as the game will register clicks) while in a battle. It also clicks during dungeon encounters to open chests and begin boss fights.

## auto_hatchery.js

The Hatchery script automatically fills the Hatchery queue with Pokémon (up to 4). Pokémon in the queue do not contribute towards your attack, so we don't want to overfill the queue.

When selecting Pokémon, the script uses the sorting direction and filters that you set in the Hatchery screen. The check is performed every 5 seconds.

## auto_underground.js

The Underground script simply uses Bomb whenever you are about to reach maximum energy. It's horribly inefficient, but it's better than wasting energy. It feels nice to wake up to _some_ Underground progress and know that energy is not going to waste.
