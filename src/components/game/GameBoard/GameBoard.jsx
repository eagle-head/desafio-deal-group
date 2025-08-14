import Cell from '../Cell/Cell';
import './game-board.css';

function GameBoard({ board, onCellClick, winningCells, disabled, currentPlayer }) {
  return (
    <div className='game-container'>
      <div className='game-board-container'>
        <div className='game-board'>
          {board.map(function (value, index) {
            return (
              <Cell
                key={index}
                value={value}
                index={index}
                onClick={onCellClick}
                isWinner={winningCells.includes(index)}
                disabled={disabled}
                currentPlayer={currentPlayer}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GameBoard;
