// ==UserScript==
// @name        Auto Clicker - pokeclicker.com
// @namespace   Violentmonkey Scripts
// @match       https://www.pokeclicker.com/
// @grant       none
// @version     1.1
// @author      Ivan Lay
// @description Clicks through battles appropriately depending on the game state.
// ==/UserScript==
var autoClick = true;
var autoOpenChest = false;
var autoFightBoss = false;
var autoRevealDungeon = false;
var node = document.createElement('div');
node.classList.add('card');
node.classList.add('mb-3');
node.innerHTML = '<div id="scriptClickAutomation" class="card-header">'
               + '<span>AutoClick</span>'
               + '</div>'
               + '<div id="clickBody" class="card-body btn-group">'
               + '<button id="toggleClick" class="btn btn-success" type="button">AutoClick On</button>'
               + '<button id="toggleBossfight" class="btn btn-danger" type="button">AutoFightBoss Off</button>'
               + '<button id="toggleChestOpening" class="btn btn-danger" type="button">AutoOpenChest Off</button>'
               + '<button id="toggleAutoReveal" class="btn btn-danger" type="button">AutoReveal Off</button>'
               + '</div>';

// Top-left corner is 0.0
// This returns an object with 2 values ; x (horizontal position) and y (vertical position)
function GetPlayerPosition(){
    return DungeonRunner.map.playerPosition();
}
function MoveTo(x, y){
    DungeonRunner.map.moveToCoordinates(x, y);
}
function RevealMap(){
    DungeonRunner.map.showAllTiles();
}

function ToggleAutoOpenChest(){
    autoOpenChest = !autoOpenChest;
    toggleBtn('toggleChestOpening', autoOpenChest, "AutoOpenChest");
    return autoOpenChest;
}
function ToggleAutoFightBoss(){
    autoFightBoss = !autoFightBoss;
    toggleBtn('toggleBossfight', autoFightBoss, "AutoFightBoss");
    return autoFightBoss;
}
function ToggleAutoClick(){
    autoClick = !autoClick;
    toggleBtn('toggleClick', autoClick, "AutoClick");
    return autoClick;
}
function ToggleAutoReveal(){
    autoRevealDungeon = !autoRevealDungeon;
    toggleBtn('toggleAutoReveal', autoRevealDungeon, "AutoReveal");
    return autoRevealDungeon;
}

function toggleBtn(id, state, name) {
    var button = document.getElementById(id);
    if (!state) {
        button.classList.remove('btn-success');
        button.classList.add('btn-danger');
        button.innerText = name + ' Off';
    } else {
        button.classList.remove('btn-danger');
        button.classList.add('btn-success');
        button.innerText = name + ' On';
    }
}

function autoClicker() {
  node.setAttribute('id', 'autoClickContainer');
  document.getElementById('battleContainer').appendChild(node);
  document.getElementById('toggleClick').addEventListener('click', ToggleAutoClick, false);
  document.getElementById('toggleChestOpening').addEventListener('click', ToggleAutoOpenChest, false);
  document.getElementById('toggleBossfight').addEventListener('click', ToggleAutoFightBoss, false);
  document.getElementById('toggleAutoReveal').addEventListener('click', ToggleAutoReveal, false);

  var autoClickerLoop = setInterval(function () {
    if (autoClick){
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
            if(autoRevealDungeon){
                RevealMap();
            }
            if (DungeonRunner.fighting() && !DungeonBattle.catching()) {
                DungeonBattle.clickAttack();
            } else if (DungeonRunner.map.currentTile().type() === GameConstants.DungeonTile.chest && autoOpenChest) {
                DungeonRunner.openChest();
            } else if (DungeonRunner.map.currentTile().type() === GameConstants.DungeonTile.boss && !DungeonRunner.fightingBoss() && autoFightBoss) {
                DungeonRunner.startBossFight();
            }
        }

        // Click while in Safari battles
        if (Safari.inBattle()) {
            BattleFrontierBattle.clickAttack();
        }
    }
  }, 50); // The app hard-caps click attacks at 50
}

function waitForLoad(){
    var timer = setInterval(function() {
        if (!document.getElementById("game").classList.contains("loading")) {
            // Check if the game window has loaded
            clearInterval(timer);
            autoClicker();
        }
    }, 200);
}

waitForLoad();
