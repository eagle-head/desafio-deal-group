import { useState, useEffect } from 'react';
import './cell.css';

/**
 * @typedef {('X'|'O')} Player
 * Represents a player in the tic-tac-toe game
 */

/**
 * @typedef {(Player|null)} CellValue
 * Represents the value of a cell - either a player marker or null for empty
 */

/**
 * Interactive cell component for the tic-tac-toe game board.
 *
 * Renders an individual game cell that can be clicked to make a move.
 * Provides visual feedback through hover effects, winner highlighting,
 * and preview of the current player's move before clicking.
 *
 * @component
 * @param {Object} props - The component props
 * @param {CellValue} props.value - The current value of the cell ('X', 'O', or null for empty)
 * @param {number} props.index - The index position of this cell in the game board (0-8)
 * @param {function(number): void} props.onClick - Callback function triggered when cell is clicked, receives the cell index
 * @param {boolean} [props.isWinner=false] - Whether this cell is part of a winning combination
 * @param {boolean} [props.disabled=false] - Whether the cell is disabled and cannot be clicked
 * @param {Player} [props.currentPlayer] - The current player whose turn it is, used for hover preview
 *
 * @returns {JSX.Element} A clickable div element representing the game cell
 *
 * @example
 * // Empty cell that can be clicked
 * <Cell
 *   value={null}
 *   index={0}
 *   onClick={(index) => makeMove(index)}
 *   currentPlayer="X"
 * />
 *
 * @example
 * // Filled cell with 'X'
 * <Cell
 *   value="X"
 *   index={4}
 *   onClick={handleCellClick}
 *   disabled={true}
 * />
 *
 * @example
 * // Winner cell with highlighting
 * <Cell
 *   value="O"
 *   index={8}
 *   onClick={handleCellClick}
 *   isWinner={true}
 *   disabled={true}
 * />
 */
function Cell({ value, index, onClick, isWinner, disabled, currentPlayer }) {
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (value === null) setHover(false);
  }, [value]);

  function getCellClasses() {
    const classes = new Set(['cell']);

    if (value === 'X') classes.add('cell--x');
    else if (value === 'O') classes.add('cell--o');
    else classes.add('cell--empty');

    if (isWinner) classes.add('cell--winner');
    if (disabled) classes.add('cell--disabled');
    if (value) classes.add('cell--filled');
    if (hover && !value && !disabled) classes.add('cell--hover');

    return Array.from(classes).join(' ');
  }

  function getPreviewClasses() {
    const classes = ['cell__preview'];
    if (currentPlayer === 'X') classes.push('cell__preview--x');
    else if (currentPlayer === 'O') classes.push('cell__preview--o');
    return classes.join(' ');
  }

  function handleClick() {
    if (!disabled && !value) {
      onClick(index);
    }
  }

  function handleMouseEnter() {
    if (!value && !disabled) {
      setHover(true);
    }
  }

  function handleMouseLeave() {
    setHover(false);
  }

  function renderCellContent() {
    if (value) {
      return value;
    }

    if (hover && !disabled && currentPlayer) {
      return <span className={getPreviewClasses()}>{currentPlayer}</span>;
    }

    return null;
  }

  return (
    <div
      className={getCellClasses()}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderCellContent()}
    </div>
  );
}

Cell.displayName = 'Cell';

export default Cell;
