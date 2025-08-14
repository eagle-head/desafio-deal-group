import React, { useState, useEffect } from 'react';
import ColorSwatch from './ColorSwatch';

const ColorCustomizer = ({ theme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const primaryColors = ['#2563eb', '#dc2626', '#16a34a', '#7c3aed', '#ea580c'];
  const accentColors = ['#60a5fa', '#f87171', '#4ade80', '#a78bfa', '#fb923c'];

  const styles = {
    container: {
      position: 'fixed',
      bottom: '2rem',
      right: '1rem',
      zIndex: 100,
      animation: 'slideUp 0.5s ease-out 0.5s both',
    },
    fab: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      background:
        'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      boxShadow: isHovered ? '0 12px 24px rgba(37, 99, 235, 0.3)' : 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'var(--transition)',
      fontSize: '1.5rem',
      transform: isOpen 
        ? 'rotate(45deg)' 
        : isHovered 
          ? 'scale(1.1) rotate(90deg)' 
          : 'rotate(0deg)',
    },
    menu: {
      position: 'absolute',
      bottom: '70px',
      right: '0',
      background: 'var(--surface)',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-lg)',
      minWidth: '240px',
      transform: isOpen ? 'scale(1)' : 'scale(0)',
      transformOrigin: 'bottom right',
      transition: 'var(--transition)',
      opacity: isOpen ? 1 : 0,
    },
    title: {
      fontSize: '0.875rem',
      marginBottom: '1rem',
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    option: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      fontSize: '0.75rem',
      color: 'var(--text-secondary)',
      marginBottom: '0.5rem',
      fontWeight: '500',
    },
    picker: {
      display: 'flex',
      gap: '0.5rem',
    },
  };

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
    <div style={styles.container} className='color-customizer fab-container'>
      <button 
        style={styles.fab} 
        className={`fab ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        ⚙
      </button>
      <div style={styles.menu} className={`color-menu ${isOpen ? 'active' : ''}`}>
        <h3 style={styles.title}>Personalizar Cores</h3>
        <div style={styles.option}>
          <label style={styles.label}>Tema Principal</label>
          <div style={styles.picker}>
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
        <div style={styles.option}>
          <label style={styles.label}>Cor de Destaque</label>
          <div style={styles.picker}>
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