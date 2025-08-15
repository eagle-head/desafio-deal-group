import { 
  PlayerIndicator, 
  PLAYER_INDICATOR_VARIANTS, 
  PLAYER_INDICATOR_SIZES,
  PLAYER_INDICATOR_STATES 
} from '../';
import './current-player.css';

function CurrentPlayer({ player }) {
  const getPlayerVariant = () => {
    return player === 'X' ? PLAYER_INDICATOR_VARIANTS.PLAYER_X : PLAYER_INDICATOR_VARIANTS.PLAYER_O;
  };

  return (
    <div className='current-player'>
      <span className='current-player__label'>Vez do jogador:</span>
      <PlayerIndicator 
        player={player} 
        variant={getPlayerVariant()}
        size={PLAYER_INDICATOR_SIZES.MEDIUM}
        state={PLAYER_INDICATOR_STATES.ACTIVE}
        animated={true}
        pulse={true}
      />
    </div>
  );
}

export default CurrentPlayer;
