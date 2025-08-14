import './status-message.css';

function StatusMessage({ gameStatus, winner }) {
  if (gameStatus === 'playing') return null;

  const getMessageClasses = function () {
    const classes = ['status-message'];
    if (gameStatus === 'draw') classes.push('draw');
    return classes.join(' ');
  };

  return <div className={getMessageClasses()}>{gameStatus === 'draw' ? 'Empate!' : `Jogador ${winner} venceu!`}</div>;
}

export default StatusMessage;
