import './current-player.css';

function CurrentPlayer({ player }) {
  return (
    <div className='current-player'>
      <span className='current-player__label'>Vez do jogador:</span>
      <strong className='current-player__player'>{player}</strong>
    </div>
  );
}

export default CurrentPlayer;
