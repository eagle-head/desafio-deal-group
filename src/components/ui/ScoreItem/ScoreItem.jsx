import { Badge, BADGE_VARIANTS, BADGE_SIZES, Icon, ICON_SIZES } from '../';
import { Trophy } from 'lucide-react';
import './score-item.css';

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
