import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColorCustomizer from '../ColorCustomizer/ColorCustomizer';
import useFloatingActionButton from '../../../hooks/useFloatingActionButton';

// Mock the CSS import
vi.mock('../ColorCustomizer/color-customizer.css', () => ({}));

// Mock lucide-react Settings icon
vi.mock('lucide-react', () => ({
  Settings: vi.fn(() => <svg data-testid='settings-icon' />),
}));

// Mock Icon component
vi.mock('../../ui', () => ({
  Icon: vi.fn(({ icon: _, size, variant, ariaLabel }) => (
    <div data-testid='icon-component' data-size={size} data-variant={variant} aria-label={ariaLabel} />
  )),
  ICON_SIZES: {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    EXTRA_LARGE: 'extra-large',
  },
  ICON_VARIANTS: {
    DEFAULT: 'default',
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger',
    MUTED: 'muted',
  },
}));

// Mock ColorSwatch component
vi.mock('../../ui/ColorSwatch/ColorSwatch', () => ({
  default: vi.fn(({ color, type, value, isActive, onClick }) => (
    <div
      data-testid={`color-swatch-${type}-${value}`}
      data-color={color}
      data-type={type}
      data-value={value}
      data-active={isActive}
      onClick={() => onClick && onClick(type, value)}
      className={`color-swatch ${isActive ? 'active' : ''}`}
    />
  )),
}));

// Create mock functions for hooks
const mockGetPaletteColors = vi.fn();
const mockHandlers = {
  onFabClick: vi.fn(),
  onMouseEnter: vi.fn(),
  onMouseLeave: vi.fn(),
  onClose: vi.fn(),
};

// Mock custom hooks
vi.mock('../../../hooks/useColorPalettes', () => ({
  default: () => ({
    getPaletteColors: mockGetPaletteColors,
  }),
}));

vi.mock('../../../hooks/useFloatingActionButton', () => ({
  default: vi.fn(),
}));

