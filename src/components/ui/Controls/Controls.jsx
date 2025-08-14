import './controls.css';

function Controls({ onNewGame, onResetScores }) {
  return (
    <div className='controls'>
      <button className='controls__button controls__button--primary' onClick={onNewGame}>
        Nova Partida
      </button>
      <button className='controls__button controls__button--secondary' onClick={onResetScores}>
        Resetar Placar
      </button>
    </div>
  );
}

export default Controls;
