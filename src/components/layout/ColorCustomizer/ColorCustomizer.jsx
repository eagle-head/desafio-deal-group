import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Icon, ICON_SIZES, ICON_VARIANTS } from '../../ui';
import ColorSwatch from '../../ui/ColorSwatch/ColorSwatch';
import './color-customizer.css';

/**
 * Color customization component with floating action button interface
 * 
 * Provides a floating action button (FAB) that opens a color picker menu
 * for customizing the application theme. Users can select different primary
 * and accent colors from predefined palettes. Includes click-outside handling
 * to close the menu and smooth animations.
 * 
 * @param {Object} props - The component props
 * @param {Object} props.theme - Current theme object with color properties
 * @param {string} props.theme.primary - Current primary theme color
 * @param {string} props.theme.accent - Current accent theme color
 * @param {function(string, string): void} props.onThemeChange - Callback function for theme changes, receives (type, color)
 * 
 * @returns {JSX.Element} Floating action button with expandable color picker menu
 * 
 * @example
 * <ColorCustomizer
 *   theme={{ primary: '#2563eb', accent: '#60a5fa' }}
 *   onThemeChange={(type, color) => updateTheme(type, color)}
 * />
 */
function ColorCustomizer({ theme, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const primaryColors = ['#2563eb', '#dc2626', '#7c3aed', '#ea580c'];
  const accentColors = ['#60a5fa', '#f87171', '#a78bfa', '#fb923c'];

  useEffect(function () {
    const handleClickOutside = function (e) {
      if (!e.target.closest('.color-customizer')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return function () {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='color-customizer fab-container'>
      <button
        className={`color-customizer__fab ${isOpen ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
        onClick={function () {
          setIsOpen(!isOpen);
        }}
        onMouseEnter={function () {
          setIsHovered(true);
        }}
        onMouseLeave={function () {
          setIsHovered(false);
        }}
      >
        <Icon icon={Settings} size={ICON_SIZES.MEDIUM} variant={ICON_VARIANTS.DEFAULT} ariaLabel='Customize colors' />
      </button>
      <div className={`color-customizer__menu ${isOpen ? 'active' : ''}`}>
        <h3 className='color-customizer__title'>Customize Colors</h3>
        <div className='color-customizer__option'>
          <label className='color-customizer__label'>Primary Theme</label>
          <div className='color-customizer__picker'>
            {primaryColors.map(function (color, index) {
              return (
                <ColorSwatch
                  key={`primary-${index}`}
                  color={color}
                  type='primary'
                  value={color}
                  isActive={theme.primary === color}
                  onClick={onThemeChange}
                />
              );
            })}
          </div>
        </div>
        <div className='color-customizer__option'>
          <label className='color-customizer__label'>Accent Color</label>
          <div className='color-customizer__picker'>
            {accentColors.map(function (color, index) {
              return (
                <ColorSwatch
                  key={`accent-${index}`}
                  color={color}
                  type='accent'
                  value={color}
                  isActive={theme.accent === color}
                  onClick={onThemeChange}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorCustomizer;
