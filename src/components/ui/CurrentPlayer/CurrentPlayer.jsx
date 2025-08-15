import { 
  PlayerIndicator, 
  PLAYER_INDICATOR_VARIANTS, 
  PLAYER_INDICATOR_SIZES,
  PLAYER_INDICATOR_STATES 
} from '../';
import './current-player.css';

/**
 * Current player indicator component that displays whose turn it is
 * 
 * Shows the active player with an animated indicator using PlayerIndicator
 * component. Provides visual feedback about the current turn with appropriate
 * styling and animations to draw attention to the active player.
 * 
 * @param {Object} props - The component props
 * @param {string} props.player - Current player identifier ('X' or 'O')
 * 
 * @returns {JSX.Element} Current player display with animated indicator
 *
 * @example
 * // Basic usage for player X
 * <CurrentPlayer player="X" />
 *
 * @example
 * // Display current player O
 * <CurrentPlayer player="O" />
 */
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
