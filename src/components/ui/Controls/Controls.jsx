import { Button, BUTTON_VARIANTS } from '../';
import './controls.css';

/**
 * Game controls component providing action buttons for game management
 *
 * Renders control buttons that allow users to start a new game and reset
 * the accumulated scores. Uses styled buttons with consistent design patterns.
 *
 * @param {Object} props - The component props
 * @param {function(): void} props.onNewGame - Callback function to start a new game
 * @param {function(): void} props.onResetScores - Callback function to reset all scores to zero
 *
 * @returns {JSX.Element} A container with game control buttons
 *
 * @example
 * <Controls
 *   onNewGame={() => game.resetGame()}
 *   onResetScores={() => game.resetScores()}
 * />
 */
function Controls({ onNewGame, onResetScores }) {
  return (
    <div className='controls'>
      <Button variant={BUTTON_VARIANTS.PRIMARY} onClick={onNewGame}>
        New Game
      </Button>
      <Button variant={BUTTON_VARIANTS.SECONDARY} onClick={onResetScores}>
        Reset Scores
      </Button>
    </div>
  );
}

export default Controls;
