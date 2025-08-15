import { Settings } from 'lucide-react';
import { Icon, ICON_SIZES, ICON_VARIANTS } from '../../ui';
import ColorSwatch from '../../ui/ColorSwatch/ColorSwatch';
import { useColorPalettes, useFloatingActionButton } from '../../../hooks';
import './color-customizer.css';

/**
 * Color customization component with floating action button interface
 *
 * Refactored for better separation of concerns:
 * - UI logic extracted to custom hooks
 * - Color palettes managed separately
 * - Reusable outside click handling
 * - Cleaner component structure
 *
 * @param {Object} props - The component props
 * @param {Object} props.theme - Current theme object with color properties
 * @param {string} props.theme.primary - Current primary theme color
 * @param {string} props.theme.accent - Current accent theme color
 * @param {function(string, string): void} props.onThemeChange - Callback function for theme changes, receives (type, color)
 *
 * @returns {JSX.Element} Floating action button with expandable color picker menu
 */
function ColorCustomizer({ theme, onThemeChange }) {
  const { getPaletteColors } = useColorPalettes();
  const { isOpen, isHovered, containerRef, handlers } = useFloatingActionButton();

  const primaryColors = getPaletteColors('primary');
  const accentColors = getPaletteColors('accent');

  const fabClasses = ['color-customizer__fab', isOpen && 'active', isHovered && 'hovered'].filter(Boolean).join(' ');

  const menuClasses = ['color-customizer__menu', isOpen && 'active'].filter(Boolean).join(' ');

  return (
    <div className='color-customizer fab-container' ref={containerRef}>
      <button
        className={fabClasses}
        onClick={handlers.onFabClick}
        onMouseEnter={handlers.onMouseEnter}
        onMouseLeave={handlers.onMouseLeave}
        aria-label='Customize colors'
        aria-expanded={isOpen}
      >
        <Icon icon={Settings} size={ICON_SIZES.MEDIUM} variant={ICON_VARIANTS.DEFAULT} ariaLabel='Customize colors' />
      </button>

      <ColorPickerMenu
        isOpen={isOpen}
        className={menuClasses}
        theme={theme}
        primaryColors={primaryColors}
        accentColors={accentColors}
        onThemeChange={onThemeChange}
      />
    </div>
  );
}

/**
 * Separated color picker menu component
 * Handles the rendering of color selection interface
 */
function ColorPickerMenu({ className, theme, primaryColors, accentColors, onThemeChange }) {
  return (
    <div className={className}>
      <h3 className='color-customizer__title'>Customize Colors</h3>

      <ColorSection
        label='Primary Theme'
        colors={primaryColors}
        type='primary'
        activeColor={theme.primary}
        onThemeChange={onThemeChange}
      />

      <ColorSection
        label='Accent Color'
        colors={accentColors}
        type='accent'
        activeColor={theme.accent}
        onThemeChange={onThemeChange}
      />
    </div>
  );
}

/**
 * Reusable color section component
 * Renders a labeled group of color swatches
 */
function ColorSection({ label, colors, type, activeColor, onThemeChange }) {
  return (
    <div className='color-customizer__option'>
      <label className='color-customizer__label'>{label}</label>
      <div className='color-customizer__picker'>
        {colors.map((color, index) => (
          <ColorSwatch
            key={`${type}-${index}`}
            color={color}
            type={type}
            value={color}
            isActive={activeColor === color}
            onClick={onThemeChange}
          />
        ))}
      </div>
    </div>
  );
}

export default ColorCustomizer;
