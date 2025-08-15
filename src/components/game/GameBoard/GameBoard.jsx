import Cell from '../Cell/Cell';
import './game-board.css';

/**
 * @typedef {('X'|'O')} Player
 * Represents a player in the tic-tac-toe game
 */

/**
 * @typedef {(Player|null)} CellValue
 * Represents the value of a cell - either a player marker or null for empty
 */

/**
 * GameBoard component renders the 3x3 tic-tac-toe game board.
 *
 * Manages the layout and interaction of all game cells, handling cell clicks
 * and displaying the current game state including winner highlighting.
 *
 * @component
 * @param {Object} props - The component props
 * @param {CellValue[]} props.board - Array of 9 cell values representing the game state
 * @param {function(number): void} props.onCellClick - Callback function triggered when a cell is clicked
 * @param {number[]} [props.winningCells=[]] - Array of indices representing winning cells to highlight
 * @param {boolean} [props.disabled=false] - Whether the entire board is disabled
 * @param {Player} [props.currentPlayer] - The current player whose turn it is
 * @param {string|number} [props.gameId='default'] - Unique identifier for the current game session
 *
 * @returns {JSX.Element} A div container with the 3x3 game board
 *
 * @example
 * <GameBoard
 *   board={['X', null, 'O', null, 'X', null, 'O', null, 'X']}
 *   onCellClick={handleCellClick}
 *   winningCells={[0, 4, 8]}
 *   disabled={false}
 *   currentPlayer="X"
 *   gameId={1}
 * />
 */
function GameBoard({ board, onCellClick, winningCells = [], disabled = false, currentPlayer, gameId = 'default' }) {
  function renderCells() {
    return board.map((value, index) => (
      <Cell
        key={`cell-${gameId}-${index}`}
        value={value}
        index={index}
        onClick={onCellClick}
        isWinner={winningCells.includes(index)}
        disabled={disabled}
        currentPlayer={currentPlayer}
      />
    ));
  }

  return (
    <div className='game-board' role='grid' aria-label='Tic-tac-toe game board' aria-disabled={disabled}>
      {renderCells()}
    </div>
  );
}

GameBoard.displayName = 'GameBoard';

export default GameBoard;
