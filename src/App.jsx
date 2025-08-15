import { useEffect, useCallback } from 'react';
import { useGame, useTimer, useTheme } from './hooks';
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
import { DEFAULT_TIMER_DURATION, getNextPlayer } from './utils';

function App() {
  const game = useGame();
  const { theme, updateTheme } = useTheme();
  const timer = useTimer(DEFAULT_TIMER_DURATION, null, {
    precision: 100, // Update every 100ms for smooth visual updates
    autoReset: false, // Don't auto-reset, let game logic handle it
    useHighPrecision: true, // Use performance.now() for better accuracy
  });

  const handleTimeout = useCallback(
    function () {
      if (game.gameStatus === 'playing') {
        game.setCurrentPlayer(getNextPlayer(game.currentPlayer));
        timer.restartTimer(); // Restart timer after switching player
      }
    },
    [game, timer]
  );

  function handleCellClick(index) {
    if (game.makeMove(index)) {
      timer.restartTimer(); // Use restartTimer for immediate restart
    }
  }

  function handleNewGame() {
    game.resetGame();
    timer.restartTimer(); // Use restartTimer to immediately start the new game timer
  }

  useEffect(() => {
    if (game.gameStatus !== 'playing') {
      timer.pauseTimer();
    }

    if (game.gameStatus === 'playing' && !timer.isRunning) {
      timer.startTimer();
    }
  }, [game.gameStatus, timer]);

  // Handle timer expiration
  useEffect(() => {
    if (timer.isExpired && game.gameStatus === 'playing') {
      handleTimeout();
    }
  }, [timer.isExpired, game.gameStatus, handleTimeout]);

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
