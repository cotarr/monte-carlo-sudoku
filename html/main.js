'use strict';

let errorMessage = '';
//
// This is the starting puzzle containing input from user
//
let puzzle = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]];

//
// This is working copy, reset to puzzle array for each new iteration loop
//
let working = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]];

//
// Convert HTML <table> containing <input> elements to string array
// Includes character validation" empty string or 12345678
//
const getInput = () => {
  // for error message string
  let error = null;

  // puzzle is global in app
  puzzle = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]];

  const validChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const str = document.getElementById('inCell' + row.toString() + col.toString()).value;
      if (str.length > 1) {
        error = 'Invalid input (string length > 1)';
      }
      if (str.length === 1) {
        if (validChars.indexOf(str) < 0) {
          error = 'Invalid input (Alowed 1-9)';
        }
      }
      if ((!error) && (str.length > 0)) {
        puzzle[row][col] = parseInt(str);
      }
    }
  }
  // error, clear array
  if (error) {
    errorMessage = error;
    puzzle = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]];
  }
};

//
// deep copy to avoid changing the original
//
const reset = () => {
  working = JSON.parse(JSON.stringify(puzzle));
};

//
// This updates the HTML table on the web page
//
const update = () => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      let str = working[row][col].toString();
      if (working[row][col] === 0) str = ' ';
      document.getElementById('cell' + row.toString() + col.toString()).textContent = str;
    }
  }
};

const showError = () => {
  if ((errorMessage) && (errorMessage.length > 0)) {
    document.getElementById('errorDiv').removeAttribute('hidden');
    document.getElementById('errorContent').textContent = errorMessage;
  } else {
    document.getElementById('errorDiv').setAttribute('hidden', '');
  }
};

const clearError = () => {
  errorMessage = null;
  showError();
};

//
// Count empty squares, returns integer
//
const countEmpty = () => {
  let count = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (working[row][col] === 0) count++;
    }
  }
  return count;
};

//
// Show count of empty squares on page
//
const updateEmpty = () => {
  document.getElementById('emptyCount').textContent = 'Empty: ' + countEmpty().toString();
};

//
// Generate new coordinate: random row, random column
// Check if coordinate assigned by user in original (puzzle), if so, choose another
//
const generateCoord = () => {
  let done = false;
  let row;
  let col;
  do {
    row = Math.floor(Math.random() * 9);
    col = Math.floor(Math.random() * 9);
    // This is not an immutable element in original array, stop and retun result.
    if (puzzle[row][col] === 0) done = true;
  } while (!done);
  return [row, col];
};

//
// The next three functions check if number is unique in row, column or 3x3
// This is sudoku rules 1 to 9 not duplicated
//

// return true if allowed
const checkColumn = (inRow, inCol, value) => {
  let allowed = true;
  for (let row = 0; row < 9; row++) {
    if ((working[row][inCol] === value) && (inRow !== row)) allowed = false;
  }
  return allowed;
};

// return true if allowed
const checkRow = (inRow, inCol, value) => {
  let allowed = true;
  for (let col = 0; col < 9; col++) {
    if ((working[inRow][col] === value) && (inCol !== col)) allowed = false;
  }
  return allowed;
};

// return true if allowed
const check3x3 = (inRow, inCol, value) => {
  let allowed = true;
  let rowStart = 0;
  let rowLimit = 3;
  if (inRow > 2) {
    rowStart = 3;
    rowLimit = 6;
  }
  if (inRow > 5) {
    rowStart = 6;
    rowLimit = 9;
  }
  let colStart = 0;
  let colLimit = 3;
  if (inCol > 2) {
    colStart = 3;
    colLimit = 6;
  }
  if (inCol > 5) {
    colStart = 6;
    colLimit = 9;
  }
  for (let row = rowStart; row < rowLimit; row++) {
    for (let col = colStart; col < colLimit; col++) {
      if ((working[row][col] === value) && (inRow !== row) && (inCol !== col)) allowed = false;
    }
  }
  return allowed;
};

// This checks for sudoku rule violation in user input array, 1 to 9 only used only 1 time
const checkValidInput = () => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row][col] > 0) {
        if (
          !checkColumn(row, col, puzzle[row][col]) ||
          !checkRow(row, col, puzzle[row][col]) ||
          !check3x3(row, col, puzzle[row][col])) {
          errorMessage = 'Invalid starting puzzle (duplicates found)';
        }
      }
    }
  }
};

//
// Insert a new guess into the game
//
const insertGuess = () => {
  const coord = generateCoord();
  const randomRow = coord[0];
  const randomCol = coord[1];
  let done = false;
  let nextGuess;
  let guessSet = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  do {
    if (guessSet.length > 1) {
      const index = Math.floor(Math.random() * guessSet.length);
      // splice returns typeof === 'object' so used parseInt to make number
      nextGuess = parseInt(guessSet.splice(index, 1));
    } else {
      if (guessSet.length === 1) {
        nextGuess = guessSet[0];
        guessSet = [];
      } else {
        // Abort, no more guesses
        // console.log('Aborted... no more guesses at ' + randomRow + ' ' + randomCol);
        return true;
      }
    }

    // console.log('checking ' + randomRow + ' ' + randomCol + ' ' + nextGuess);
    if (
      (checkColumn(randomRow, randomCol, nextGuess)) &&
      (checkRow(randomRow, randomCol, nextGuess)) &&
      (check3x3(randomRow, randomCol, nextGuess))) {
      done = true;
    }
  } while (!done);
  // console.log('allowed ' + randomRow + ' ' + randomCol + ' ' + nextGuess);
  working[randomRow][randomCol] = nextGuess;
  return false;
};

