import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Header from '../Header/Header';

// Mock CSS modules
vi.mock('../Header/Header.module.css', () => ({
  default: {
    header: 'header',
    title: 'title',
  },
}));

describe('Header Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('should render header element', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header.tagName).toBe('HEADER');
    });

    test('should render with correct CSS class from module', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('header');
    });

    test('should render h1 title element', () => {
      render(<Header />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H1');
    });

    test('should display correct title text', () => {
      render(<Header />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('Tic Tac Toe');
    });

    test('should apply title CSS class from module', () => {
      render(<Header />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('title');
    });
  });

  describe('Component Structure', () => {
    test('should have correct HTML structure', () => {
      render(<Header />);

      // Root header element
      const header = screen.getByRole('banner');
      expect(header.tagName).toBe('HEADER');
      expect(header).toHaveClass('header');

      // H1 title element as child
      const title = screen.getByRole('heading', { level: 1 });
      expect(title.tagName).toBe('H1');
      expect(title).toHaveClass('title');

      // Verify title is a child of header
      expect(header).toContainElement(title);
    });

    test('should contain only one child element', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      expect(header.children).toHaveLength(1);
    });

    test('should have h1 as direct child of header', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      const title = screen.getByRole('heading', { level: 1 });

      expect(header.firstElementChild).toBe(title);
      expect(title.parentElement).toBe(header);
    });
  });

  describe('CSS Module Integration', () => {
    test('should apply header class from CSS module', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      expect(header.className).toContain('header');
    });

    test('should apply title class from CSS module', () => {
      render(<Header />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title.className).toContain('title');
    });

    test('should not have additional unexpected classes', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      const headerClasses = Array.from(header.classList);
      expect(headerClasses).toEqual(['header']);

      const title = screen.getByRole('heading', { level: 1 });
      const titleClasses = Array.from(title.classList);
      expect(titleClasses).toEqual(['title']);
    });
  });

  describe('Text Content', () => {
    test('should display exact title text "Tic Tac Toe"', () => {
      render(<Header />);

      const title = screen.getByText('Tic Tac Toe');
      expect(title).toBeInTheDocument();
    });

    test('should have consistent text content', () => {
      render(<Header />);

      const titleByRole = screen.getByRole('heading', { level: 1 });
      const titleByText = screen.getByText('Tic Tac Toe');

      expect(titleByRole).toBe(titleByText);
      expect(titleByRole.textContent).toBe('Tic Tac Toe');
    });

    test('should not have empty text content', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      const title = screen.getByRole('heading', { level: 1 });

      expect(header.textContent.trim()).toBeTruthy();
      expect(title.textContent.trim()).toBeTruthy();
    });
  });

  describe('Component Props and Behavior', () => {
    test('should be a function component', () => {
      expect(typeof Header).toBe('function');
    });

    test('should not accept any props', () => {
      // Component should work without props
      expect(() => render(<Header />)).not.toThrow();
    });

    test('should ignore additional props if passed', () => {
      // Component should still render correctly even if props are passed
      render(<Header className='extra-class' data-testid='header-test' />);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('header');

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('Tic Tac Toe');
    });

    test('should render consistently on multiple renders', () => {
      const { rerender } = render(<Header />);

      let header = screen.getByRole('banner');
      let title = screen.getByRole('heading', { level: 1 });

      expect(header).toHaveClass('header');
      expect(title).toHaveTextContent('Tic Tac Toe');

      rerender(<Header />);

      header = screen.getByRole('banner');
      title = screen.getByRole('heading', { level: 1 });

      expect(header).toHaveClass('header');
      expect(title).toHaveTextContent('Tic Tac Toe');
    });
  });

  describe('Import Statement Coverage', () => {
    test('should import and use CSS module styles', () => {
      render(<Header />);

      // Verify that the CSS module import is being used
      const header = screen.getByRole('banner');
      const title = screen.getByRole('heading', { level: 1 });

      // These classes come from the mocked CSS module
      expect(header).toHaveClass('header');
      expect(title).toHaveClass('title');
    });
  });

  describe('JSDoc Comment Coverage', () => {
    test('should function as documented in JSDoc comments', () => {
      // Testing the documented behavior: "displaying the game title"
      render(<Header />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('Tic Tac Toe');
    });

    test('should provide consistent branding as documented', () => {
      // Testing "Provides consistent branding across the application interface"
      render(<Header />);

      const header = screen.getByRole('banner');
      const title = screen.getByRole('heading', { level: 1 });

      // Consistent structure and styling
      expect(header).toHaveClass('header');
      expect(title).toHaveClass('title');
      expect(title).toHaveTextContent('Tic Tac Toe');
    });

    test('should return JSX.Element as documented', () => {
      // Testing "@returns {JSX.Element} Header element with game title"
      const result = render(<Header />);

      expect(result.container.firstChild).toBeInstanceOf(HTMLElement);
      expect(result.container.firstChild.tagName).toBe('HEADER');
    });
  });

  describe('Function Declaration Coverage', () => {
    test('should be a default export function', () => {
      expect(Header).toBeDefined();
      expect(typeof Header).toBe('function');
    });

    test('should execute function body correctly', () => {
      // Testing the return statement and JSX rendering
      render(<Header />);

      // Verify the JSX structure matches the return statement
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('header');

      const title = header.querySelector('h1');
      expect(title).toHaveClass('title');
      expect(title).toHaveTextContent('Tic Tac Toe');
    });
  });

  describe('Accessibility', () => {
    test('should render semantic header element', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    test('should provide proper heading hierarchy', () => {
      render(<Header />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    test('should have accessible title text', () => {
      render(<Header />);

      // Title should be accessible to screen readers
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveAccessibleName('Tic Tac Toe');
    });

    test('should not have accessibility violations in basic structure', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      const title = screen.getByRole('heading', { level: 1 });

      // Should have proper semantic structure
      expect(header.textContent.trim()).toBeTruthy();
      expect(title.textContent.trim()).toBeTruthy();

      // Should have proper nesting
      expect(header).toContainElement(title);
    });
  });

  describe('Performance', () => {
    test('should render efficiently with minimal DOM elements', () => {
      render(<Header />);

      const header = screen.getByRole('banner');

      // Should have a lean DOM structure - just header with h1
      expect(header.children).toHaveLength(1);
      expect(header.firstElementChild.tagName).toBe('H1');
    });

    test('should not create unnecessary DOM nodes', () => {
      render(<Header />);

      const container = screen.getByRole('banner').parentElement;
      const headerElements = container.querySelectorAll('header');
      const h1Elements = container.querySelectorAll('h1');

      // Should have exactly one header and one h1
      expect(headerElements).toHaveLength(1);
      expect(h1Elements).toHaveLength(1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle multiple simultaneous renders', () => {
      const { container: container1 } = render(<Header />);
      const { container: container2 } = render(<Header />);

      // Both should render independently and correctly
      const header1 = container1.querySelector('header');
      const header2 = container2.querySelector('header');

      expect(header1).toHaveClass('header');
      expect(header2).toHaveClass('header');

      expect(header1.querySelector('h1')).toHaveTextContent('Tic Tac Toe');
      expect(header2.querySelector('h1')).toHaveTextContent('Tic Tac Toe');
    });

    test('should maintain consistency across re-renders', () => {
      const { rerender } = render(<Header />);

      let header = screen.getByRole('banner');
      let title = screen.getByRole('heading', { level: 1 });

      const initialHeaderClass = header.className;
      const initialTitleClass = title.className;
      const initialTitleText = title.textContent;

      rerender(<Header />);

      header = screen.getByRole('banner');
      title = screen.getByRole('heading', { level: 1 });

      expect(header.className).toBe(initialHeaderClass);
      expect(title.className).toBe(initialTitleClass);
      expect(title.textContent).toBe(initialTitleText);
    });
  });
});
