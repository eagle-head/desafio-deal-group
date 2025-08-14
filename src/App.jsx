import React, { useEffect, useCallback } from 'react';

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
const App = () => {
  const game = useGame();
  const { theme, updateTheme } = useTheme();

  const handleTimeout = useCallback(() => {
    if (game.gameStatus === 'playing') {
      game.setCurrentPlayer(getNextPlayer(game.currentPlayer));
    }
  }, [game.currentPlayer, game.gameStatus, game.setCurrentPlayer]);

  const timer = useTimer(DEFAULT_TIMER_DURATION, handleTimeout);

  const handleCellClick = index => {
    if (game.makeMove(index)) {
      timer.resetTimer();
    }
  };

  const handleNewGame = () => {
    game.resetGame();
    timer.resetTimer();
  };

  useEffect(() => {
    if (game.gameStatus !== 'playing') {
      timer.pauseTimer();
    }
  }, [game.gameStatus, timer.pauseTimer]);

  return (
    <div className='container'>
      <Header />
      <ScoreBoard scores={game.scores} />
      <Timer timeLeft={timer.timeLeft} percentage={timer.percentage} />
      <StatusMessage
        gameStatus={game.gameStatus}
        winner={getNextPlayer(game.currentPlayer)}
      />
      <div>
        <CurrentPlayer player={game.currentPlayer} />
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
};

export default App;
