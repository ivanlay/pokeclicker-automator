// ==UserScript==
// @name        Auto Clicker - pokeclicker.com
// @namespace   Violentmonkey Scripts
// @match       https://www.pokeclicker.com/
// @grant       none
// @version     1.1
// @author      Ivan Lay
// @description Clicks through battles appropriately depending on the game state.
// ==/UserScript==

function autoClicker() {
  var autoClickerLoop = setInterval(function () {
    // Click while in a normal battle
    if (App.game.gameState == GameConstants.GameState.fighting) {
      Battle.clickAttack();
    }

    // Click while in a gym battle
    if (App.game.gameState === GameConstants.GameState.gym) {
      GymBattle.clickAttack();
    }

    // Click while in a dungeon - will also interact with non-battle tiles (e.g. chests)
    if (App.game.gameState === GameConstants.GameState.dungeon) {
      DungeonRunner.handleClick();
    }

    // Click while in Safari battles
    if (Safari.inBattle()) {
      BattleFrontierBattle.clickAttack();
    }
  }, 50); // The app is hard-capped at 50
}

autoClicker();