import React, { useState } from 'react';
import './Cell.css';

const Cell = ({ value, index, onClick, isWinner, disabled, currentPlayer }) => {
  const [hover, setHover] = useState(false);

  const getCellClasses = () => {
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

  const getPreviewClasses = () => {
    const classes = ['cell__preview'];
    if (currentPlayer === 'X') classes.push('cell__preview--x');
    else if (currentPlayer === 'O') classes.push('cell__preview--o');
    return classes.join(' ');
  };

  return (
    <div
      className={getCellClasses()}
      onClick={() => !disabled && !value && onClick(index)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {value ? (
        value
      ) : hover && !disabled && currentPlayer ? (
        <span className={getPreviewClasses()}>{currentPlayer}</span>
      ) : null}
    </div>
  );
};

export default Cell;
