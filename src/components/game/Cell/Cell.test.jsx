import { render, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Cell from './Cell';

describe('Cell Component', () => {
  test('renders and handles basic interaction', () => {
    const mockOnClick = vi.fn();
    const { container } = render(
      <Cell
        value={null}
        index={0}
        onClick={mockOnClick}
        currentPlayer="X"
      />
    );
    
    const cell = container.firstChild;
    
    // Verify it renders
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveClass('cell', 'cell--empty');
    
    // Verify click works
    fireEvent.click(cell);
    expect(mockOnClick).toHaveBeenCalledWith(0);
  });

  test('displays player value correctly', () => {
    const { container } = render(
      <Cell
        value="X"
        index={1}
        onClick={() => {}}
        currentPlayer="O"
      />
    );
    
    const cell = container.firstChild;
    expect(cell).toHaveTextContent('X');
    expect(cell).toHaveClass('cell--x', 'cell--filled');
  });
});