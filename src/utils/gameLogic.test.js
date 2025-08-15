/**
 * Simple test to verify game logic synchronization
 * This can be run in the browser console or with a test runner
 */

import { checkWinner, isValidMove, makeMove } from './gameLogic.js';
import { INITIAL_BOARD } from './constants.js';

// Test game state synchronization
export function testGameSynchronization() {
  console.log('Testing game state synchronization...');

  // Test scenario 1: X wins horizontally
  let board = [...INITIAL_BOARD];
  board = makeMove(board, 0, 'X'); // X at position 0
  board = makeMove(board, 3, 'O'); // O at position 3
  board = makeMove(board, 1, 'X'); // X at position 1
  board = makeMove(board, 4, 'O'); // O at position 4
  board = makeMove(board, 2, 'X'); // X at position 2 - X wins top row

  const result = checkWinner(board);
  console.log('Test 1 - X wins top row:', result);
  console.assert(result && result.winner === 'X', 'X should win');
  console.assert(JSON.stringify(result.cells) === JSON.stringify([0, 1, 2]), 'Winning cells should be [0, 1, 2]');

  // Test scenario 2: Draw game
  board = ['X', 'O', 'X', 'O', 'O', 'X', 'O', 'X', 'O'];
  const drawResult = checkWinner(board);
  console.log('Test 2 - Draw game:', drawResult);
  console.assert(drawResult && drawResult.winner === 'draw', 'Should be a draw');

  // Test scenario 3: Game in progress
  board = ['X', 'O', null, 'O', 'X', null, null, null, null];
  const inProgressResult = checkWinner(board);
  console.log('Test 3 - Game in progress:', inProgressResult);
  console.assert(inProgressResult === null, 'Should not have a winner yet');

  console.log('All synchronization tests passed!');
}

// Test can be called from browser console: testGameSynchronization()