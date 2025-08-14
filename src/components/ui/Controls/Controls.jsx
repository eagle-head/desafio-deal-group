import { Button, BUTTON_VARIANTS } from '../';
import './controls.css';

function Controls({ onNewGame, onResetScores }) {
  return (
    <div className='controls'>
      <Button variant={BUTTON_VARIANTS.PRIMARY} onClick={onNewGame}>
        Nova Partida
      </Button>
      <Button variant={BUTTON_VARIANTS.SECONDARY} onClick={onResetScores}>
        Resetar Placar
      </Button>
    </div>
  );
}

export default Controls;
