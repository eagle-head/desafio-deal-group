import React from 'react';
import './ColorSwatch.css';

const ColorSwatch = ({ color, type, value, isActive, onClick }) => {
  const getSwatchClasses = () => {
    const classes = ['color-swatch'];
    if (isActive) classes.push('active');
    return classes.join(' ');
  };

  return (
    <div
      className={getSwatchClasses()}
      style={{ background: color }}
      onClick={() => onClick(type, value)}
    />
  );
};

export default ColorSwatch;
