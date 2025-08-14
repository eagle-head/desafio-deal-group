import './score-item.css';

function ScoreItem({ label, value, player }) {
  const getItemClasses = function () {
    const classes = ['score-item'];
    if (player) classes.push(`player-${player.toLowerCase()}`);
    return classes.join(' ');
  };

  return (
    <div className={getItemClasses()}>
      <div className='score-item__label'>{label}</div>
      <div className='score-item__value'>{value}</div>
    </div>
  );
}

export default ScoreItem;
