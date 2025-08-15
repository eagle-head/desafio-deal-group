import './color-swatch.css';

/**
 * Reusable color swatch component for color selection interfaces
 *
 * Displays a clickable color preview that can be selected for theme customization.
 * Shows visual feedback for the currently active selection and handles click
 * events to notify parent components of color selection changes.
 *
 * @param {Object} props - The component props
 * @param {string} props.color - CSS color value to display (hex, rgb, hsl, named colors)
 * @param {string} props.type - Category or type of color (e.g., 'primary', 'accent')
 * @param {string} props.value - Identifier for this color option
 * @param {boolean} props.isActive - Whether this swatch is currently selected
 * @param {function(string, string): void} props.onClick - Click handler that receives (type, value)
 *
 * @returns {JSX.Element} A clickable color swatch element
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
