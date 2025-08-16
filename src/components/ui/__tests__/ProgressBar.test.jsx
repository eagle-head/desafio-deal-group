import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { PROGRESS_BAR_VARIANTS, PROGRESS_BAR_SIZES } from '../ProgressBar/constants';

// Mock CSS modules
vi.mock('../ProgressBar/ProgressBar.module.css', () => ({
  default: {
    progressBar: 'progressBar',
    'progressBar--small': 'progressBar--small',
    'progressBar--medium': 'progressBar--medium',
    'progressBar--large': 'progressBar--large',
    progressBar__bar: 'progressBar__bar',
    'progressBar__bar--primary': 'progressBar__bar--primary',
    'progressBar__bar--secondary': 'progressBar__bar--secondary',
    'progressBar__bar--success': 'progressBar__bar--success',
    'progressBar__bar--warning': 'progressBar__bar--warning',
    'progressBar__bar--error': 'progressBar__bar--error',
    'progressBar__bar--animated': 'progressBar__bar--animated',
    progressBar__header: 'progressBar__header',
    progressBar__label: 'progressBar__label',
    progressBar__track: 'progressBar__track',
    progressBar__content: 'progressBar__content',
  },
}));

describe('ProgressBar Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('should render with default props', () => {
      render(<ProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    test('should render with custom value', () => {
      render(<ProgressBar value={50} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    test('should render with container classes including size', () => {
      render(<ProgressBar value={25} />);

      const container = screen.getByRole('progressbar').parentElement;
      expect(container).toHaveClass('progressBar');
      expect(container).toHaveClass('progressBar--medium'); // Default size
    });
  });

  describe('Value Clamping Logic (Lines 32-46)', () => {
    test('should clamp negative values to 0', () => {
      render(<ProgressBar value={-10} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');

      const bar = progressBar.querySelector('.progressBar__bar');
      expect(bar).toHaveStyle({ width: '0%' });
    });

    test('should clamp values over 100 to 100', () => {
      render(<ProgressBar value={150} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');

      const bar = progressBar.querySelector('.progressBar__bar');
      expect(bar).toHaveStyle({ width: '100%' });
    });

    test('should preserve valid values between 0 and 100', () => {
      const validValues = [0, 25, 50, 75, 100];

      validValues.forEach(value => {
        const { unmount } = render(<ProgressBar value={value} />);

        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', value.toString());

        const bar = progressBar.querySelector('.progressBar__bar');
        expect(bar).toHaveStyle({ width: `${value}%` });

        unmount();
      });
    });

    test('should handle decimal values correctly', () => {
      render(<ProgressBar value={33.7} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '33.7');

      const bar = progressBar.querySelector('.progressBar__bar');
      expect(bar).toHaveStyle({ width: '33.7%' });
    });

    test('should handle zero value', () => {
      render(<ProgressBar value={0} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');

      const bar = progressBar.querySelector('.progressBar__bar');
      expect(bar).toHaveStyle({ width: '0%' });
    });

    test('should handle exactly 100 value', () => {
      render(<ProgressBar value={100} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');

      const bar = progressBar.querySelector('.progressBar__bar');
      expect(bar).toHaveStyle({ width: '100%' });
    });
  });

  describe('Container Classes Generation (Lines 48)', () => {
    test('should generate correct container classes with default size', () => {
      render(<ProgressBar />);

      const container = screen.getByRole('progressbar').parentElement;
      expect(container).toHaveClass('progressBar');
      expect(container).toHaveClass('progressBar--medium');
    });

    test('should include custom className in container classes', () => {
      render(<ProgressBar className='custom-progress' />);

      const container = screen.getByRole('progressbar').parentElement;
      expect(container).toHaveClass('progressBar');
      expect(container).toHaveClass('progressBar--medium');
      expect(container).toHaveClass('custom-progress');
    });

    test('should handle empty className', () => {
      render(<ProgressBar className='' />);

      const container = screen.getByRole('progressbar').parentElement;
      expect(container).toHaveClass('progressBar');
      expect(container).toHaveClass('progressBar--medium');
      // Empty string should be filtered out
      const classes = container.className.split(' ');
      expect(classes).not.toContain('');
    });

    test('should generate container classes for all sizes', () => {
      Object.entries(PROGRESS_BAR_SIZES).forEach(([_, sizeValue]) => {
        const { unmount } = render(<ProgressBar size={sizeValue} />);

        const container = screen.getByRole('progressbar').parentElement;
        expect(container).toHaveClass(`progressBar--${sizeValue}`);

        unmount();
      });
    });
  });

  describe('Bar Classes Generation (Lines 50-56)', () => {
    test('should generate correct bar classes with default variant and animation', () => {
      render(<ProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      const bar = progressBar.querySelector('.progressBar__bar');

      expect(bar).toHaveClass('progressBar__bar');
      expect(bar).toHaveClass('progressBar__bar--primary'); // Default variant
      expect(bar).toHaveClass('progressBar__bar--animated'); // Default animated is true
    });

    test('should generate bar classes for all variants', () => {
      Object.entries(PROGRESS_BAR_VARIANTS).forEach(([_, variantValue]) => {
        const { unmount } = render(<ProgressBar variant={variantValue} />);

        const progressBar = screen.getByRole('progressbar');
        const bar = progressBar.querySelector('.progressBar__bar');
        expect(bar).toHaveClass(`progressBar__bar--${variantValue}`);

        unmount();
      });
    });

    test('should include animated class when animated is true', () => {
      render(<ProgressBar animated={true} />);

      const progressBar = screen.getByRole('progressbar');
      const bar = progressBar.querySelector('.progressBar__bar');
      expect(bar).toHaveClass('progressBar__bar--animated');
    });

    test('should not include animated class when animated is false', () => {
      render(<ProgressBar animated={false} />);

      const progressBar = screen.getByRole('progressbar');
      const bar = progressBar.querySelector('.progressBar__bar');
      expect(bar).not.toHaveClass('progressBar__bar--animated');
    });

    test('should filter out falsy classes correctly', () => {
      render(<ProgressBar animated={false} />);

      const progressBar = screen.getByRole('progressbar');
      const bar = progressBar.querySelector('.progressBar__bar');

      const classList = bar.className.split(' ');
      expect(classList).not.toContain('');
      expect(classList).not.toContain(undefined);
      expect(classList).not.toContain(null);
    });
  });

  describe('Display Label Logic (Lines 58)', () => {
    test('should generate default percentage label when showLabel is true', () => {
      render(<ProgressBar value={75} showLabel={true} />);

      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    test('should use custom label when provided', () => {
      render(<ProgressBar value={50} label='Custom Label' />);

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
    });

    test('should prefer custom label over percentage label', () => {
      render(<ProgressBar value={50} showLabel={true} label='Custom Label' />);

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });

    test('should round percentage values for display', () => {
      render(<ProgressBar value={33.7} showLabel={true} />);

      expect(screen.getByText('34%')).toBeInTheDocument();
    });

    test('should handle edge case of rounding', () => {
      const testCases = [
        { value: 33.4, expected: '33%' },
        { value: 33.5, expected: '34%' },
        { value: 33.6, expected: '34%' },
        { value: 0.4, expected: '0%' },
        { value: 0.5, expected: '1%' },
        { value: 99.4, expected: '99%' },
        { value: 99.5, expected: '100%' },
      ];

      testCases.forEach(({ value, expected }) => {
        const { unmount } = render(<ProgressBar value={value} showLabel={true} />);

        expect(screen.getByText(expected)).toBeInTheDocument();

        unmount();
      });
    });

    test('should not generate label when showLabel is false and no custom label', () => {
      render(<ProgressBar value={50} showLabel={false} />);

      expect(screen.queryByText('50%')).not.toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('should return empty string when no label conditions are met', () => {
      render(<ProgressBar value={50} />); // showLabel defaults to false, no custom label

      expect(screen.queryByText('50%')).not.toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('Conditional Header Rendering (Lines 62-66)', () => {
    test('should render header when showLabel is true', () => {
      render(<ProgressBar value={50} showLabel={true} />);

      const header = screen.getByText('50%').parentElement;
      expect(header).toHaveClass('progressBar__header');
      expect(header.querySelector('.progressBar__label')).toBeInTheDocument();
    });

    test('should render header when custom label is provided', () => {
      render(<ProgressBar value={50} label='Loading...' />);

      const header = screen.getByText('Loading...').parentElement;
      expect(header).toHaveClass('progressBar__header');
      expect(header.querySelector('.progressBar__label')).toBeInTheDocument();
    });

    test('should not render header when showLabel is false and no custom label', () => {
      render(<ProgressBar value={50} showLabel={false} />);

      expect(screen.queryByText('50%')).not.toBeInTheDocument();
      const container = screen.getByRole('progressbar').parentElement;
      expect(container.querySelector('.progressBar__header')).not.toBeInTheDocument();
    });

    test('should render header structure correctly', () => {
      render(<ProgressBar value={75} showLabel={true} />);

      const header = screen.getByText('75%').closest('.progressBar__header');
      const label = header.querySelector('.progressBar__label');

      expect(header).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('75%');
    });
  });

  describe('Progress Track and Bar Rendering (Lines 67-76)', () => {
    test('should render progress track with correct attributes', () => {
      render(<ProgressBar value={60} />);

      const track = screen.getByRole('progressbar');
      expect(track).toHaveClass('progressBar__track');
      expect(track).toHaveAttribute('role', 'progressbar');
      expect(track).toHaveAttribute('aria-valuenow', '60');
      expect(track).toHaveAttribute('aria-valuemin', '0');
      expect(track).toHaveAttribute('aria-valuemax', '100');
    });

    test('should set correct aria-label when no custom label', () => {
      render(<ProgressBar value={45} />);

      const track = screen.getByRole('progressbar');
      expect(track).toHaveAttribute('aria-label', 'Progress: 45%');
    });

    test('should use display label as aria-label when available', () => {
      render(<ProgressBar value={45} label='Custom Progress' />);

      const track = screen.getByRole('progressbar');
      expect(track).toHaveAttribute('aria-label', 'Custom Progress');
    });

    test('should use percentage label as aria-label when showLabel is true', () => {
      render(<ProgressBar value={33.7} showLabel={true} />);

      const track = screen.getByRole('progressbar');
      expect(track).toHaveAttribute('aria-label', '34%');
    });

    test('should render progress bar with correct width style', () => {
      render(<ProgressBar value={80} />);

      const track = screen.getByRole('progressbar');
      const bar = track.querySelector('.progressBar__bar');
      expect(bar).toHaveStyle({ width: '80%' });
    });

    test('should round aria-valuenow but preserve exact width', () => {
      render(<ProgressBar value={33.7} />);

      const track = screen.getByRole('progressbar');
      const bar = track.querySelector('.progressBar__bar');

      expect(track).toHaveAttribute('aria-valuenow', '33.7'); // Exact value
      expect(bar).toHaveStyle({ width: '33.7%' }); // Exact width
      expect(track).toHaveAttribute('aria-label', 'Progress: 34%'); // Rounded for label
    });
  });

  describe('Children Content Rendering (Lines 77)', () => {
    test('should render children when provided', () => {
      render(
        <ProgressBar value={50}>
          <div data-testid='progress-content'>Additional content</div>
        </ProgressBar>
      );

      const content = screen.getByTestId('progress-content');
      expect(content).toBeInTheDocument();
      expect(content.parentElement).toHaveClass('progressBar__content');
    });

    test('should not render content wrapper when no children', () => {
      render(<ProgressBar value={50} />);

      const container = screen.getByRole('progressbar').parentElement;
      expect(container.querySelector('.progressBar__content')).not.toBeInTheDocument();
    });

    test('should render multiple children correctly', () => {
      render(
        <ProgressBar value={50}>
          <span>Status:</span>
          <strong>In Progress</strong>
        </ProgressBar>
      );

      const contentWrapper = screen.getByText('Status:').parentElement;
      expect(contentWrapper).toHaveClass('progressBar__content');
      expect(contentWrapper).toContainHTML('<span>Status:</span><strong>In Progress</strong>');
    });

    test('should handle various children types', () => {
      const { rerender } = render(<ProgressBar value={50}>Text content</ProgressBar>);

      expect(screen.getByText('Text content')).toBeInTheDocument();
      const contentWrapper = document.querySelector('.progressBar__content');
      expect(contentWrapper).toHaveClass('progressBar__content');

      rerender(
        <ProgressBar value={50}>
          <button>Action</button>
        </ProgressBar>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
      const contentWrapper2 = document.querySelector('.progressBar__content');
      expect(contentWrapper2).toHaveClass('progressBar__content');

      rerender(<ProgressBar value={50}>{null}</ProgressBar>);

      const container = screen.getByRole('progressbar').parentElement;
      expect(container.querySelector('.progressBar__content')).not.toBeInTheDocument();
    });
  });

  describe('Prop Variations and Edge Cases', () => {
    test('should handle all variants correctly', () => {
      Object.entries(PROGRESS_BAR_VARIANTS).forEach(([_, variantValue]) => {
        const { unmount } = render(<ProgressBar variant={variantValue} value={50} />);

        const progressBar = screen.getByRole('progressbar');
        const bar = progressBar.querySelector('.progressBar__bar');
        expect(bar).toHaveClass(`progressBar__bar--${variantValue}`);

        unmount();
      });
    });

    test('should handle all sizes correctly', () => {
      Object.entries(PROGRESS_BAR_SIZES).forEach(([_, sizeValue]) => {
        const { unmount } = render(<ProgressBar size={sizeValue} value={50} />);

        const container = screen.getByRole('progressbar').parentElement;
        expect(container).toHaveClass(`progressBar--${sizeValue}`);

        unmount();
      });
    });

    test('should use default props when not specified', () => {
      render(<ProgressBar />);

      const container = screen.getByRole('progressbar').parentElement;
      const bar = screen.getByRole('progressbar').querySelector('.progressBar__bar');

      // Default value = 0
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');

      // Default variant = primary
      expect(bar).toHaveClass('progressBar__bar--primary');

      // Default size = medium
      expect(container).toHaveClass('progressBar--medium');

      // Default animated = true
      expect(bar).toHaveClass('progressBar__bar--animated');

      // Default showLabel = false
      expect(screen.queryByText('0%')).not.toBeInTheDocument();
    });

    test('should handle extreme values correctly', () => {
      const extremeValues = [
        { input: -1000, expected: 0 },
        { input: 1000, expected: 100 },
        { input: Number.NEGATIVE_INFINITY, expected: 0 },
        { input: Number.POSITIVE_INFINITY, expected: 100 },
        { input: NaN, expected: NaN }, // Math.max/Math.min with NaN returns NaN
      ];

      extremeValues.forEach(({ input, expected }) => {
        const { unmount } = render(<ProgressBar value={input} />);

        const progressBar = screen.getByRole('progressbar');
        if (isNaN(expected)) {
          expect(progressBar).toHaveAttribute('aria-valuenow', 'NaN');
        } else {
          expect(progressBar).toHaveAttribute('aria-valuenow', expected.toString());
        }

        const bar = progressBar.querySelector('.progressBar__bar');
        if (isNaN(expected)) {
          expect(bar).toHaveStyle({ width: 'NaN%' });
        } else {
          expect(bar).toHaveStyle({ width: `${expected}%` });
        }

        unmount();
      });
    });
  });

  describe('Integration Tests', () => {
    test('should work with all props combined', () => {
      render(
        <ProgressBar
          value={65.7}
          variant={PROGRESS_BAR_VARIANTS.SUCCESS}
          size={PROGRESS_BAR_SIZES.LARGE}
          animated={true}
          showLabel={true}
          label='Custom Success Label'
          className='custom-progress-bar'
        >
          <div data-testid='progress-content'>Success content</div>
        </ProgressBar>
      );

      // Container
      const container = screen.getByRole('progressbar').parentElement;
      expect(container).toHaveClass('progressBar');
      expect(container).toHaveClass('progressBar--large');
      expect(container).toHaveClass('custom-progress-bar');

      // Progress bar
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '65.7');
      expect(progressBar).toHaveAttribute('aria-label', 'Custom Success Label');

      // Bar
      const bar = progressBar.querySelector('.progressBar__bar');
      expect(bar).toHaveClass('progressBar__bar');
      expect(bar).toHaveClass('progressBar__bar--success');
      expect(bar).toHaveClass('progressBar__bar--animated');
      expect(bar).toHaveStyle({ width: '65.7%' });

      // Label
      expect(screen.getByText('Custom Success Label')).toBeInTheDocument();

      // Content
      expect(screen.getByTestId('progress-content')).toBeInTheDocument();
    });

    test('should handle multiple className values', () => {
      render(<ProgressBar className='class1 class2 class3' />);

      const container = screen.getByRole('progressbar').parentElement;
      expect(container).toHaveClass('class1');
      expect(container).toHaveClass('class2');
      expect(container).toHaveClass('class3');
    });
  });
});
