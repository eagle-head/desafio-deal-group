import ScoreItem from '../ScoreItem/ScoreItem';
import './score-board.css';

function ScoreBoard({ scores }) {
  return (
    <div className='score-board'>
      <div className='score-board-title'>Placar Acumulado</div>
      <div className='scores'>
        <ScoreItem label='Jogador X' value={scores.X} player='X' />
        <ScoreItem label='Empates' value={scores.draws} />
        <ScoreItem label='Jogador O' value={scores.O} player='O' />
      </div>
    </div>
  );
}

export default ScoreBoard;
