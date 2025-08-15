import { Badge, BADGE_VARIANTS, BADGE_SIZES, Icon, ICON_SIZES } from '../';
import { Trophy, Handshake } from 'lucide-react';
import './status-message.css';

/**
 * Game status message component for displaying game outcomes
 *
 * Shows the current game result when a game ends, either with a winner or draw.
 * Displays appropriate icons (trophy for winner, handshake for draw) and styled
 * messages. Component automatically hides during active gameplay.
 *
 * @param {Object} props - The component props
 * @param {string} props.gameStatus - Current game status ('playing', 'won', 'draw')
 * @param {string|null} [props.winner] - Winning player ('X' or 'O'), null for draws or active games
 *
 * @returns {JSX.Element|null} Status message display or null if game is active
 *
 * @example
 * // Winner announcement
 * <StatusMessage
 *   gameStatus="won"
 *   winner="X"
 * />
 *
 * @example
 * // Draw announcement
 * <StatusMessage
 *   gameStatus="draw"
 *   winner={null}
 * />
 *
 * @example
 * // During active game (renders nothing)
 * <StatusMessage
 *   gameStatus="playing"
 *   winner={null}
 * />
 */
function StatusMessage({ gameStatus, winner }) {
  if (gameStatus === 'playing') return null;

  function getMessageClasses() {
    const classes = ['status-message'];
    if (gameStatus === 'draw') classes.push('draw');
    return classes.join(' ');
  }

  function getBadgeVariant() {
    if (gameStatus === 'draw') return BADGE_VARIANTS.WARNING;
    return winner === 'X' ? BADGE_VARIANTS.PRIMARY : BADGE_VARIANTS.SECONDARY;
  }

  function getBadgeContent() {
    if (gameStatus === 'draw') return <Icon icon={Handshake} size={ICON_SIZES.SMALL} />;
    return <Icon icon={Trophy} size={ICON_SIZES.SMALL} />;
  }

  function status() {
    return gameStatus === 'draw' ? "It's a draw!" : `Player ${winner} wins!`;
  }

  return (
    <div className={getMessageClasses()}>
      <Badge content={getBadgeContent()} variant={getBadgeVariant()} size={BADGE_SIZES.MEDIUM} animated={true} />
      <span className='status-text'>{status()}</span>
    </div>
  );
}

export default StatusMessage;
