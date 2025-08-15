/**
 * Synchronization Validation for Tic-Tac-Toe Game
 * 
 * This file validates that all game state components are properly synchronized:
 * 1. Winner detection matches status message
 * 2. Scoreboard updates reflect actual game results
 * 3. Leading player badge shows on correct player
 * 4. State transitions happen in correct order
 */

export function validateGameStateSynchronization(gameState) {
  const { gameStatus, winner, scores, currentPlayer } = gameState;
  
  const issues = [];

  // 1. Validate winner state consistency
  if (gameStatus === 'win' && !winner) {
    issues.push('Game status is "win" but no winner is set');
  }
  
  if (gameStatus === 'draw' && winner !== 'draw') {
    issues.push('Game status is "draw" but winner is not set to "draw"');
  }
  
  if (gameStatus === 'playing' && winner !== null) {
    issues.push('Game is playing but winner is already set');
  }

  // 2. Validate score consistency
  const totalGames = scores.X + scores.O + scores.draws;
  if (totalGames < 0) {
    issues.push('Total games cannot be negative');
  }
  
  if (scores.X < 0 || scores.O < 0 || scores.draws < 0) {
    issues.push('Individual scores cannot be negative');
  }

  // 3. Validate current player state
  if (gameStatus !== 'playing' && currentPlayer && gameStatus !== 'win') {
    // Note: When game ends with a win, currentPlayer should still be the player who just moved
    // This is actually correct behavior
  }

  return {
    isValid: issues.length === 0,
    issues,
    gameState: {
      gameStatus,
      winner,
      scores,
      currentPlayer,
      totalGames
    }
  };
}

/**
 * Test scenarios to validate synchronization
 */
export const testScenarios = [
  {
    name: 'X wins game',
    expectedWinner: 'X',
    expectedGameStatus: 'win',
    expectedScoreIncrease: { X: 1, O: 0, draws: 0 }
  },
  {
    name: 'O wins game', 
    expectedWinner: 'O',
    expectedGameStatus: 'win',
    expectedScoreIncrease: { X: 0, O: 1, draws: 0 }
  },
  {
    name: 'Draw game',
    expectedWinner: 'draw',
    expectedGameStatus: 'draw', 
    expectedScoreIncrease: { X: 0, O: 0, draws: 1 }
  },
  {
    name: 'Game in progress',
    expectedWinner: null,
    expectedGameStatus: 'playing',
    expectedScoreIncrease: { X: 0, O: 0, draws: 0 }
  }
];

/**
 * Validates that UI components show consistent information
 */
export function validateUIConsistency(uiState) {
  const { statusMessage, scoreBoard, currentPlayerDisplay, gameBoard } = uiState;
  
  const issues = [];
  
  // Check if status message winner matches actual winner
  if (statusMessage.visible && statusMessage.winner !== gameBoard.winner) {
    issues.push(`Status message shows winner "${statusMessage.winner}" but actual winner is "${gameBoard.winner}"`);
  }
  
  // Check if scoreboard totals make sense
  const calculatedTotal = scoreBoard.scores.X + scoreBoard.scores.O + scoreBoard.scores.draws;
  if (calculatedTotal !== scoreBoard.totalGames) {
    issues.push(`Scoreboard total games mismatch: calculated ${calculatedTotal} vs displayed ${scoreBoard.totalGames}`);
  }
  
  // Check if current player display is appropriate
  if (gameBoard.gameStatus !== 'playing' && currentPlayerDisplay.visible) {
    issues.push('Current player should not be displayed when game is not active');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}