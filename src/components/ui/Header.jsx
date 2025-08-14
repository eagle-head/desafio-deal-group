import React from 'react';

const Header = () => {
  const styles = {
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
      animation: 'slideDown 0.5s ease-out',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      background:
        'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '0.5rem',
    },
    subtitle: {
      color: 'var(--text-secondary)',
      fontSize: '0.875rem',
    },
  };

  return (
    <header style={styles.header} className="header">
      <h1 style={styles.title}>Jogo da Velha</h1>
      <p style={styles.subtitle}>Desafio técnico - Front-End React</p>
    </header>
  );
};

export default Header;