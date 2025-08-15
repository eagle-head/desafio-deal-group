import ScoreItem from '../ScoreItem/ScoreItem';
import './score-board.css';

/**
 * Score board component displaying accumulated game scores
 * 
 * Shows the current scores for both players (X and O) and draws in a
 * formatted display. Automatically determines and highlights the leading
 * player or category with visual indicators.
 * 
 * @param {Object} props - The component props
 * @param {Object} props.scores - Score object containing game statistics
 * @param {number} props.scores.X - Number of wins for player X
 * @param {number} props.scores.O - Number of wins for player O
 * @param {number} props.scores.draws - Number of draw games
 * 
 * @returns {JSX.Element} A formatted score board display
 * 
 * @example
 * <ScoreBoard
 *   scores={{ X: 3, O: 1, draws: 2 }}
 * />
 */
function ScoreBoard({ scores }) {
  const isXLeading = scores.X > scores.O && scores.X > scores.draws;
  const isOLeading = scores.O > scores.X && scores.O > scores.draws;
  const isDrawsLeading = scores.draws > scores.X && scores.draws > scores.O;

  return (
    <div className='score-board'>
      <div className='score-board-title'>Accumulated Score</div>
      <div className='scores'>
        <ScoreItem label='Player X' value={scores.X} player='X' isLeading={isXLeading} />
        <ScoreItem label='Draws' value={scores.draws} isLeading={isDrawsLeading} />
        <ScoreItem label='Player O' value={scores.O} player='O' isLeading={isOLeading} />
      </div>
    </div>
  );
}

export default ScoreBoard;
