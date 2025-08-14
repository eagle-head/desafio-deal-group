import React, { useState } from 'react';

const Cell = ({ value, index, onClick, isWinner, disabled, currentPlayer }) => {
  const [hover, setHover] = useState(false);

  const getBackgroundColor = () => {
    if (isWinner) {
      return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2))';
    }
    if (value === 'X') {
      return 'rgba(37, 99, 235, 0.05)';
    }
    if (value === 'O') {
      return 'rgba(96, 165, 250, 0.05)';
    }
    if (hover && !disabled) {
      return 'var(--surface)';
    }
    return 'var(--background)';
  };

  const getBorderColor = () => {
    if (isWinner) {
      return 'var(--success)';
    }
    if (value === 'X') {
      return 'var(--primary-color)';
    }
    if (value === 'O') {
      return 'var(--accent-color)';
    }
    if (hover && !disabled) {
      return 'var(--primary-color)';
    }
    return 'var(--border-color)';
  };

  const styles = {
    cell: {
      background: getBackgroundColor(),
      border: `2px solid ${getBorderColor()}`,
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2.5rem',
      fontWeight: '700',
      cursor: disabled || value ? 'default' : 'pointer',
      transition: 'var(--transition)',
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '1',
      width: '100%',
      height: '100%',
      color:
        value === 'X'
          ? 'var(--primary-color)'
          : value === 'O'
            ? 'var(--accent-color)'
            : 'var(--text-primary)',
      transform: hover && !value && !disabled ? 'scale(1.05)' : 'scale(1)',
      boxShadow: hover && !value && !disabled ? 'var(--shadow-md)' : 'none',
      animation: value
        ? 'popIn 0.3s ease-out'
        : isWinner
          ? 'winnerPulse 0.6s ease-out'
          : 'none',
    },
    preview: {
      opacity: 0.7,
      color: currentPlayer === 'X' ? 'var(--primary-color)' : 'var(--accent-color)',
    },
  };

  const cellClass = `cell ${value ? `cell-${value.toLowerCase()}` : ''} ${isWinner ? 'winner' : ''}`;

  return (
    <div
      style={styles.cell}
      className={cellClass}
      onClick={() => !disabled && !value && onClick(index)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {value ? (
        value
      ) : hover && !disabled && currentPlayer ? (
        <span style={styles.preview}>{currentPlayer}</span>
      ) : null}
    </div>
  );
};

export default Cell;