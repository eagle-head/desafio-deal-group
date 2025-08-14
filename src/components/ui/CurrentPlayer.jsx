import React from 'react';

const CurrentPlayer = ({ player }) => {
  const styles = {
    container: {
      textAlign: 'center',
      marginBottom: '1.5rem',
      padding: '0.75rem',
      background: 'var(--background)',
      borderRadius: '0.75rem',
    },
    label: {
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
    },
    player: {
      fontSize: '1.125rem',
      color: 'var(--primary-color)',
      marginLeft: '0.5rem',
      fontWeight: '700',
    },
  };

  return (
    <div style={styles.container} className="current-player">
      <span style={styles.label}>Vez do jogador:</span>
      <strong style={styles.player}>{player}</strong>
    </div>
  );
};

export default CurrentPlayer;