import React, { useState } from 'react';

const ColorSwatch = ({ color, type, value, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    swatch: {
      width: '32px',
      height: '32px',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'var(--transition)',
      border: isActive
        ? '2px solid var(--text-primary)'
        : '2px solid transparent',
      background: color,
      transform: isActive || isHovered ? 'scale(1.1)' : 'scale(1)',
      boxShadow: isHovered ? 'var(--shadow-md)' : 'none',
    },
  };

  return (
    <div 
      style={styles.swatch} 
      className={`color-swatch ${isActive ? 'active' : ''}`}
      onClick={() => onClick(type, value)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};

export default ColorSwatch;