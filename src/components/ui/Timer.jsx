import React from 'react';

const Timer = ({ timeLeft, percentage }) => {
  const getProgressClass = () => {
    if (timeLeft <= 2) return 'danger';
    if (timeLeft <= 3) return 'warning';
    return '';
  };

  const styles = {
    container: {
      background: 'var(--surface)',
      borderRadius: '1rem',
      padding: '1rem',
      marginBottom: '1.5rem',
      boxShadow: 'var(--shadow-sm)',
      animation: 'fadeIn 0.6s ease-out 0.2s both',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.75rem',
    },
    label: {
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      fontWeight: '500',
    },
    value: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: 'var(--primary-color)',
      fontVariantNumeric: 'tabular-nums',
    },
    bar: {
      width: '100%',
      height: '8px',
      background: 'var(--border-color)',
      borderRadius: '4px',
      overflow: 'hidden',
      position: 'relative',
    },
    progress: {
      height: '100%',
      background:
        getProgressClass() === 'danger'
          ? 'linear-gradient(90deg, var(--danger), #f87171)'
          : getProgressClass() === 'warning'
            ? 'linear-gradient(90deg, var(--warning), #fbbf24)'
            : 'linear-gradient(90deg, var(--primary-color), var(--accent-color))',
      borderRadius: '4px',
      transition: 'width 0.1s linear',
      boxShadow: '0 0 10px rgba(37, 99, 235, 0.3)',
      width: `${percentage}%`,
      animation:
        getProgressClass() === 'danger' ? 'pulse 0.5s infinite' : 'none',
    },
  };

  return (
    <div style={styles.container} className="timer-container">
      <div style={styles.header} className="timer-header">
        <span style={styles.label} className="timer-label">Tempo da Jogada</span>
        <span style={styles.value} className="timer-value">{timeLeft}s</span>
      </div>
      <div style={styles.bar} className="timer-bar">
        <div style={styles.progress} className={`timer-progress ${getProgressClass()}`}></div>
      </div>
    </div>
  );
};

export default Timer;