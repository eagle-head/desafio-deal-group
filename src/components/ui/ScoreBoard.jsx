import React from 'react';
import ScoreItem from './ScoreItem';

const ScoreBoard = ({ scores }) => {
  const styles = {
    container: {
      background: 'var(--surface)',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: 'var(--shadow-sm)',
      animation: 'fadeIn 0.6s ease-out 0.1s both',
    },
    title: {
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: 'var(--text-secondary)',
      marginBottom: '1rem',
      fontWeight: '600',
    },
    scores: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
    },
  };

  return (
    <div style={styles.container} className="score-board">
      <div style={styles.title} className="score-board-title">Placar Acumulado</div>
      <div style={styles.scores} className="scores">
        <ScoreItem label='Jogador X' value={scores.X} player='X' />
        <ScoreItem label='Empates' value={scores.draws} />
        <ScoreItem label='Jogador O' value={scores.O} player='O' />
      </div>
    </div>
  );
};

export default ScoreBoard;