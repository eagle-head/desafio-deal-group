import React from 'react';
import './timer.css';

const Timer = ({ timeLeft, percentage }) => {
  const getProgressClass = () => {
    if (timeLeft <= 2) return 'danger';
    if (timeLeft <= 3) return 'warning';
    return '';
  };

  return (
    <div className='timer-container'>
      <div className='timer-header'>
        <span className='timer-label'>Tempo da Jogada</span>
        <span className='timer-value'>{timeLeft}s</span>
      </div>
      <div className='timer-bar'>
        <div
          className={`timer-progress ${getProgressClass()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
