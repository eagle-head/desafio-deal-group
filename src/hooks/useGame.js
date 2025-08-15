import { useState, useCallback } from 'react';
import { checkWinner, isValidMove, makeMove as makeMoveOnBoard, getNextPlayer, createEmptyBoard } from '../utils/gameLogic';
import { createInitialBoard, INITIAL_SCORES, PLAYERS, GAME_STATUS } from '../utils/constants';
import { validateBoardState } from '../utils/helpers';

const useGame = () => {
  const [board, setBoard] = useState(() => createInitialBoard());
  const [gameId, setGameId] = useState(() => Date.now()); // Add game ID to force re-renders
  const [currentPlayer, setCurrentPlayer] = useState(PLAYERS.X);
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [gameStatus, setGameStatus] = useState('playing');
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);

  const makeMove = index => {
    if (!isValidMove(board, index, gameStatus)) return false;

    const newBoard = makeMoveOnBoard(board, index, currentPlayer);
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      if (result.winner === 'draw') {
        setGameStatus('draw');
        setWinner('draw');
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      } else {
        setGameStatus('win');
        setWinner(result.winner);
        setWinningCells(result.cells);
        setScores(prev => ({
          ...prev,
          [result.winner]: prev[result.winner] + 1,
        }));
      }
    } else {
      setCurrentPlayer(getNextPlayer(currentPlayer));
    }

    return true;
  };

  const resetGame = useCallback(() => {
    console.log('🎮 Resetting game...');
    
    // Create a completely fresh board array using utility function
    const newBoard = createEmptyBoard();
    
    // Validate the new board is truly empty
    const validation = validateBoardState(newBoard, 'resetGame - new board creation');
    if (!validation.isEmpty || !validation.hasValidCells) {
      console.error('❌ New board is not properly empty:', validation);
    } else {
      console.log('✅ New board created successfully:', validation);
    }
    
    // Create new game ID to force complete re-render
    const newGameId = Date.now();
    
    // Batch all state updates to prevent race conditions
    // Using functional updates to ensure we get the latest state
    setBoard(() => newBoard);
    setCurrentPlayer(() => PLAYERS.X);
    setGameStatus(() => 'playing');
    setWinner(() => null);
    setWinningCells(() => []);
    setGameId(() => newGameId);
    
    console.log('🔄 Game reset completed with ID:', newGameId);
    
    // Double-check that the board is actually empty after state update
    setTimeout(() => {
      setBoard(prevBoard => {
        const postValidation = validateBoardState(prevBoard, 'resetGame - post state update');
        if (!postValidation.isEmpty) {
          console.warn('⚠️ Board not empty after reset, forcing empty state');
          return createEmptyBoard();
        }
        console.log('✅ Board confirmed empty after reset');
        return prevBoard;
      });
    }, 0);
  }, []);

  const resetScores = () => {
    setScores(INITIAL_SCORES);
  };

  return {
    board,
    currentPlayer,
    scores,
    gameStatus,
    winner,
    winningCells,
    gameId, // Add gameId to force re-renders
    makeMove,
    resetGame,
    resetScores,
    setCurrentPlayer,
  };
};

export default useGame;
