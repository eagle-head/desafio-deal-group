import React from 'react';
import Cell from './Cell';

const GameBoard = ({ board, onCellClick, winningCells, disabled, currentPlayer }) => {
  const styles = {
    container: {
      background: 'var(--surface)',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: 'var(--shadow-md)',
      animation: 'fadeIn 0.6s ease-out 0.3s both',
    },
    boardWrapper: {
      width: '100%',
      maxWidth: '320px',
      margin: '0 auto',
    },
    board: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      gap: '0.75rem',
      width: '100%',
      aspectRatio: '1',
    },
  };

  return (
    <div style={styles.container} className="game-container">
      <div style={styles.boardWrapper} className="game-board-container">
        <div style={styles.board} className="game-board">
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