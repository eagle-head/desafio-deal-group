import { ProgressBar, PROGRESS_BAR_VARIANTS } from '../';
import './timer.css';

function Timer({ timeLeft, percentage }) {
  const getProgressVariant = function () {
    if (timeLeft <= 2) return PROGRESS_BAR_VARIANTS.ERROR;
    if (timeLeft <= 3) return PROGRESS_BAR_VARIANTS.WARNING;
    return PROGRESS_BAR_VARIANTS.PRIMARY;
  };

  return (
    <div className='timer-container'>
      <div className='timer-header'>
        <span className='timer-label'>Tempo da Jogada</span>
        <span className='timer-value'>{timeLeft}s</span>
      </div>
      <ProgressBar 
        value={percentage}
        variant={getProgressVariant()}
        animated={true}
        showLabel={false}
      />
    </div>
  );
}

export default Timer;
