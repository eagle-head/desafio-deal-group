import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Badge } from '../Badge/Badge';
import { BADGE_VARIANTS, BADGE_SIZES, BADGE_POSITIONS } from '../Badge/constants';

// Mock CSS modules
vi.mock('../Badge/Badge.module.css', () => ({
  default: {
    badge: 'badge',
    'badge--primary': 'badge--primary',
    'badge--secondary': 'badge--secondary',
    'badge--success': 'badge--success',
    'badge--warning': 'badge--warning',
    'badge--error': 'badge--error',
    'badge--info': 'badge--info',
    'badge--player-x': 'badge--player-x',
    'badge--player-o': 'badge--player-o',
    'badge--small': 'badge--small',
    'badge--medium': 'badge--medium',
    'badge--large': 'badge--large',
    'badge--dot': 'badge--dot',
    'badge--overlay': 'badge--overlay',
    'badge--top-right': 'badge--top-right',
    'badge--top-left': 'badge--top-left',
    'badge--bottom-right': 'badge--bottom-right',
    'badge--bottom-left': 'badge--bottom-left',
    'badge--animated': 'badge--animated',
    'badge--pulse': 'badge--pulse',
    badgeContainer: 'badgeContainer',
  },
}));

describe('Badge Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('should render standalone badge with content', () => {
      render(<Badge content='Test' />);

      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Test');
    });

    test('should render with default props', () => {
      render(<Badge content='Default' />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge');
      expect(badge).toHaveClass('badge--primary'); // Default variant
      expect(badge).toHaveClass('badge--medium'); // Default size
      expect(badge).toHaveClass('badge--animated'); // Default animated
    });

    test('should render without content when showDot is true', () => {
      render(<Badge showDot />);

      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toBeEmptyDOMElement();
      expect(badge).toHaveClass('badge--dot');
    });

    test('should render overlay badge with children', () => {
      render(
        <Badge content='5' position={BADGE_POSITIONS.TOP_RIGHT}>
          <button>Messages</button>
        </Badge>
      );

      const container = screen.getByText('Messages').parentElement;
      expect(container).toHaveClass('badgeContainer');

      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('5');
      expect(badge).toHaveClass('badge--overlay');
      expect(badge).toHaveClass('badge--top-right');
    });
  });

  describe('Variant Prop', () => {
    test.each(Object.entries(BADGE_VARIANTS))('should render %s variant correctly', (variantName, variantValue) => {
      render(<Badge content='Test' variant={variantValue} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(`badge--${variantValue}`);
    });

    test('should use primary variant as default', () => {
      render(<Badge content='Test' />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--primary');
    });
  });

  describe('Size Prop', () => {
    test.each(Object.entries(BADGE_SIZES))('should render %s size correctly', (sizeName, sizeValue) => {
      render(<Badge content='Test' size={sizeValue} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(`badge--${sizeValue}`);
    });

    test('should use medium size as default', () => {
      render(<Badge content='Test' />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--medium');
    });
  });

  describe('Position Prop', () => {
    test.each(Object.entries(BADGE_POSITIONS))('should render %s position correctly', (positionName, positionValue) => {
      render(
        <Badge content='5' position={positionValue}>
          <div>Content</div>
        </Badge>
      );

      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(`badge--${positionValue}`);
      expect(badge).toHaveClass('badge--overlay');
    });

    test('should apply position class even without children but not overlay class', () => {
      render(<Badge content='5' position={BADGE_POSITIONS.TOP_RIGHT} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--top-right');
      expect(badge).not.toHaveClass('badge--overlay');
    });
  });

  describe('Content Type Detection', () => {
    test('should detect dot content type', () => {
      render(<Badge showDot />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('data-content-type', 'dot');
    });

    test('should detect icon content type', () => {
      const iconElement = <span>📧</span>;
      render(<Badge content={iconElement} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('data-content-type', 'icon');
    });

    test('should detect single-char content type for short strings', () => {
      render(<Badge content='A' />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('data-content-type', 'single-char');
    });

    test('should detect single-char content type for two characters', () => {
      render(<Badge content='AB' />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('data-content-type', 'single-char');
    });

    test('should detect single-char content type for numbers', () => {
      render(<Badge content={42} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('data-content-type', 'single-char');
    });

    test('should detect text content type for longer strings', () => {
      render(<Badge content='Hello World' />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('data-content-type', 'text');
    });

    test('should return null content type for empty content', () => {
      render(<Badge content='' />);

      const badge = screen.getByRole('status');
      expect(badge).not.toHaveAttribute('data-content-type');
    });
  });

  describe('Max Value Handling', () => {
    test('should display original content when under max', () => {
      render(<Badge content={5} max={10} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('5');
    });

    test('should display max+ when content exceeds max', () => {
      render(<Badge content={15} max={10} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('10+');
    });

    test('should display max+ when content equals max + 1', () => {
      render(<Badge content={100} max={99} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('99+');
    });

    test('should not format non-numeric content with max', () => {
      render(<Badge content='NEW' max={99} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('NEW');
    });

    test('should handle max with zero value', () => {
      render(<Badge content={0} max={5} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('0');
    });
  });

  describe('Animation Props', () => {
    test('should apply animated class by default', () => {
      render(<Badge content='Test' />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--animated');
    });

    test('should not apply animated class when animated is false', () => {
      render(<Badge content='Test' animated={false} />);

      const badge = screen.getByRole('status');
      expect(badge).not.toHaveClass('badge--animated');
    });

    test('should apply pulse class when pulse is true', () => {
      render(<Badge content='Test' pulse />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--pulse');
    });

    test('should not apply pulse class by default', () => {
      render(<Badge content='Test' />);

      const badge = screen.getByRole('status');
      expect(badge).not.toHaveClass('badge--pulse');
    });

    test('should apply both animated and pulse classes', () => {
      render(<Badge content='Test' animated pulse />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge--animated');
      expect(badge).toHaveClass('badge--pulse');
    });
  });

  describe('Custom ClassName', () => {
    test('should apply custom className', () => {
      render(<Badge content='Test' className='custom-badge' />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('custom-badge');
      expect(badge).toHaveClass('badge'); // Should still have base class
    });

    test('should handle multiple custom classes', () => {
      render(<Badge content='Test' className='custom1 custom2' />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('custom1');
      expect(badge).toHaveClass('custom2');
    });

    test('should work with empty className', () => {
      render(<Badge content='Test' className='' />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge');
    });
  });

  describe('Accessibility', () => {
    test('should have role="status"', () => {
      render(<Badge content='Test' />);

      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });

    test('should have default aria-label for content badges', () => {
      render(<Badge content='5' />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Badge: 5');
    });

    test('should have default aria-label for dot badges', () => {
      render(<Badge showDot />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Notification indicator');
    });

    test('should use custom aria-label when provided', () => {
      render(<Badge content='5' ariaLabel='5 new messages' />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', '5 new messages');
    });

    test('should handle aria-label with max formatted content', () => {
      render(<Badge content={150} max={99} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Badge: 99+');
    });
  });

  describe('Forwarded Ref', () => {
    test('should forward ref to badge element', () => {
      const ref = { current: null };

      render(<Badge ref={ref} content='Test' />);

      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveClass('badge');
    });

    test('should forward ref to badge element in overlay mode', () => {
      const ref = { current: null };

      render(
        <Badge ref={ref} content='5' position={BADGE_POSITIONS.TOP_RIGHT}>
          <div>Content</div>
        </Badge>
      );

      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveClass('badge');
    });
  });

  describe('Display Name', () => {
    test('should have correct displayName', () => {
      expect(Badge.displayName).toBe('Badge');
    });
  });

  describe('Additional Props', () => {
    test('should pass through additional props', () => {
      render(<Badge content='Test' data-testid='custom-badge' title='Badge title' />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('data-testid', 'custom-badge');
      expect(badge).toHaveAttribute('title', 'Badge title');
    });

    test('should handle event handlers', () => {
      const handleClick = vi.fn();
      render(<Badge content='Test' onClick={handleClick} />);

      const badge = screen.getByRole('status');
      badge.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Complex Combinations', () => {
    test('should handle all props together correctly', () => {
      render(
        <Badge
          content={150}
          variant={BADGE_VARIANTS.ERROR}
          size={BADGE_SIZES.LARGE}
          position={BADGE_POSITIONS.TOP_RIGHT}
          max={99}
          animated={false}
          pulse
          className='custom-class'
          ariaLabel='Error notification'
        >
          <button>Action</button>
        </Badge>
      );

      const badge = screen.getByRole('status');

      // Content formatting
      expect(badge).toHaveTextContent('99+');

      // Classes
      expect(badge).toHaveClass('badge');
      expect(badge).toHaveClass('badge--error');
      expect(badge).toHaveClass('badge--large');
      expect(badge).toHaveClass('badge--overlay');
      expect(badge).toHaveClass('badge--top-right');
      expect(badge).toHaveClass('badge--pulse');
      expect(badge).toHaveClass('custom-class');
      expect(badge).not.toHaveClass('badge--animated');

      // Accessibility
      expect(badge).toHaveAttribute('aria-label', 'Error notification');

      // Container structure
      const container = screen.getByText('Action').parentElement;
      expect(container).toHaveClass('badgeContainer');
    });

    test('should handle dot badge with all options', () => {
      render(
        <Badge
          showDot
          variant={BADGE_VARIANTS.SUCCESS}
          size={BADGE_SIZES.SMALL}
          pulse
          className='dot-indicator'
          ariaLabel='Online status'
        >
          <div>User</div>
        </Badge>
      );

      const badge = screen.getByRole('status');

      // No content displayed
      expect(badge).toBeEmptyDOMElement();

      // Classes
      expect(badge).toHaveClass('badge--dot');
      expect(badge).toHaveClass('badge--success');
      expect(badge).toHaveClass('badge--small');
      expect(badge).toHaveClass('badge--pulse');
      expect(badge).toHaveClass('dot-indicator');

      // Content type
      expect(badge).toHaveAttribute('data-content-type', 'dot');

      // Accessibility
      expect(badge).toHaveAttribute('aria-label', 'Online status');
    });
  });

  describe('Edge Cases', () => {
    test('should handle undefined content', () => {
      render(<Badge content={undefined} />);

      const badge = screen.getByRole('status');
      expect(badge).toBeEmptyDOMElement();
      expect(badge).not.toHaveAttribute('data-content-type');
    });

    test('should handle null content', () => {
      render(<Badge content={null} />);

      const badge = screen.getByRole('status');
      expect(badge).toBeEmptyDOMElement();
      expect(badge).not.toHaveAttribute('data-content-type');
    });

    test('should handle zero as content', () => {
      render(<Badge content={0} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('0');
      expect(badge).not.toHaveAttribute('data-content-type');
    });

    test('should handle boolean content', () => {
      render(<Badge content={true} />);

      const badge = screen.getByRole('status');
      expect(badge).toBeEmptyDOMElement(); // React doesn't render boolean true as text
      expect(badge).toHaveAttribute('data-content-type', 'text');
    });

    test('should handle object content (React element)', () => {
      const element = <strong>Bold</strong>;
      render(<Badge content={element} />);

      const badge = screen.getByRole('status');
      expect(badge).toContainHTML('<strong>Bold</strong>');
      expect(badge).toHaveAttribute('data-content-type', 'icon');
    });

    test('should handle array content', () => {
      render(<Badge content={[1, 2, 3]} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('123'); // React renders arrays without commas
    });

    test('should handle negative numbers', () => {
      render(<Badge content={-5} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('-5');
      expect(badge).toHaveAttribute('data-content-type', 'single-char');
    });

    test('should handle negative numbers with max', () => {
      render(<Badge content={-10} max={5} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('-10'); // Negative numbers don't get max formatting
    });

    test('should handle decimal numbers', () => {
      render(<Badge content={3.14} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('3.14');
      expect(badge).toHaveAttribute('data-content-type', 'single-char'); // Numbers are treated as single-char
    });

    test('should handle very large numbers with max', () => {
      render(<Badge content={999999} max={999} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('999+');
    });
  });

  describe('CSS Class Combinations', () => {
    test('should apply correct classes for standalone badge', () => {
      render(
        <Badge
          content='Test'
          variant={BADGE_VARIANTS.WARNING}
          size={BADGE_SIZES.SMALL}
          animated={false}
          className='extra-class'
        />
      );

      const badge = screen.getByRole('status');
      const expectedClasses = ['badge', 'badge--warning', 'badge--small', 'extra-class'];

      expectedClasses.forEach(className => {
        expect(badge).toHaveClass(className);
      });

      // Should not have overlay classes
      expect(badge).not.toHaveClass('badge--overlay');
      expect(badge).not.toHaveClass('badge--top-right');
      expect(badge).not.toHaveClass('badge--animated');
    });

    test('should filter out falsy classes correctly', () => {
      render(<Badge content='Test' className='' />);

      const badge = screen.getByRole('status');

      // Should not have empty string in class list
      const classList = badge.className.split(' ');
      expect(classList).not.toContain('');
      expect(classList).not.toContain(undefined);
      expect(classList).not.toContain(null);
    });
  });
});
