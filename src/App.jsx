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
  GameBoard
} from './components';

// Main App Component
const App = () => {
  const game = useGame();
  const { theme, updateTheme } = useTheme();

  const handleTimeout = useCallback(() => {
    if (game.gameStatus === 'playing') {
      game.setCurrentPlayer(game.currentPlayer === 'X' ? 'O' : 'X');
    }
  }, [game.currentPlayer, game.gameStatus, game.setCurrentPlayer]);

  const timer = useTimer(5, handleTimeout);

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

  const styles = {
    container: {
      width: '100%',
      maxWidth: '480px',
      margin: '0 auto',
    },
  };

  const responsiveStyles = `
    .container {
      width: 100%;
      max-width: 480px;
      margin: 0 auto;
    }
    
    @media (min-width: 640px) {
      .header h1 { font-size: 2.5rem; }
      .game-board-container { max-width: 360px; }
      .game-board { gap: 1rem; }
      .cell { font-size: 3rem; }
      .controls { max-width: 400px; margin: 0 auto 1.5rem; }
    }
    
    @media (min-width: 768px) {
      .container { max-width: 600px; }
      .score-board { padding: 2rem; }
      .game-container { padding: 2rem; }
      .game-board-container { max-width: 400px; }
      .fab-container { right: 2rem; }
    }
    
    @media (min-width: 1024px) {
      .container { max-width: 720px; }
      .header h1 { font-size: 3rem; }
      .header p { font-size: 1rem; }
    }
  `;

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={styles.container} className='container'>
        <Header />
        <ScoreBoard scores={game.scores} />
        <Timer timeLeft={timer.timeLeft} percentage={timer.percentage} />
        <StatusMessage
          gameStatus={game.gameStatus}
          winner={game.currentPlayer === 'X' ? 'O' : 'X'}
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
    </>
  );
};

export default App;
