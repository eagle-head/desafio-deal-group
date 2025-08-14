import React, { useState } from 'react';

const Controls = ({ onNewGame, onResetScores }) => {
  const [primaryHover, setPrimaryHover] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);

  const styles = {
    container: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem',
      animation: 'fadeIn 0.6s ease-out 0.4s both',
    },
    button: {
      flex: 1,
      padding: '0.875rem 1.5rem',
      border: 'none',
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'var(--transition)',
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
    },
    primary: {
      background:
        'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
      color: 'white',
      boxShadow: primaryHover 
        ? '0 6px 20px rgba(37, 99, 235, 0.3)' 
        : '0 4px 12px rgba(37, 99, 235, 0.2)',
      transform: primaryHover ? 'translateY(-2px)' : 'translateY(0)',
    },
    secondary: {
      background: secondaryHover ? 'var(--background)' : 'var(--surface)',
      color: secondaryHover ? 'var(--primary-color)' : 'var(--text-primary)',
      border: `2px solid ${secondaryHover ? 'var(--primary-color)' : 'var(--border-color)'}`,
    },
  };

  return (
    <div style={styles.container} className="controls">
      <button
        style={{ ...styles.button, ...styles.primary }}
        onClick={onNewGame}
        onMouseEnter={() => setPrimaryHover(true)}
        onMouseLeave={() => setPrimaryHover(false)}
      >
        Nova Partida
      </button>
      <button
        style={{ ...styles.button, ...styles.secondary }}
        onClick={onResetScores}
        onMouseEnter={() => setSecondaryHover(true)}
        onMouseLeave={() => setSecondaryHover(false)}
      >
        Resetar Placar
      </button>
    </div>
  );
};

export default Controls;