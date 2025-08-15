import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Icon, ICON_SIZES, ICON_VARIANTS } from '../../ui';
import ColorSwatch from '../../ui/ColorSwatch/ColorSwatch';
import './color-customizer.css';

function ColorCustomizer({ theme, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const primaryColors = ['#2563eb', '#dc2626', '#16a34a', '#7c3aed', '#ea580c'];
  const accentColors = ['#60a5fa', '#f87171', '#4ade80', '#a78bfa', '#fb923c'];

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
        <Icon 
          icon={Settings} 
          size={ICON_SIZES.MEDIUM} 
          variant={ICON_VARIANTS.DEFAULT}
          ariaLabel="Personalizar cores"
        />
      </button>
      <div className={`color-customizer__menu ${isOpen ? 'active' : ''}`}>
        <h3 className='color-customizer__title'>Personalizar Cores</h3>
        <div className='color-customizer__option'>
          <label className='color-customizer__label'>Tema Principal</label>
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
          <label className='color-customizer__label'>Cor de Destaque</label>
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
