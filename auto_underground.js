// ==UserScript==
// @name        Bomb Underground when Energy full - pokeclicker.com
// @namespace   Violentmonkey Scripts
// @match       https://www.pokeclicker.com/
// @grant       none
// @version     1.1
// @author      Ivan Lay
// @description Automatically use Bomb when the next energy tick will put you at max energy or above. Use it or lose it! This is horribly horribly inefficient, but it's better than wasting energy.
// ==/UserScript==

function useBomb() {
  while (
    App.game.underground.getMaxEnergy() -
      Math.floor(App.game.underground.energy) <=
    App.game.underground.getEnergyGain() *
      App.game.oakItems.calculateBonus(OakItemType.Cell_Battery)
  ) {
    Mine.bomb();
    //console.log("Mined!");
  }
}

function loopMine() {
  var bombLoop = setInterval(function () {
    //console.log("Checking underground...");
    useBomb();
  }, 10000); // Every 10 seconds
}

function waitForLoad(){
    var timer = setInterval(function() {
        if (!document.getElementById("game").classList.contains("loading")) {
            // Check if the game window has loaded
            clearInterval(timer);
            loopMine();
        }
    }, 200);
}

waitForLoad();
