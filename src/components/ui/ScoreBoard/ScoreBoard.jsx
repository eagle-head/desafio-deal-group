import ScoreItem from '../ScoreItem/ScoreItem';
import { ProgressBar, PROGRESS_BAR_VARIANTS, PROGRESS_BAR_SIZES } from '../';
import './score-board.css';

function ScoreBoard({ scores }) {
  const totalGames = scores.X + scores.O + scores.draws;
  const winRateX = totalGames > 0 ? (scores.X / totalGames) * 100 : 0;
  const winRateO = totalGames > 0 ? (scores.O / totalGames) * 100 : 0;
  const drawRate = totalGames > 0 ? (scores.draws / totalGames) * 100 : 0;

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
      {totalGames > 0 && (
        <div className='win-rates'>
          <div className='win-rate-title'>Taxa de Vitória</div>
          <div className='win-rate-item'>
            <span className='win-rate-label'>X:</span>
            <ProgressBar 
              value={winRateX} 
              variant={PROGRESS_BAR_VARIANTS.PRIMARY}
              size={PROGRESS_BAR_SIZES.SMALL}
              showLabel={true}
              label={`${winRateX.toFixed(0)}%`}
            />
          </div>
          <div className='win-rate-item'>
            <span className='win-rate-label'>O:</span>
            <ProgressBar 
              value={winRateO} 
              variant={PROGRESS_BAR_VARIANTS.SECONDARY}
              size={PROGRESS_BAR_SIZES.SMALL}
              showLabel={true}
              label={`${winRateO.toFixed(0)}%`}
            />
          </div>
          <div className='win-rate-item'>
            <span className='win-rate-label'>Empates:</span>
            <ProgressBar 
              value={drawRate} 
              variant={PROGRESS_BAR_VARIANTS.WARNING}
              size={PROGRESS_BAR_SIZES.SMALL}
              showLabel={true}
              label={`${drawRate.toFixed(0)}%`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ScoreBoard;
