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

// Main App Component
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
        />
      </div>
      <Controls onNewGame={handleNewGame} onResetScores={game.resetScores} />
      <ColorCustomizer theme={theme} onThemeChange={updateTheme} />
    </div>
  );
}

export default App;