describe('ColorCustomizer Component', () => {
  let defaultProps;
  let mockOnThemeChange;
  const mockUseFloatingActionButton = vi.mocked(useFloatingActionButton);

  beforeEach(() => {
    mockOnThemeChange = vi.fn();

    defaultProps = {
      theme: {
        primary: '#2563eb',
        accent: '#60a5fa',
      },
      onThemeChange: mockOnThemeChange,
    };

    // Setup default mock implementations
    mockGetPaletteColors.mockImplementation(type => {
      if (type === 'primary') {
        return ['#2563eb', '#dc2626', '#7c3aed', '#ea580c'];
      }
      if (type === 'accent') {
        return ['#60a5fa', '#f87171', '#a78bfa', '#fb923c'];
      }
      return [];
    });

    mockUseFloatingActionButton.mockReturnValue({
      isOpen: false,
      isHovered: false,
      containerRef: { current: null },
      handlers: mockHandlers,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('should render main container with correct class and structure', () => {
      const { container } = render(<ColorCustomizer {...defaultProps} />);

      const fabContainer = container.querySelector('.color-customizer.fab-container');
      expect(fabContainer).toBeInTheDocument();
      expect(fabContainer.tagName).toBe('DIV');
    });

    test('should render FAB button with correct structure', () => {
      render(<ColorCustomizer {...defaultProps} />);

      const fabButton = screen.getByRole('button');
      expect(fabButton).toBeInTheDocument();
      expect(fabButton).toHaveAttribute('aria-label', 'Customize colors');
      expect(fabButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('should render Settings icon inside FAB button', () => {
      render(<ColorCustomizer {...defaultProps} />);

      expect(screen.getByTestId('icon-component')).toBeInTheDocument();
    });

    test('should render ColorPickerMenu component', () => {
      const { container } = render(<ColorCustomizer {...defaultProps} />);

      const menu = container.querySelector('.color-customizer__menu');
      expect(menu).toBeInTheDocument();
    });
  });

  describe('Hook Integration', () => {
    test('should get primary and accent colors from palette hook', () => {
      render(<ColorCustomizer {...defaultProps} />);

      expect(mockGetPaletteColors).toHaveBeenCalledWith('primary');
      expect(mockGetPaletteColors).toHaveBeenCalledWith('accent');
    });
  });

  describe('FAB Button Classes', () => {
    test('should apply correct base classes', () => {
      const { container } = render(<ColorCustomizer {...defaultProps} />);

      const fabButton = container.querySelector('.color-customizer__fab');
      expect(fabButton).toHaveClass('color-customizer__fab');
    });

    test('should apply active class when isOpen is true', () => {
      mockUseFloatingActionButton.mockReturnValue({
        isOpen: true,
        isHovered: false,
        containerRef: { current: null },
        handlers: mockHandlers,
      });

      const { container } = render(<ColorCustomizer {...defaultProps} />);
      const fabButton = container.querySelector('.color-customizer__fab');

      expect(fabButton).toHaveClass('color-customizer__fab', 'active');
    });

    test('should apply hovered class when isHovered is true', () => {
      mockUseFloatingActionButton.mockReturnValue({
        isOpen: false,
        isHovered: true,
        containerRef: { current: null },
        handlers: mockHandlers,
      });

      const { container } = render(<ColorCustomizer {...defaultProps} />);
      const fabButton = container.querySelector('.color-customizer__fab');

      expect(fabButton).toHaveClass('color-customizer__fab', 'hovered');
    });

    test('should apply both active and hovered classes when both states are true', () => {
      mockUseFloatingActionButton.mockReturnValue({
        isOpen: true,
        isHovered: true,
        containerRef: { current: null },
        handlers: mockHandlers,
      });

      const { container } = render(<ColorCustomizer {...defaultProps} />);
      const fabButton = container.querySelector('.color-customizer__fab');

      expect(fabButton).toHaveClass('color-customizer__fab', 'active', 'hovered');
    });
  });

  describe('Menu Classes', () => {
    test('should apply base menu class', () => {
      const { container } = render(<ColorCustomizer {...defaultProps} />);
      const menu = container.querySelector('.color-customizer__menu');

      expect(menu).toHaveClass('color-customizer__menu');
    });

    test('should apply active class to menu when isOpen is true', () => {
      mockUseFloatingActionButton.mockReturnValue({
        isOpen: true,
        isHovered: false,
        containerRef: { current: null },
        handlers: mockHandlers,
      });

      const { container } = render(<ColorCustomizer {...defaultProps} />);
      const menu = container.querySelector('.color-customizer__menu');

      expect(menu).toHaveClass('color-customizer__menu', 'active');
    });
  });

  describe('Menu Structure', () => {
    test('should render menu with correct class', () => {
      const { container } = render(<ColorCustomizer {...defaultProps} />);

      const menu = container.querySelector('.color-customizer__menu');
      expect(menu).toHaveClass('color-customizer__menu');
    });
  });

  describe('Event Handlers', () => {
    test('should call onFabClick when button is clicked', async () => {
      const user = userEvent.setup();
      render(<ColorCustomizer {...defaultProps} />);

      const fabButton = screen.getByRole('button');
      await user.click(fabButton);

      expect(mockHandlers.onFabClick).toHaveBeenCalledTimes(1);
    });

    test('should call onMouseEnter when button is hovered', async () => {
      const user = userEvent.setup();
      render(<ColorCustomizer {...defaultProps} />);

      const fabButton = screen.getByRole('button');
      await user.hover(fabButton);

      expect(mockHandlers.onMouseEnter).toHaveBeenCalledTimes(1);
    });

    test('should call onMouseLeave when mouse leaves button', async () => {
      const user = userEvent.setup();
      render(<ColorCustomizer {...defaultProps} />);

      const fabButton = screen.getByRole('button');
      await user.hover(fabButton);
      await user.unhover(fabButton);

      expect(mockHandlers.onMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  describe('ColorPickerMenu Content', () => {
    test('should render menu title', () => {
      render(<ColorCustomizer {...defaultProps} />);

      expect(screen.getByText('Customize Colors')).toBeInTheDocument();
    });

    test('should render Primary Theme section', () => {
      render(<ColorCustomizer {...defaultProps} />);

      expect(screen.getByText('Primary Theme')).toBeInTheDocument();
    });

    test('should render Accent Color section', () => {
      render(<ColorCustomizer {...defaultProps} />);

      expect(screen.getByText('Accent Color')).toBeInTheDocument();
    });
  });

  describe('Color Swatches Integration', () => {
    test('should render primary color swatches', () => {
      render(<ColorCustomizer {...defaultProps} />);

      // Check that color swatches are rendered via our mock
      expect(screen.getByTestId('color-swatch-primary-#2563eb')).toBeInTheDocument();
      expect(screen.getByTestId('color-swatch-primary-#dc2626')).toBeInTheDocument();
      expect(screen.getByTestId('color-swatch-primary-#7c3aed')).toBeInTheDocument();
      expect(screen.getByTestId('color-swatch-primary-#ea580c')).toBeInTheDocument();
    });

    test('should render accent color swatches', () => {
      render(<ColorCustomizer {...defaultProps} />);

      // Check that accent color swatches are rendered via our mock
      expect(screen.getByTestId('color-swatch-accent-#60a5fa')).toBeInTheDocument();
      expect(screen.getByTestId('color-swatch-accent-#f87171')).toBeInTheDocument();
      expect(screen.getByTestId('color-swatch-accent-#a78bfa')).toBeInTheDocument();
      expect(screen.getByTestId('color-swatch-accent-#fb923c')).toBeInTheDocument();
    });

    test('should handle color swatch clicks for primary colors', () => {
      render(<ColorCustomizer {...defaultProps} />);

      const primarySwatch = screen.getByTestId('color-swatch-primary-#dc2626');
      fireEvent.click(primarySwatch);

      expect(mockOnThemeChange).toHaveBeenCalledWith('primary', '#dc2626');
    });

    test('should handle color swatch clicks for accent colors', () => {
      render(<ColorCustomizer {...defaultProps} />);

      const accentSwatch = screen.getByTestId('color-swatch-accent-#f87171');
      fireEvent.click(accentSwatch);

      expect(mockOnThemeChange).toHaveBeenCalledWith('accent', '#f87171');
    });
  });

  describe('Color Section Structure', () => {
    test('should render color section structure correctly', () => {
      const { container } = render(<ColorCustomizer {...defaultProps} />);

      // Check for primary section
      const primaryOption = container.querySelector('.color-customizer__option');
      expect(primaryOption).toBeInTheDocument();

      const primaryLabel = container.querySelector('.color-customizer__label');
      expect(primaryLabel).toBeInTheDocument();

      const primaryPicker = container.querySelector('.color-customizer__picker');
      expect(primaryPicker).toBeInTheDocument();

      // Check for all color sections
      const allOptions = container.querySelectorAll('.color-customizer__option');
      expect(allOptions).toHaveLength(2); // Primary and Accent sections
    });
  });

  describe('Props Handling', () => {
    test('should handle missing theme props gracefully', () => {
      const incompleteProps = {
        theme: {},
        onThemeChange: mockOnThemeChange,
      };

      expect(() => render(<ColorCustomizer {...incompleteProps} />)).not.toThrow();
    });

    test('should handle null theme properties', () => {
      const nullThemeProps = {
        theme: { primary: null, accent: null },
        onThemeChange: mockOnThemeChange,
      };

      expect(() => render(<ColorCustomizer {...nullThemeProps} />)).not.toThrow();
    });

    test('should handle missing onThemeChange prop', () => {
      const propsWithoutCallback = {
        theme: defaultProps.theme,
      };

      expect(() => render(<ColorCustomizer {...propsWithoutCallback} />)).not.toThrow();
    });
  });

  describe('Component Structure and JSDoc Coverage', () => {
    test('should render floating action button interface as documented', () => {
      render(<ColorCustomizer {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Customize colors');
      expect(button).toBeInTheDocument();
    });

    test('should implement color customization component functionality', () => {
      render(<ColorCustomizer {...defaultProps} />);

      // Verify main components are rendered
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByTestId('icon-component')).toBeInTheDocument();
    });

    test('should provide expandable color picker menu as documented', () => {
      const { container } = render(<ColorCustomizer {...defaultProps} />);

      const menu = container.querySelector('.color-customizer__menu');
      expect(menu).toBeInTheDocument();
      expect(screen.getByText('Customize Colors')).toBeInTheDocument();
    });

    test('should accept correct prop types as documented in JSDoc', () => {
      const docProps = {
        theme: {
          primary: '#2563eb',
          accent: '#60a5fa',
        },
        onThemeChange: vi.fn(),
      };

      expect(() => render(<ColorCustomizer {...docProps} />)).not.toThrow();
      expect(docProps.onThemeChange).toBeDefined();
      expect(typeof docProps.onThemeChange).toBe('function');
      expect(typeof docProps.theme.primary).toBe('string');
      expect(typeof docProps.theme.accent).toBe('string');
    });
  });

  describe('Accessibility', () => {
    test('should provide proper ARIA attributes for FAB button', () => {
      render(<ColorCustomizer {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Customize colors');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    test('should provide accessible labels for sections', () => {
      render(<ColorCustomizer {...defaultProps} />);

      expect(screen.getByText('Primary Theme')).toBeInTheDocument();
      expect(screen.getByText('Accent Color')).toBeInTheDocument();
    });

    test('should have proper heading hierarchy', () => {
      render(<ColorCustomizer {...defaultProps} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Customize Colors');
    });
  });

  describe('Integration with External Dependencies', () => {
    test('should properly integrate with Settings icon from lucide-react', () => {
      render(<ColorCustomizer {...defaultProps} />);

      // Verify the Settings icon is rendered via Icon component
      expect(screen.getByTestId('icon-component')).toBeInTheDocument();
    });

    test('should properly integrate with Icon component', () => {
      render(<ColorCustomizer {...defaultProps} />);

      // Verify the Icon component wrapper is working by checking the rendered icon
      expect(screen.getByTestId('icon-component')).toBeInTheDocument();
      expect(screen.getByRole('button')).toContainElement(screen.getByTestId('icon-component'));
    });

    test('should properly integrate with ColorSwatch component', () => {
      render(<ColorCustomizer {...defaultProps} />);

      // Verify ColorSwatch components are rendered
      expect(screen.getByTestId('color-swatch-primary-#2563eb')).toBeInTheDocument();
      expect(screen.getByTestId('color-swatch-accent-#60a5fa')).toBeInTheDocument();
    });
  });

  describe('CSS Class Management', () => {
    test('should properly filter and join FAB classes', () => {
      const { container } = render(<ColorCustomizer {...defaultProps} />);

      const fabButton = container.querySelector('.color-customizer__fab');
      expect(fabButton.className).toBe('color-customizer__fab');
    });

    test('should properly filter and join menu classes', () => {
      const { container } = render(<ColorCustomizer {...defaultProps} />);

      const menu = container.querySelector('.color-customizer__menu');
      expect(menu.className).toBe('color-customizer__menu');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty color palettes', () => {
      mockGetPaletteColors.mockReturnValue([]);

      expect(() => render(<ColorCustomizer {...defaultProps} />)).not.toThrow();
    });

    test('should handle component unmounting gracefully', () => {
      const { unmount } = render(<ColorCustomizer {...defaultProps} />);

      expect(() => unmount()).not.toThrow();
    });

    test('should maintain component stability across re-renders', () => {
      const { rerender } = render(<ColorCustomizer {...defaultProps} />);

      const button1 = screen.getByRole('button');
      expect(button1).toBeInTheDocument();

      rerender(<ColorCustomizer {...defaultProps} />);

      const button2 = screen.getByRole('button');
      expect(button2).toBeInTheDocument();
      expect(button2).toHaveAttribute('aria-label', 'Customize colors');
    });
  });
});
