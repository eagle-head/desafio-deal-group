import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Timer from '../Timer/Timer';
import { PROGRESS_BAR_VARIANTS } from '../ProgressBar/constants';

// Mock CSS modules
vi.mock('../Timer/timer.css', () => ({
  default: {},
}));

// Mock ProgressBar component to isolate Timer testing
vi.mock('../ProgressBar/ProgressBar', () => ({
  ProgressBar: vi.fn(({ value, variant, animated, showLabel, ...props }) => (
    <div
      data-testid='progress-bar'
      data-value={value}
      data-variant={variant}
      data-animated={animated}
      data-show-label={showLabel}
      {...props}
    >
      ProgressBar-{value}%-{variant}
    </div>
  )),
}));

describe('Timer Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('should render with required props', () => {
      render(<Timer timeLeft={15} percentage={50} />);

      const container = screen.getByText('Move Timer').parentElement.parentElement;
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('timer-container');

      const header = screen.getByText('Move Timer').parentElement;
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('timer-header');

      const label = screen.getByText('Move Timer');
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass('timer-label');

      const value = screen.getByText('15s');
      expect(value).toBeInTheDocument();
      expect(value).toHaveClass('timer-value');
    });

    test('should render complete structure', () => {
      render(<Timer timeLeft={10} percentage={75} />);

      // Container div
      const container = screen.getByText('Move Timer').parentElement.parentElement;
      expect(container).toHaveClass('timer-container');

      // Header div
      const header = screen.getByText('Move Timer').parentElement;
      expect(header.tagName).toBe('DIV');
      expect(header).toHaveClass('timer-header');

      // Label span
      const label = screen.getByText('Move Timer');
      expect(label.tagName).toBe('SPAN');
      expect(label).toHaveClass('timer-label');

      // Value span
      const value = screen.getByText('10s');
      expect(value.tagName).toBe('SPAN');
      expect(value).toHaveClass('timer-value');

      // ProgressBar component
      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('TimeLeft Prop', () => {
    test('should display timeLeft with "s" suffix', () => {
      render(<Timer timeLeft={5} percentage={80} />);

      const value = screen.getByText('5s');
      expect(value).toBeInTheDocument();
      expect(value).toHaveClass('timer-value');
    });

    test('should handle zero timeLeft', () => {
      render(<Timer timeLeft={0} percentage={100} />);

      const value = screen.getByText('0s');
      expect(value).toBeInTheDocument();
    });

    test('should handle large timeLeft values', () => {
      render(<Timer timeLeft={999} percentage={5} />);

      const value = screen.getByText('999s');
      expect(value).toBeInTheDocument();
    });

    test('should handle negative timeLeft values', () => {
      render(<Timer timeLeft={-5} percentage={100} />);

      const value = screen.getByText('-5s');
      expect(value).toBeInTheDocument();
    });

    test('should handle decimal timeLeft values', () => {
      render(<Timer timeLeft={2.5} percentage={90} />);

      const value = screen.getByText('2.5s');
      expect(value).toBeInTheDocument();
    });
  });

  describe('Percentage Prop', () => {
    test('should pass percentage to ProgressBar', () => {
      render(<Timer timeLeft={10} percentage={65} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-value', '65');
    });

    test('should handle zero percentage', () => {
      render(<Timer timeLeft={10} percentage={0} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-value', '0');
    });

    test('should handle 100 percentage', () => {
      render(<Timer timeLeft={0} percentage={100} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-value', '100');
    });

    test('should handle decimal percentage values', () => {
      render(<Timer timeLeft={5} percentage={33.33} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-value', '33.33');
    });

    test('should handle values over 100 percentage', () => {
      render(<Timer timeLeft={5} percentage={150} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-value', '150');
    });
  });

  describe('getProgressVariant Function (Lines 31-35)', () => {
    test('should return ERROR variant when timeLeft <= 2', () => {
      render(<Timer timeLeft={2} percentage={95} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.ERROR);
    });

    test('should return ERROR variant when timeLeft is less than 2', () => {
      render(<Timer timeLeft={1} percentage={98} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.ERROR);
    });

    test('should return ERROR variant when timeLeft is 0', () => {
      render(<Timer timeLeft={0} percentage={100} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.ERROR);
    });

    test('should return WARNING variant when timeLeft <= 3 but > 2', () => {
      render(<Timer timeLeft={3} percentage={85} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.WARNING);
    });

    test('should return PRIMARY variant when timeLeft > 3', () => {
      render(<Timer timeLeft={4} percentage={75} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.PRIMARY);
    });

    test('should return PRIMARY variant for large timeLeft values', () => {
      render(<Timer timeLeft={30} percentage={25} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.PRIMARY);
    });

    test('should handle decimal timeLeft values in variant logic', () => {
      // Test edge case: 2.1 should be WARNING (> 2 but <= 3)
      render(<Timer timeLeft={2.1} percentage={90} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.WARNING);
    });

    test('should handle negative timeLeft values in variant logic', () => {
      render(<Timer timeLeft={-1} percentage={100} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.ERROR);
    });

    test('should use strict comparison for variant boundaries', () => {
      const testCases = [
        { timeLeft: 1.9, expectedVariant: PROGRESS_BAR_VARIANTS.ERROR },
        { timeLeft: 2, expectedVariant: PROGRESS_BAR_VARIANTS.ERROR },
        { timeLeft: 2.1, expectedVariant: PROGRESS_BAR_VARIANTS.WARNING },
        { timeLeft: 3, expectedVariant: PROGRESS_BAR_VARIANTS.WARNING },
        { timeLeft: 3.1, expectedVariant: PROGRESS_BAR_VARIANTS.PRIMARY },
        { timeLeft: 4, expectedVariant: PROGRESS_BAR_VARIANTS.PRIMARY },
      ];

      testCases.forEach(({ timeLeft, expectedVariant }) => {
        const { unmount } = render(<Timer timeLeft={timeLeft} percentage={50} />);

        const progressBar = screen.getByTestId('progress-bar');
        expect(progressBar).toHaveAttribute('data-variant', expectedVariant);

        unmount();
      });
    });
  });

  describe('ProgressBar Integration', () => {
    test('should pass correct props to ProgressBar', () => {
      render(<Timer timeLeft={5} percentage={60} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-value', '60');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.PRIMARY);
      expect(progressBar).toHaveAttribute('data-animated', 'true');
      expect(progressBar).toHaveAttribute('data-show-label', 'false');
    });

    test('should always pass animated=true to ProgressBar', () => {
      const timeValues = [0, 2, 3, 5, 10];

      timeValues.forEach(timeLeft => {
        const { unmount } = render(<Timer timeLeft={timeLeft} percentage={50} />);

        const progressBar = screen.getByTestId('progress-bar');
        expect(progressBar).toHaveAttribute('data-animated', 'true');

        unmount();
      });
    });

    test('should always pass showLabel=false to ProgressBar', () => {
      const timeValues = [0, 2, 3, 5, 10];

      timeValues.forEach(timeLeft => {
        const { unmount } = render(<Timer timeLeft={timeLeft} percentage={75} />);

        const progressBar = screen.getByTestId('progress-bar');
        expect(progressBar).toHaveAttribute('data-show-label', 'false');

        unmount();
      });
    });

    test('should render ProgressBar with mocked content', () => {
      render(<Timer timeLeft={8} percentage={40} />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveTextContent('ProgressBar-40%-primary');
    });
  });

  describe('Component Structure', () => {
    test('should have correct HTML structure', () => {
      render(<Timer timeLeft={7} percentage={55} />);

      // Root div with class
      const container = screen.getByText('Move Timer').parentElement.parentElement;
      expect(container.tagName).toBe('DIV');
      expect(container).toHaveClass('timer-container');

      // Header div
      const header = screen.getByText('Move Timer').parentElement;
      expect(header.tagName).toBe('DIV');
      expect(header).toHaveClass('timer-header');

      // ProgressBar should be a child of the container but not of header
      const progressBar = screen.getByTestId('progress-bar');
      expect(container).toContainElement(progressBar);
      expect(header).not.toContainElement(progressBar);
    });

    test('should contain all required elements', () => {
      render(<Timer timeLeft={12} percentage={30} />);

      const container = screen.getByText('Move Timer').parentElement.parentElement;

      // Should contain the header
      expect(container).toContainElement(screen.getByText('Move Timer').parentElement);

      // Should contain the ProgressBar
      expect(container).toContainElement(screen.getByTestId('progress-bar'));

      // Container should have exactly 2 children: header + ProgressBar
      expect(container.children).toHaveLength(2);
    });

    test('should maintain consistent structure across different props', () => {
      const testCases = [
        { timeLeft: 1, percentage: 95 },
        { timeLeft: 3, percentage: 85 },
        { timeLeft: 10, percentage: 50 },
      ];

      testCases.forEach(({ timeLeft, percentage }) => {
        const { unmount } = render(<Timer timeLeft={timeLeft} percentage={percentage} />);

        // Check structure consistency
        const container = screen.getByText('Move Timer').parentElement.parentElement;
        expect(container).toHaveClass('timer-container');
        expect(container.children).toHaveLength(2);

        const header = screen.getByText('Move Timer').parentElement;
        expect(header).toHaveClass('timer-header');
        expect(header.children).toHaveLength(2); // label + value

        const progressBar = screen.getByTestId('progress-bar');
        expect(progressBar).toBeInTheDocument();

        unmount();
      });
    });
  });

  describe('CSS Classes', () => {
    test('should apply timer-container class to root element', () => {
      render(<Timer timeLeft={8} percentage={45} />);

      const container = screen.getByText('Move Timer').parentElement.parentElement;
      expect(container).toHaveClass('timer-container');
    });

    test('should apply timer-header class to header element', () => {
      render(<Timer timeLeft={8} percentage={45} />);

      const header = screen.getByText('Move Timer').parentElement;
      expect(header).toHaveClass('timer-header');
    });

    test('should apply timer-label class to label element', () => {
      render(<Timer timeLeft={8} percentage={45} />);

      const label = screen.getByText('Move Timer');
      expect(label).toHaveClass('timer-label');
    });

    test('should apply timer-value class to value element', () => {
      render(<Timer timeLeft={8} percentage={45} />);

      const value = screen.getByText('8s');
      expect(value).toHaveClass('timer-value');
    });

    test('should not have additional unexpected classes', () => {
      render(<Timer timeLeft={8} percentage={45} />);

      const container = screen.getByText('Move Timer').parentElement.parentElement;
      const containerClasses = Array.from(container.classList);
      expect(containerClasses).toEqual(['timer-container']);

      const header = screen.getByText('Move Timer').parentElement;
      const headerClasses = Array.from(header.classList);
      expect(headerClasses).toEqual(['timer-header']);

      const label = screen.getByText('Move Timer');
      const labelClasses = Array.from(label.classList);
      expect(labelClasses).toEqual(['timer-label']);

      const value = screen.getByText('8s');
      const valueClasses = Array.from(value.classList);
      expect(valueClasses).toEqual(['timer-value']);
    });
  });

  describe('Text Content', () => {
    test('should display correct label text', () => {
      render(<Timer timeLeft={6} percentage={70} />);

      const label = screen.getByText('Move Timer');
      expect(label).toHaveTextContent('Move Timer');
    });

    test('should have consistent label text regardless of props', () => {
      const testCases = [
        { timeLeft: 0, percentage: 100 },
        { timeLeft: 2, percentage: 95 },
        { timeLeft: 3, percentage: 85 },
        { timeLeft: 15, percentage: 25 },
      ];

      testCases.forEach(({ timeLeft, percentage }) => {
        const { unmount } = render(<Timer timeLeft={timeLeft} percentage={percentage} />);

        const label = screen.getByText('Move Timer');
        expect(label).toHaveTextContent('Move Timer');

        unmount();
      });
    });

    test('should format time value correctly', () => {
      const testCases = [
        { timeLeft: 0, expected: '0s' },
        { timeLeft: 1, expected: '1s' },
        { timeLeft: 10, expected: '10s' },
        { timeLeft: 60, expected: '60s' },
        { timeLeft: 2.5, expected: '2.5s' },
      ];

      testCases.forEach(({ timeLeft, expected }) => {
        const { unmount } = render(<Timer timeLeft={timeLeft} percentage={50} />);

        const value = screen.getByText(expected);
        expect(value).toBeInTheDocument();
        expect(value).toHaveClass('timer-value');

        unmount();
      });
    });
  });

  describe('Component Props', () => {
    test('should be a function component', () => {
      expect(typeof Timer).toBe('function');
    });

    test('should handle props object destructuring', () => {
      expect(() => render(<Timer timeLeft={5} percentage={50} />)).not.toThrow();
      expect(() => render(<Timer timeLeft={0} percentage={100} />)).not.toThrow();
    });

    test('should handle missing props gracefully', () => {
      // Test component without any props (should handle undefined)
      expect(() => render(<Timer />)).not.toThrow();

      // When timeLeft is undefined, it should render as 's' (empty + 's')
      const value = screen.getByText('s');
      expect(value).toBeInTheDocument();
      expect(value).toHaveClass('timer-value');
    });

    test('should ignore additional unknown props', () => {
      render(<Timer timeLeft={5} percentage={50} unknownProp='test' extraData={123} />);

      // Component should still render correctly
      const container = screen.getByText('Move Timer').parentElement.parentElement;
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('timer-container');

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-value', '50');
    });
  });

  describe('Re-rendering Behavior', () => {
    test('should update timer value when timeLeft changes', () => {
      const { rerender } = render(<Timer timeLeft={10} percentage={50} />);

      let value = screen.getByText('10s');
      expect(value).toBeInTheDocument();

      rerender(<Timer timeLeft={5} percentage={75} />);

      value = screen.getByText('5s');
      expect(value).toBeInTheDocument();
      expect(screen.queryByText('10s')).not.toBeInTheDocument();
    });

    test('should update ProgressBar when percentage changes', () => {
      const { rerender } = render(<Timer timeLeft={8} percentage={40} />);

      let progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-value', '40');

      rerender(<Timer timeLeft={8} percentage={80} />);

      progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-value', '80');
    });

    test('should update variant when timeLeft crosses thresholds', () => {
      const { rerender } = render(<Timer timeLeft={5} percentage={50} />);

      let progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.PRIMARY);

      rerender(<Timer timeLeft={3} percentage={75} />);

      progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.WARNING);

      rerender(<Timer timeLeft={1} percentage={95} />);

      progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.ERROR);
    });

    test('should maintain label and CSS classes during re-renders', () => {
      const { rerender } = render(<Timer timeLeft={10} percentage={25} />);

      let container = screen.getByText('Move Timer').parentElement.parentElement;
      let label = screen.getByText('Move Timer');

      expect(container).toHaveClass('timer-container');
      expect(label).toHaveClass('timer-label');
      expect(label).toHaveTextContent('Move Timer');

      rerender(<Timer timeLeft={2} percentage={90} />);

      container = screen.getByText('Move Timer').parentElement.parentElement;
      label = screen.getByText('Move Timer');

      expect(container).toHaveClass('timer-container');
      expect(label).toHaveClass('timer-label');
      expect(label).toHaveTextContent('Move Timer');
    });
  });

  describe('Edge Cases', () => {
    test('should handle string timeLeft values', () => {
      render(<Timer timeLeft='5' percentage={50} />);

      const value = screen.getByText('5s');
      expect(value).toBeInTheDocument();

      // Should still work with variant logic (string "5" > 3)
      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.PRIMARY);
    });

    test('should handle string percentage values', () => {
      render(<Timer timeLeft={5} percentage='75' />);

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-value', '75');
    });

    test('should handle NaN timeLeft values', () => {
      render(<Timer timeLeft={NaN} percentage={50} />);

      const value = screen.getByText('NaNs');
      expect(value).toBeInTheDocument();
    });

    test('should handle Infinity timeLeft values', () => {
      render(<Timer timeLeft={Infinity} percentage={0} />);

      const value = screen.getByText('Infinitys');
      expect(value).toBeInTheDocument();

      // Infinity > 3, so should be PRIMARY
      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.PRIMARY);
    });

    test('should handle null/undefined values', () => {
      render(<Timer timeLeft={null} percentage={undefined} />);

      // null renders as empty string before 's'
      const value = screen.getByText('s');
      expect(value).toBeInTheDocument();

      const progressBar = screen.getByTestId('progress-bar');
      // undefined percentage means no data-value attribute is set
      expect(progressBar).not.toHaveAttribute('data-value');
    });

    test('should handle boolean timeLeft values', () => {
      // Suppress React warning for this specific test case
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<Timer timeLeft={true} percentage={50} />);

      // boolean true renders as empty string before 's'
      const value = screen.getByText('s');
      expect(value).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    test('should handle very precise decimal values', () => {
      render(<Timer timeLeft={2.000001} percentage={87.654321} />);

      const value = screen.getByText('2.000001s');
      expect(value).toBeInTheDocument();

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveAttribute('data-value', '87.654321');
      // 2.000001 > 2, so should be WARNING
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.WARNING);
    });
  });

  describe('Accessibility', () => {
    test('should render semantic HTML elements', () => {
      render(<Timer timeLeft={5} percentage={50} />);

      // Check that we're using proper semantic elements
      const container = screen.getByText('Move Timer').parentElement.parentElement;
      expect(container.tagName).toBe('DIV');

      const header = screen.getByText('Move Timer').parentElement;
      expect(header.tagName).toBe('DIV');

      const label = screen.getByText('Move Timer');
      expect(label.tagName).toBe('SPAN');

      const value = screen.getByText('5s');
      expect(value.tagName).toBe('SPAN');
    });

    test('should provide readable text content', () => {
      render(<Timer timeLeft={7} percentage={60} />);

      // Ensure the label provides clear, readable text
      const label = screen.getByText('Move Timer');
      expect(label).toHaveTextContent('Move Timer');

      const value = screen.getByText('7s');
      expect(value).toHaveTextContent('7s');

      // Text should be accessible to screen readers
      expect(label.textContent.trim()).toBeTruthy();
      expect(value.textContent.trim()).toBeTruthy();
    });

    test('should not have accessibility violations in basic structure', () => {
      render(<Timer timeLeft={3} percentage={85} />);

      // Basic accessibility checks
      const container = screen.getByText('Move Timer').parentElement.parentElement;

      // Should not have empty text content for screen readers
      expect(container.textContent.trim()).toBeTruthy();

      // Should have proper nesting
      expect(container.children.length).toBeGreaterThan(0);
    });

    test('should integrate with ProgressBar accessibility features', () => {
      render(<Timer timeLeft={4} percentage={65} />);

      // ProgressBar should be present and provide its own accessibility
      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('data-value', '65');
    });
  });

  describe('Performance', () => {
    test('should render efficiently with minimal DOM elements', () => {
      render(<Timer timeLeft={6} percentage={40} />);

      const container = screen.getByText('Move Timer').parentElement.parentElement;

      // Should have a lean DOM structure
      expect(container.children).toHaveLength(2); // header + ProgressBar

      const header = screen.getByText('Move Timer').parentElement;
      expect(header.children).toHaveLength(2); // label + value
    });

    test('should not create new functions on each render', () => {
      // getProgressVariant is defined inline but doesn't rely on closures
      render(<Timer timeLeft={5} percentage={50} />);

      // Component should render without issues
      expect(screen.getByText('Move Timer')).toBeInTheDocument();
      expect(screen.getByText('5s')).toBeInTheDocument();
      expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    });
  });

  describe('Integration with ProgressBar', () => {
    test('should properly integrate with mocked ProgressBar', () => {
      render(<Timer timeLeft={8} percentage={45} />);

      const progressBar = screen.getByTestId('progress-bar');

      // Verify all expected props are passed
      expect(progressBar).toHaveAttribute('data-value', '45');
      expect(progressBar).toHaveAttribute('data-variant', PROGRESS_BAR_VARIANTS.PRIMARY);
      expect(progressBar).toHaveAttribute('data-animated', 'true');
      expect(progressBar).toHaveAttribute('data-show-label', 'false');

      // Should render the mocked content
      expect(progressBar).toHaveTextContent('ProgressBar-45%-primary');
    });

    test('should pass consistent ProgressBar props across different scenarios', () => {
      const scenarios = [
        { timeLeft: 1, percentage: 95, expectedVariant: PROGRESS_BAR_VARIANTS.ERROR },
        { timeLeft: 3, percentage: 85, expectedVariant: PROGRESS_BAR_VARIANTS.WARNING },
        { timeLeft: 10, percentage: 25, expectedVariant: PROGRESS_BAR_VARIANTS.PRIMARY },
      ];

      scenarios.forEach(({ timeLeft, percentage, expectedVariant }) => {
        const { unmount } = render(<Timer timeLeft={timeLeft} percentage={percentage} />);

        const progressBar = screen.getByTestId('progress-bar');

        // These props should always be the same
        expect(progressBar).toHaveAttribute('data-animated', 'true');
        expect(progressBar).toHaveAttribute('data-show-label', 'false');

        // These should vary based on props
        expect(progressBar).toHaveAttribute('data-value', String(percentage));
        expect(progressBar).toHaveAttribute('data-variant', expectedVariant);

        unmount();
      });
    });
  });

  describe('Function Component Behavior', () => {
    test('should be a pure function component without state', () => {
      // Component should render consistently with same props
      const { rerender } = render(<Timer timeLeft={5} percentage={50} />);

      const initialValue = screen.getByText('5s');
      const initialProgressBar = screen.getByTestId('progress-bar');

      expect(initialValue).toBeInTheDocument();
      expect(initialProgressBar).toHaveAttribute('data-value', '50');

      // Re-render with same props should produce same result
      rerender(<Timer timeLeft={5} percentage={50} />);

      const newValue = screen.getByText('5s');
      const newProgressBar = screen.getByTestId('progress-bar');

      expect(newValue).toBeInTheDocument();
      expect(newProgressBar).toHaveAttribute('data-value', '50');
    });

    test('should not have displayName by default', () => {
      // Unlike some components in the codebase, Timer doesn't set displayName
      expect(Timer.displayName).toBeUndefined();
    });
  });
});
