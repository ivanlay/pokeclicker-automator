// ==UserScript==
// @name        Auto Hatchery - pokeclicker.com
// @namespace   Violentmonkey Scripts
// @match       https://www.pokeclicker.com/
// @grant       none
// @version     1.0
// @author      Ivan Lay
// @description Uses the sorting (I recommend Breeding Efficiency) and filters (typically, the region you are in. Many people also use Not Shiny to farm shinies) from the Hatchery screen to add Pokemon to the Hatchery queue. Keeps the queue at 4 Pokemon. Checks every 5 seconds.
// ==/UserScript==

function loopEggs() {
  var eggLoop = setInterval(function () {
    while (
      App.game.breeding.canAccess() == true && // Can accessthe Hatchery
      App.game.breeding.queueSlots() >= 4 && // Must have 4 slots
      App.game.breeding.queueList().length < 4 && // 4 = Pokemon in the queue
      App.game.party.hasMaxLevelPokemon() // Don't run if you don't have any level 100 Pokemon
    ) {
      // Filter the sorted list of Pokemon based on the parameters set in the Hatchery screen
      let filteredEggList = App.game.party.caughtPokemon.filter(
        (partyPokemon) => {
          // Only breedable Pokemon
          if (partyPokemon.breeding || partyPokemon.level < 100) {
            return false;
          }
          // Check based on category
          if (BreedingController.filter.category() >= 0) {
            if (
              partyPokemon.category !== BreedingController.filter.category()
            ) {
              return false;
            }
          }
          // Check based on shiny status
          if (BreedingController.filter.shinyStatus() >= 0) {
            if (
              +partyPokemon.shiny !== BreedingController.filter.shinyStatus()
            ) {
              return false;
            }
          }
          // Check based on native region
          if (BreedingController.filter.region() > -2) {
            if (
              PokemonHelper.calcNativeRegion(partyPokemon.name) !==
              BreedingController.filter.region()
            ) {
              return false;
            }
          }
          // Check if either of the types match
          const type1 =
            BreedingController.filter.type1() > -2
              ? BreedingController.filter.type1()
              : null;
          const type2 =
            BreedingController.filter.type2() > -2
              ? BreedingController.filter.type2()
              : null;
          if (type1 !== null || type2 !== null) {
            const { type: types } = pokemonMap[partyPokemon.name];
            if ([type1, type2].includes(PokemonType.None)) {
              const type = type1 == PokemonType.None ? type2 : type1;
              if (!BreedingController.isPureType(partyPokemon, type)) {
                return false;
              }
            } else if (
              (type1 !== null && !types.includes(type1)) ||
              (type2 !== null && !types.includes(type2))
            ) {
              return false;
            }
          }
          return true;
        }
      );

      App.game.breeding.addPokemonToHatchery(filteredEggList[0]);
      //console.log("Added " + filteredEggList[0].name + " to the queue!");
    }
  }, 5000); // Checks every 5 seconds.
}

loopEggs();