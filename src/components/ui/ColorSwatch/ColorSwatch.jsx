import './color-swatch.css';

/**
 * Reusable color swatch component for color selection interfaces
 * @param {Object} props
 * @param {string} props.color - CSS color value to display
 * @param {string} props.type - Category or type of color
 * @param {string} props.value - Identifier for this color option
 * @param {boolean} props.isActive - Whether this swatch is currently selected
 * @param {Function} props.onClick - Click handler that receives (type, value)
 *
 * @example
 * // Basic usage
 * <ColorSwatch
 *   color="#ff0000"
 *   type="primary"
 *   value="red"
 *   isActive={false}
 *   onClick={(type, value) => console.log(`Selected ${type}: ${value}`)}
 * />
 *
 * @example
 * // With active state
 * <ColorSwatch
 *   color="rgb(0, 255, 0)"
 *   type="accent"
 *   value="green"
 *   isActive={true}
 *   onClick={handleColorSelection}
 * />
 */
function ColorSwatch({ color, type, value, isActive, onClick }) {
  function getSwatchClasses() {
    const classes = ['color-swatch'];
    if (isActive) classes.push('active');

    return classes.join(' ');
  }

  return <div className={getSwatchClasses()} style={{ background: color }} onClick={() => onClick(type, value)} />;
}

export default ColorSwatch;
