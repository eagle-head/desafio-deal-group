import React from 'react';

const StatusMessage = ({ gameStatus, winner }) => {
  if (gameStatus === 'playing') return null;

  const styles = {
    message: {
      background:
        gameStatus === 'draw'
          ? 'linear-gradient(135deg, var(--warning), #fbbf24)'
          : 'linear-gradient(135deg, var(--success), #34d399)',
      color: 'white',
      padding: '1rem',
      borderRadius: '0.75rem',
      textAlign: 'center',
      marginBottom: '1.5rem',
      fontWeight: '600',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
      animation: 'slideDown 0.5s ease-out',
    },
  };

  return (
    <div style={styles.message} className={`status-message ${gameStatus === 'draw' ? 'draw' : ''}`}>
      {gameStatus === 'draw' ? 'Empate!' : `Jogador ${winner} venceu!`}
    </div>
  );
};

export default StatusMessage;