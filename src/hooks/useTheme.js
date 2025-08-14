import { useState } from 'react';
import { adjustBrightness } from '../utils/colorUtils';

const useTheme = () => {
  const [theme, setTheme] = useState({
    primary: '#2563eb',
    accent: '#60a5fa',
  });

  const updateTheme = (type, color) => {
    setTheme(prev => ({ ...prev, [type]: color }));
    document.documentElement.style.setProperty(`--${type}-color`, color);
    if (type === 'primary') {
      const darker = adjustBrightness(color, -20);
      document.documentElement.style.setProperty('--secondary-color', darker);
    }
  };

  return { theme, updateTheme };
};

export default useTheme;
