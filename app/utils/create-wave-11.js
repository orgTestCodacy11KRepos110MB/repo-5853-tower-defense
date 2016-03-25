import Board from 'tower-defense/objects/board';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';
import Ember from 'ember';
import Mob from 'tower-defense/objects/mob';
import PathCoords from 'tower-defense/objects/path-coords';
import TowerGroup from 'tower-defense/objects/tower-group';
import Tower from 'tower-defense/objects/tower';
import Wave from 'tower-defense/objects/wave';

function addBoardToWave(wave) {
  const board = Board.create();
  board.set('imageUrl', '/images/path-11.png');

  const pathObjects = [
    PathCoords.create({ x: -3, y: 75 }),
    PathCoords.create({ x: 15, y: 75 }),
    PathCoords.create({ x: 15, y: 25 }),
    PathCoords.create({ x: 50, y: 25 }),
    PathCoords.create({ x: 50, y: 75 }),
    PathCoords.create({ x: 85, y: 75 }),
    PathCoords.create({ x: 85, y: 25 }),
    PathCoords.create({ x: 103, y: 25 })
  ];

  pathObjects.forEach((pathObject) => {
    board.get('pathData').addObject(pathObject);
  });

  wave.set('board', board);
}

function addMobsToWave(wave) {
  const mobs = [];

  const mobQuantity = 10;
  for (var i = 0; i < mobQuantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: 2000,
      health: 300,
      maxHealth: 300,
      points: 10,
      quantity: mobQuantity,
      speed: 10, // seconds to cross one axis of the board
      type: 'standard'
    });

    mobs.push(newMob);
  }
  wave.set('mobs', Ember.A(mobs));
}

function addTowerGroupsToWave(wave) {
  let groupNum = 1;

  function getNewTowerGroup(numRows, posY) {
    return TowerGroup.create({
      id: generateIdForRecord(),
      groupNum,
      numRows,
      posY,
      selector: 'tower-group-' + groupNum++,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  // getNewTowerGroup = function(numRows, posY)
  const towerGroup1 = getNewTowerGroup(7, 32);

  // addTowersToTowerGroup = function(towerGroup, specsForTowers)
  addTowersToTowerGroup(towerGroup1, [
    { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }
  ]);

  wave.set('towerGroups', Ember.A([towerGroup1]));
}

function addTowersToTowerGroup(towerGroup, specsForTowers) {
  function getNewTower(towerNum, type) {
    return Tower.create({
      id: generateIdForRecord(),
      attackPower: 20,
      attackRange: 20,
      selector: `tower-${towerGroup.get('groupNum')}-${towerNum}`,
      type,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  let newTowers = [];
  for (var i = 1; i < specsForTowers.length + 1; i++) {
    newTowers.addObject(getNewTower(i, specsForTowers.objectAt(i - 1).type));
  }

  towerGroup.set('towers', newTowers);
}

function generateIdForRecord() {
  function generate4DigitString() {
    const baseInt = Math.floor((1 + Math.random()) * 0x10000);
    return baseInt.toString(16).substring(1);
  }

  return generate4DigitString() + generate4DigitString() + '-' +
         generate4DigitString() + '-' + generate4DigitString() + '-' +
         generate4DigitString() + '-' + generate4DigitString() +
         generate4DigitString() + generate4DigitString();
}

export default function createWave11() {
  const wave = Wave.create({
    towerStylesHidden: false,
    instructions: {
      main: `To vertically position individual towers, use \`align-self\`, which
             accepts the same values as \`align-items\`.

Use \`justify-content\` and \`align-self\` to move your towers
into position.

**justify-content**
* \`flex-start\`: group items at the start of a container's main axis
* \`flex-end\`: group items at the end of the main axis
* \`center\`: group items in the center of the main axis
* \`space-between\`: evenly distribute items along the main axis such that the
first item aligns at the start and the final item aligns at the end
* \`space-around\`: evenly distribute items along the main axis such that all
items have equal space around them

**align-self**
* \`flex-start\`: align item at the start of a container's cross axis
* \`flex-end\`: align item at the end of the cross axis
* \`center\`: align item at the center of the cross axis

<u>Reminder</u>: \`align-self\`, like \`align-items\`, also accepts the values
<i>baseline</i> and <i>stretch</i>, but these values cannot be used in Flexbox
Defense.`,
      tldr: `Use <nobr class="text__code">justify-content ▾</nobr> and <nobr
             class="text__code">align-self ▾</nobr> to move your towers into
             position.`
    },
    minimumScore: 80
  });

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
