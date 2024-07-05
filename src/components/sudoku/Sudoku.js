import React, { useState, useEffect, useRef } from "react";
import "./Sudoku.css";
import {
  checkBranch,
  checkSudoku,
  findNextCell,
} from "../../utils/sudokuResolver";

const emptySudoku = [
  [8, 0, 0, 5, 4, 0, 0, 0, 0],
  [0, 4, 0, 9, 0, 0, 5, 0, 6],
  [0, 0, 0, 0, 0, 0, 0, 0, 2],
  [0, 8, 0, 6, 0, 0, 9, 0, 4],
  [0, 0, 1, 0, 0, 7, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 0],
  [0, 5, 0, 0, 0, 0, 0, 2, 0],
  [0, 0, 0, 3, 0, 0, 0, 8, 0],
  [7, 0, 0, 0, 0, 6, 3, 0, 5],
];
let cellsData = {};
let history = [];

const Sudoku = () => {
  const [sudoku, setSudoku] = useState(emptySudoku);
  const [isSolving, setIsSolving] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isSolving) {
      intervalRef.current = setInterval(() => resolveSudoku(), 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isSolving]);

  const resolveSudoku = () => {
    let isComplete = false;

    if (!isComplete && isSolving) {
      let { row, col, emptyCells } = findNextCell(sudoku, cellsData);
      if (emptyCells === 0) {
        setIsSolving(false);
        return;
      }
      history.push([row, col]);
      const checkedCell = checkBranch(row, col, sudoku, history, cellsData);
      if (!checkedCell) {
        setIsSolving(false);
        return;
      }
      row = checkedCell.newRow;
      col = checkedCell.newCol;
      const cell = `${row}${col}`;
      sudoku[row][col] =
        cellsData[cell].validValues[cellsData[cell].currentIndex];
      setSudoku([...sudoku]); // Update the state

      cellsData[cell].currentIndex += 1;
      isComplete = checkSudoku(sudoku);
    }

    if (isComplete) {
      console.log(`Sudoku risolto.`);
      console.log(cellsData);
      setIsSolving(false);
    }
  };

  const handleOnClickReset = () => {
    const empty = sudoku.map((row) => row.map(() => 0));
    setSudoku(empty);
  };

  const handleOnChange = (e, rowIndex, colIndex) => {
    if (e.target.value !== "" && e.target.value < 1) {
      e.target.value = "";
    } else if (e.target.value > 9) {
      e.target.value = e.target.value.charAt(0);
    }

    const newSudoku = sudoku.map((row, rIndex) =>
      row.map((cell, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex
          ? e.target.value === ""
            ? 0
            : parseInt(e.target.value)
          : cell
      )
    );

    setSudoku(newSudoku);
  };

  return (
    <>
      <div>
        <button onClick={() => setIsSolving(!isSolving)}>
          {isSolving ? "Pause" : "Resolve"}
        </button>
        {/* <button onClick={() => setIsSolving(false)}>
          {isSolving ? "Pause" : "Play"}
        </button> */}
        <button onClick={handleOnClickReset}>Reset</button>
      </div>
      <div className="table-container">
        <table>
          <colgroup className="col-zero" span="1"></colgroup>
          <colgroup className="col-uno" span="1"></colgroup>
          <colgroup className="col-due" span="1"></colgroup>
          <colgroup className="col-tre" span="1"></colgroup>
          <colgroup className="col-quattro" span="1"></colgroup>
          <colgroup className="col-cinque" span="1"></colgroup>
          <colgroup className="col-sei" span="1"></colgroup>
          <colgroup className="col-sette" span="1"></colgroup>
          <colgroup span="3"></colgroup>
          <colgroup span="3"></colgroup>
          <tbody>
            {sudoku.map((row, rowIndex) => (
              <tr
                className={
                  rowIndex % 3 === 0 && rowIndex !== 0
                    ? "large-row"
                    : rowIndex === 0
                    ? ""
                    : "normal-row"
                }
                key={"row" + rowIndex}
              >
                {row.map((col, colIndex) => (
                  <td key={"col" + rowIndex + colIndex}>
                    <input
                      onChange={(e) => handleOnChange(e, rowIndex, colIndex)}
                      value={col === 0 ? "" : col}
                      type="number"
                      maxLength={1}
                    ></input>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Sudoku;
