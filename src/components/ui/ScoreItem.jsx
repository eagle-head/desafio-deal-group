import React, { useState } from 'react';

const ScoreItem = ({ label, value, player }) => {
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    item: {
      textAlign: 'center',
      padding: '0.75rem',
      background: 'var(--background)',
      borderRadius: '0.75rem',
      transition: 'var(--transition)',
      cursor: 'default',
      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: isHovered ? 'var(--shadow-sm)' : 'none',
    },
    label: {
      fontSize: '0.75rem',
      color: 'var(--text-secondary)',
      marginBottom: '0.25rem',
    },
    value: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color:
        player === 'X'
          ? 'var(--primary-color)'
          : player === 'O'
            ? 'var(--accent-color)'
            : 'var(--text-primary)',
    },
  };

  return (
    <div 
      style={styles.item}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`score-item ${player ? `player-${player.toLowerCase()}` : ''}`}
    >
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
};

export default ScoreItem;