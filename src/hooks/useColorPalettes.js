import { useMemo } from 'react';

/**
 * Custom hook for managing color palette configurations
 * Centralizes color definitions and allows for easy extensibility
 */
function useColorPalettes() {
  const palettes = useMemo(
    () => ({
      primary: [
        { name: 'Blue', value: '#2563eb' },
        { name: 'Red', value: '#dc2626' },
        { name: 'Purple', value: '#7c3aed' },
        { name: 'Orange', value: '#ea580c' },
      ],
      accent: [
        { name: 'Light Blue', value: '#60a5fa' },
        { name: 'Light Red', value: '#f87171' },
        { name: 'Light Purple', value: '#a78bfa' },
        { name: 'Light Orange', value: '#fb923c' },
      ],
    }),
    []
  );

  const getPaletteColors = type => palettes[type]?.map(color => color.value) || [];

  const getColorName = (type, value) => {
    return palettes[type]?.find(color => color.value === value)?.name || value;
  };

  return {
    palettes,
    getPaletteColors,
    getColorName,
  };
}

export default useColorPalettes;
