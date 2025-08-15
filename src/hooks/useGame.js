import { useState } from 'react';
import { checkWinner, isValidMove, makeMove as makeMoveOnBoard, getNextPlayer } from '../utils/gameLogic';
import { INITIAL_BOARD, INITIAL_SCORES, PLAYERS, GAME_STATUS } from '../utils/constants';

const useGame = () => {
  const [board, setBoard] = useState(INITIAL_BOARD);
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

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setCurrentPlayer(PLAYERS.X);
    setGameStatus('playing');
    setWinner(null);
    setWinningCells([]);
  };

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
    makeMove,
    resetGame,
    resetScores,
    setCurrentPlayer,
  };
};

export default useGame;
