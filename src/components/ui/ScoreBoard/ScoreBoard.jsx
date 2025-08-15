import ScoreItem from '../ScoreItem/ScoreItem';
import './score-board.css';

function ScoreBoard({ scores }) {
  const isXLeading = scores.X > scores.O && scores.X > scores.draws;
  const isOLeading = scores.O > scores.X && scores.O > scores.draws;
  const isDrawsLeading = scores.draws > scores.X && scores.draws > scores.O;

  return (
    <div className='score-board'>
      <div className='score-board-title'>Placar Acumulado</div>
      <div className='scores'>
        <ScoreItem label='Jogador X' value={scores.X} player='X' isLeading={isXLeading} />
        <ScoreItem label='Empates' value={scores.draws} isLeading={isDrawsLeading} />
        <ScoreItem label='Jogador O' value={scores.O} player='O' isLeading={isOLeading} />
      </div>
    </div>
  );
}

export default ScoreBoard;
