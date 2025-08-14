import React from 'react';
import Cell from './Cell';
import './GameBoard.css';

const GameBoard = ({
  board,
  onCellClick,
  winningCells,
  disabled,
  currentPlayer,
}) => {
  return (
    <div className='game-container'>
      <div className='game-board-container'>
        <div className='game-board'>
          {board.map((value, index) => (
            <Cell
              key={index}
              value={value}
              index={index}
              onClick={onCellClick}
              isWinner={winningCells.includes(index)}
              disabled={disabled}
              currentPlayer={currentPlayer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