// THis function will dynamically create the <tr>, <td>, and <input>
// elements, then insert the elements into the <table><tbody> element.
// This styles are generated to provide 3x3 and 9x9 layout.
const buildTableHtml = () => {
  const inputTbodyEl = document.getElementById('sudokuInputTableBody');
  for (let i = 0; i < 9; i++) {
    const inputTrEl = document.createElement('tr');
    for (let j = 0; j < 9; j++) {
      const inputTdEl = document.createElement('td');
      inputTdEl.classList.add('input-td');
      if ((j === 2) || (j === 5)) {
        inputTdEl.classList.add('input-td-vert-gap');
      }
      if ((i === 2) || (i === 5)) {
        inputTdEl.classList.add('input-td-horiz-gap');
      }
      const inputInputEl = document.createElement('input');
      inputInputEl.id = 'inCell' + i.toString() + j.toString();
      inputInputEl.classList.add('input-input');
      if (window.innerWidth < 550) {
        inputInputEl.classList.add('input-input-mobile-width');
      }
      inputInputEl.setAttribute('type', 'text');
      inputInputEl.setAttribute('minlength', '0');
      inputInputEl.setAttribute('maxlength', '1');
      inputInputEl.setAttribute('size', '1');
      inputTdEl.appendChild(inputInputEl);
      inputTrEl.appendChild(inputTdEl);
    }
    inputTbodyEl.appendChild(inputTrEl);
  }

  const outputTbodyEl = document.getElementById('sudokuOutputTableBody');
  for (let i = 0; i < 9; i++) {
    const outputTrEl = document.createElement('tr');
    for (let j = 0; j < 9; j++) {
      const outputTdEl = document.createElement('td');
      outputTdEl.id = 'cell' + i.toString() + j.toString();
      outputTdEl.classList.add('output-td');
      if ((j === 2) || (j === 5)) {
        outputTdEl.classList.add('output-td-vert-gap');
      }
      if ((i === 2) || (i === 5)) {
        outputTdEl.classList.add('output-td-horiz-gap');
      }
      outputTrEl.appendChild(outputTdEl);
    }
    outputTbodyEl.appendChild(outputTrEl);
  }
};

// ------------------
//   Event handlers
// ------------------
// Button to show panel that is hidden by default on page load
document.getElementById('enterInputBotton').addEventListener('click', () => {
  document.getElementById('enterInputButtonDiv').setAttribute('hidden', '');
  document.getElementById('enterInputTableDiv').removeAttribute('hidden');
});

// Button to show panel that is hidden by default on page load
document.getElementById('showDebugPanelButton').addEventListener('click', () => {
  document.getElementById('showDebugPanelButtonDiv').setAttribute('hidden', '');
  document.getElementById('debugPanelDiv').removeAttribute('hidden');
});

const resetVariables = () => {
  running = false;
  clearError();
  getInput();
  if (!errorMessage) {
    reset();
  }
  if (!errorMessage) {
    checkValidInput();
  }
  update();
  updateEmpty();
  showError();
};

document.getElementById('resetButtonMainId').addEventListener('click', () => {
  resetVariables();
});

document.getElementById('debugResetButtonId').addEventListener('click', () => {
  resetVariables();
});

document.getElementById('debuguess1ButtonId').addEventListener('click', () => {
  running = false;
  if (!errorMessage) {
    insertGuess();
  }
  update();
  updateEmpty();
  showError();
});

document.getElementById('debugGuess1000ButtonId').addEventListener('click', () => {
  running = false;
  if (!errorMessage) {
    for (let i = 0; i < 1000; i++) insertGuess();
  }
  update();
  updateEmpty();
  showError();
});

document.getElementById('debugReset10000ButtonId').addEventListener('click', () => {
  running = false;
  clearError();
  getInput();
  if (!errorMessage) {
    reset();
  }
  if (!errorMessage) {
    checkValidInput();
  }
  if (!errorMessage) {
    for (let i = 0; i < 10000; i++) insertGuess();
  }
  update();
  updateEmpty();
  showError();
});

let running = false;
let active = false;

document.getElementById('startContinuous').addEventListener('click', () => {
  running = false;
  clearError();
  getInput();
  if (!errorMessage) {
    reset();
  }
  if (!errorMessage) {
    checkValidInput();
  }
  if (!errorMessage) {
    running = true;
  }
  showError();
});

document.getElementById('stopContinuous').addEventListener('click', () => {
  running = false;
});

// This was set using Chrome Web Browser, values were picked to
// avoid browser CPU violations in console.log

setInterval(() => {
  if ((running) && (!active)) {
    active = true;
    // const startTime = new Date().getTime();
    reset();
    for (let i = 0; i < 10000; i++) insertGuess();
    update();
    updateEmpty();
    if (countEmpty() === 0) {
      running = false;
    }
    // const endTime = new Date().getTime();
    // console.log('elapsed time: ' + (endTime - startTime));
    active = false;
  }
}, 250);

// --------------------
// Initialization
// --------------------

clearError();
buildTableHtml();
getInput();
if (!errorMessage) {
  reset();
}
if (!errorMessage) {
  checkValidInput();
}
update();
updateEmpty();
showError();
