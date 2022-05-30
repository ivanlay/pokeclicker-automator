// ==UserScript==
// @name        Auto Hatchery - pokeclicker.com
// @namespace   Violentmonkey Scripts
// @match       https://www.pokeclicker.com/
// @grant       none
// @version     1.1
// @author      Ivan Lay
// @description Automatically hatches eggs at 100% completion. Then uses the sorting and filters from the Hatcher to fill it with the best remaining Pokémon.
// ==/UserScript==
var hatcheryAutomationEnabled = true;
var node = document.createElement('div');
node.classList.add('card');
-node.classList.add('mb-3');
node.innerHTML = '<div id="scriptHatcheryAutomation" class="card-header"><span>Hatchery</span></div><div id="clickBody" class="card-body"><button id="toggleHatchery" class="btn btn-success" type="button">'
               + 'Hatchery Automation Enabled</button></div>'

node.setAttribute('id', 'hatcheryContainer');
document.getElementById('left-column').appendChild(node);
document.getElementById('toggleHatchery').addEventListener('click', ToggleHatcheryAutomation, false);

function ToggleHatcheryAutomation(){
    hatcheryAutomationEnabled = !hatcheryAutomationEnabled;
    var button = document.getElementById('toggleHatchery');
    if (!hatcheryAutomationEnabled) {
        button.classList.remove('btn-success');
        button.classList.add('btn-danger');
        button.innerText = 'Hatchery Automation Disabled';
    } else {
        button.classList.remove('btn-danger');
        button.classList.add('btn-success');
        button.innerText = 'Hatchery Automation Enabled';
    }
}

function loopEggs() {
  var eggLoop = setInterval(function () {
    if (hatcheryAutomationEnabled) {
      // Attempt to hatch each egg. If the egg is at 100% it will succeed
      [0, 1, 2, 3].forEach((index) => App.game.breeding.hatchPokemonEgg(index));

      // Now add eggs to empty slots if we can
      while (App.game.breeding.canBreedPokemon()) {  // Helper in code to do this.
        // Filter the sorted list of Pokemon based on the parameters set in the Hatchery screen
        let filteredEggList = PartyController.getHatcherySortedList().filter(partyPokemon => BreedingController.visible(partyPokemon)());

        if(App.game.breeding.canBreedPokemon()) {
          App.game.breeding.addPokemonToHatchery(filteredEggList[0]);
          console.log("Added " + filteredEggList[0].name + " to the Hatchery!");
        }
      }
    }
  }, 50); // Runs every game tick
}

function waitForLoad(){
    var timer = setInterval(function() {
        if (!document.getElementById("game").classList.contains("loading")) {
            // Check if the game window has loaded
            clearInterval(timer);
            loopEggs();
        }
    }, 200);
}

waitForLoad();
