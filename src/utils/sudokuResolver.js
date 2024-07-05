function getRow(rowIndex, sudoku) {
  return sudoku[rowIndex];
}

function getColumn(colIndex, sudoku) {
  let col = [];
  for (let i = 0; i < sudoku.length; i++) {
    col.push(sudoku[i][colIndex]);
  }
  return col;
}

function getSquare(squareIndex, sudoku) {
  let square = [];
  let rowStarter = Math.floor(squareIndex / 3) * 3;
  let colStarter = (squareIndex % 3) * 3;
  for (let x = rowStarter; x < rowStarter + 3; x++) {
    for (let y = colStarter; y < colStarter + 3; y++) {
      square.push(sudoku[x][y]);
    }
  }
  return square;
}

function getSquareIndex(rowIndex, colIndex) {
  const squareIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);
  return squareIndex;
}

export function getValidValues(rowIndex, colIndex, sudoku) {
  let validValues = [];
  const row = getRow(rowIndex, sudoku);
  const column = getColumn(colIndex, sudoku);
  const square = getSquare(getSquareIndex(rowIndex, colIndex), sudoku);

  for (let i = 1; i < 10; i++) {
    if (!row.includes(i) && !column.includes(i) && !square.includes(i)) {
      validValues.push(i);
    }
  }
  return validValues;
}

// Locate the cell with the fewest possible solutions.
// Stores the cell with properties in cellsData
export function findNextCell(sudoku, cellsData) {
  let minValidValues = 9;
  let nextCellRow = 0;
  let nextCellCol = 0;
  let emptyCells = 0;
  let nextValidValues = [];

  for (let row = 0; row < sudoku.length; row++) {
    for (let col = 0; col < sudoku.length; col++) {
      if (sudoku[row][col] === 0) {
        emptyCells += 1;
        let validValues = getValidValues(row, col, sudoku);
        if (validValues.length < minValidValues) {
          minValidValues = validValues.length;
          nextCellRow = row;
          nextCellCol = col;
          nextValidValues = validValues;
        }
      }
      if (minValidValues < 2) break;
    }
  }

  updateCellsData(nextCellRow, nextCellCol, nextValidValues, cellsData);
  return { row: nextCellRow, col: nextCellCol, emptyCells: emptyCells };
}

function updateCellsData(row, col, validValues, cellsData) {
  cellsData[`${row}${col}`] = {
    validValues: validValues,
    currentIndex: 0,
  };
}

// The checkBranch function handles the backtracking logic for solving a Sudoku puzzle.
// It checks if the current cell has exhausted its possible values.
// If so, it resets the cell, backtracks to the previous cell in history, and calls itself recursively.
// If there are still possible values, it returns the current cell's coordinates.
export function checkBranch(row, col, sudoku, history, cellsData) {
  const cell = `${row}${col}`;
  const currIndex = cellsData[cell].currentIndex;
  const validVals =
    cellsData[cell].validValues.length > 0
      ? cellsData[cell].validValues.length
      : 0;
  if (validVals === 0 || currIndex > validVals - 1) {
    console.log("entrato nell'if di checkBranch");
    sudoku[row][col] = 0;
    if (history.length > 1) {
      history.pop();
      const previousCell = history[history.length - 1];
      return checkBranch(
        previousCell[0],
        previousCell[1],
        sudoku,
        history,
        cellsData
      );
    } else return;
  } else {
    console.log(`sto tornando la cella ${row}, ${col}`);
    return { newRow: row, newCol: col };
  }
}

export function checkSudoku(sudoku) {
  for (let row = 0; row < sudoku.length; row++) {
    for (let col = 0; col < sudoku.length; col++) {
      if (sudoku[row][col] === 0) {
        return false;
      }
    }
  }
  return true;
}
