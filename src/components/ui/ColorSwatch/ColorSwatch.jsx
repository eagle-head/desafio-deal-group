import './color-swatch.css';

function ColorSwatch({ color, type, value, isActive, onClick }) {
  const getSwatchClasses = function () {
    const classes = ['color-swatch'];
    if (isActive) classes.push('active');
    return classes.join(' ');
  };

  return (
    <div
      className={getSwatchClasses()}
      style={{ background: color }}
      onClick={function () {
        onClick(type, value);
      }}
    />
  );
}

export default ColorSwatch;
