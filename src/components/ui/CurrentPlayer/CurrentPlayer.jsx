import { Badge, BADGE_VARIANTS, BADGE_SIZES } from '../';
import './current-player.css';

function CurrentPlayer({ player }) {
  const getBadgeVariant = () => {
    return player === 'X' ? BADGE_VARIANTS.PRIMARY : BADGE_VARIANTS.SECONDARY;
  };

  return (
    <div className='current-player'>
      <span className='current-player__label'>Vez do jogador:</span>
      <Badge 
        content={player} 
        variant={getBadgeVariant()}
        size={BADGE_SIZES.MEDIUM}
        animated={true}
        pulse={true}
      />
    </div>
  );
}

export default CurrentPlayer;
