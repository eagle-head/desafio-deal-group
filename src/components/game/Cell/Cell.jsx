import { useState } from 'react';
import './cell.css';

function Cell({ value, index, onClick, isWinner, disabled, currentPlayer }) {
  const [hover, setHover] = useState(false);

  const getCellClasses = function () {
    const classes = ['cell'];

    if (value === 'X') classes.push('cell--x');
    else if (value === 'O') classes.push('cell--o');
    else classes.push('cell--empty');

    if (isWinner) classes.push('cell--winner');
    if (disabled) classes.push('cell--disabled');
    if (value) classes.push('cell--filled');
    if (hover) classes.push('cell--hover');

    return classes.join(' ');
  };

  const getPreviewClasses = function () {
    const classes = ['cell__preview'];
    if (currentPlayer === 'X') classes.push('cell__preview--x');
    else if (currentPlayer === 'O') classes.push('cell__preview--o');
    return classes.join(' ');
  };

  return (
    <div
      className={getCellClasses()}
      onClick={function () {
        !disabled && !value && onClick(index);
      }}
      onMouseEnter={function () {
        setHover(true);
      }}
      onMouseLeave={function () {
        setHover(false);
      }}
    >
      {value ? (
        value
      ) : hover && !disabled && currentPlayer ? (
        <span className={getPreviewClasses()}>{currentPlayer}</span>
      ) : null}
    </div>
  );
}

export default Cell;
