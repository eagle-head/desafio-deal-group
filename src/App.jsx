import { useEffect, useCallback } from 'react';

// Hooks
import { useGame, useTimer, useTheme } from './hooks';

// Components
import {
  Header,
  ScoreBoard,
  Timer,
  CurrentPlayer,
  Controls,
  ColorCustomizer,
  StatusMessage,
  GameBoard,
} from './components';

// Utils
import { DEFAULT_TIMER_DURATION, getNextPlayer } from './utils';

/**
 * Main application component for the Tic-Tac-Toe game
 * 
 * Orchestrates the entire game experience by managing game state, timer functionality,
 * theme customization, and coordinating between all child components. Handles game
 * logic, player moves, timeouts, and provides the complete user interface.
 * 
 * @returns {JSX.Element} The complete tic-tac-toe game interface
 * 
 * @example
 * // Render the main application
 * <App />
 */
function App() {
  const game = useGame();
  const { theme, updateTheme } = useTheme();

  const handleTimeout = useCallback(
    function () {
      if (game.gameStatus === 'playing') {
        game.setCurrentPlayer(getNextPlayer(game.currentPlayer));
      }
    },
    [game]
  );

  const timer = useTimer(DEFAULT_TIMER_DURATION, handleTimeout);

  const handleCellClick = function (index) {
    if (game.makeMove(index)) {
      timer.resetTimer();
    }
  };

  const handleNewGame = function () {
    game.resetGame();
    timer.resetTimer();
  };

  useEffect(
    function () {
      if (game.gameStatus !== 'playing') {
        timer.pauseTimer();
      }
    },
    [game.gameStatus, timer, timer.pauseTimer]
  );

  return (
    <div className='container'>
      <Header />
      <ScoreBoard scores={game.scores} />
      <Timer timeLeft={timer.timeLeft} percentage={timer.percentage} />
      <StatusMessage gameStatus={game.gameStatus} winner={game.winner} />
      <div>
        {game.gameStatus === 'playing' && <CurrentPlayer player={game.currentPlayer} />}
        <GameBoard
          board={game.board}
          onCellClick={handleCellClick}
          winningCells={game.winningCells}
          disabled={game.gameStatus !== 'playing'}
          currentPlayer={game.currentPlayer}
          gameId={game.gameId}
        />
      </div>
      <Controls onNewGame={handleNewGame} onResetScores={game.resetScores} />
      <ColorCustomizer theme={theme} onThemeChange={updateTheme} />
    </div>
  );
}

export default App;
