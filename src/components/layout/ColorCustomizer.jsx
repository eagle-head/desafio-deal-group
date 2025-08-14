import React, { useState, useEffect } from 'react';
import ColorSwatch from '../ui/ColorSwatch';
import './ColorCustomizer.css';

const ColorCustomizer = ({ theme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const primaryColors = ['#2563eb', '#dc2626', '#16a34a', '#7c3aed', '#ea580c'];
  const accentColors = ['#60a5fa', '#f87171', '#4ade80', '#a78bfa', '#fb923c'];

  useEffect(() => {
    const handleClickOutside = e => {
      if (!e.target.closest('.color-customizer')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className='color-customizer fab-container'>
      <button
        className={`color-customizer__fab ${isOpen ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        ⚙
      </button>
      <div className={`color-customizer__menu ${isOpen ? 'active' : ''}`}>
        <h3 className='color-customizer__title'>Personalizar Cores</h3>
        <div className='color-customizer__option'>
          <label className='color-customizer__label'>Tema Principal</label>
          <div className='color-customizer__picker'>
            {primaryColors.map((color, index) => (
              <ColorSwatch
                key={`primary-${index}`}
                color={color}
                type='primary'
                value={color}
                isActive={theme.primary === color}
                onClick={onThemeChange}
              />
            ))}
          </div>
        </div>
        <div className='color-customizer__option'>
          <label className='color-customizer__label'>Cor de Destaque</label>
          <div className='color-customizer__picker'>
            {accentColors.map((color, index) => (
              <ColorSwatch
                key={`accent-${index}`}
                color={color}
                type='accent'
                value={color}
                isActive={theme.accent === color}
                onClick={onThemeChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorCustomizer;
