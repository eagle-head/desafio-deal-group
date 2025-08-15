import { Badge, BADGE_VARIANTS, BADGE_SIZES, Icon, ICON_SIZES } from '../';
import { Trophy } from 'lucide-react';
import './score-item.css';

/**
 * Individual score item component for displaying player statistics
 * 
 * Renders a single score entry with label, value, and optional leading indicator.
 * Automatically styles based on player type and shows trophy badge for leading scores.
 * 
 * @param {Object} props - The component props
 * @param {string} props.label - Display label for the score item
 * @param {number} props.value - Numeric score value to display
 * @param {string} [props.player] - Player identifier ('X' or 'O') for styling, optional for draws
 * @param {boolean} [props.isLeading=false] - Whether this score is currently leading
 * 
 * @returns {JSX.Element} A formatted score item with optional leading indicator
 * 
 * @example
 * // Player score with leading indicator
 * <ScoreItem
 *   label="Player X"
 *   value={5}
 *   player="X"
 *   isLeading={true}
 * />
 * 
 * @example
 * // Draw score without player styling
 * <ScoreItem
 *   label="Draws"
 *   value={2}
 *   isLeading={false}
 * />
 */
function ScoreItem({ label, value, player, isLeading }) {
  const getItemClasses = function () {
    const classes = ['score-item'];
    if (player) classes.push(`player-${player.toLowerCase()}`);
    return classes.join(' ');
  };

  const getBadgeVariant = () => {
    if (player === 'X') return BADGE_VARIANTS.PRIMARY;
    if (player === 'O') return BADGE_VARIANTS.SECONDARY;
    return BADGE_VARIANTS.WARNING;
  };

  return (
    <div className={getItemClasses()}>
      <div className='score-item__label'>{label}</div>
      <div className='score-item__value-container'>
        <div className='score-item__value'>{value}</div>
        {isLeading && value > 0 && (
          <Badge 
            content={<Icon icon={Trophy} size={ICON_SIZES.SMALL} />}
            variant={getBadgeVariant()}
            size={BADGE_SIZES.SMALL}
            animated={true}
          />
        )}
      </div>
    </div>
  );
}

export default ScoreItem;
