import { Badge, BADGE_VARIANTS, BADGE_SIZES, Icon, ICON_SIZES } from '../';
import { Trophy, Handshake } from 'lucide-react';
import './status-message.css';

function StatusMessage({ gameStatus, winner }) {
  if (gameStatus === 'playing') return null;

  const getMessageClasses = function () {
    const classes = ['status-message'];
    if (gameStatus === 'draw') classes.push('draw');
    return classes.join(' ');
  };

  const getBadgeVariant = () => {
    if (gameStatus === 'draw') return BADGE_VARIANTS.WARNING;
    return winner === 'X' ? BADGE_VARIANTS.PRIMARY : BADGE_VARIANTS.SECONDARY;
  };

  const getBadgeContent = () => {
    if (gameStatus === 'draw') return <Icon icon={Handshake} size={ICON_SIZES.SMALL} />;
    return <Icon icon={Trophy} size={ICON_SIZES.SMALL} />;
  };

  return (
    <div className={getMessageClasses()}>
      <Badge 
        content={getBadgeContent()} 
        variant={getBadgeVariant()}
        size={BADGE_SIZES.MEDIUM}
        animated={true}
      />
      <span className="status-text">
        {gameStatus === 'draw' ? 'Empate!' : `Jogador ${winner} venceu!`}
      </span>
    </div>
  );
}

export default StatusMessage;
