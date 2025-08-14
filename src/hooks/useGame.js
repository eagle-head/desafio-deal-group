import { useState } from 'react';

const useGame = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameStatus, setGameStatus] = useState('playing'); // playing, win, draw
  const [winningCells, setWinningCells] = useState([]);

  const checkWinner = board => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], cells: pattern };
      }
    }

    if (board.every(cell => cell !== null)) {
      return { winner: 'draw', cells: [] };
    }

    return null;
  };

  const makeMove = index => {
    if (board[index] || gameStatus !== 'playing') return false;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      if (result.winner === 'draw') {
        setGameStatus('draw');
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      } else {
        setGameStatus('win');
        setWinningCells(result.cells);
        setScores(prev => ({
          ...prev,
          [result.winner]: prev[result.winner] + 1,
        }));
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }

    return true;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameStatus('playing');
    setWinningCells([]);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
  };

  return {
    board,
    currentPlayer,
    scores,
    gameStatus,
    winningCells,
    makeMove,
    resetGame,
    resetScores,
    setCurrentPlayer,
  };
};

export default useGame;