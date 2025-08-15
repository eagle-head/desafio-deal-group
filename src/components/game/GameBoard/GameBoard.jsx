import Cell from '../Cell/Cell';
import './game-board.css';

function GameBoard({ board, onCellClick, winningCells, disabled, currentPlayer, gameId }) {
  return (
    <div className='game-container'>
      <div className='game-board-container'>
        <div className='game-board'>
          {board.map((value, index) => {
            return (
              <Cell
                key={`${gameId}-${index}`}
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
