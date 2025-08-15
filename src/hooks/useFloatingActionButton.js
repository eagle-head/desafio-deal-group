import useToggle from './useToggle';
import useClickOutside from './useClickOutside';

/**
 * Custom hook for floating action button functionality
 * Combines toggle state with outside click handling
 */
function useFloatingActionButton() {
  const [isOpen, { toggle: toggleOpen, setFalse: close }] = useToggle(false);
  const [isHovered, { setTrue: setHovered, setFalse: setNotHovered }] = useToggle(false);

  const containerRef = useClickOutside(close, isOpen);

  const handleFabClick = () => {
    toggleOpen();
  };

  const handleMouseEnter = () => {
    setHovered();
  };

  const handleMouseLeave = () => {
    setNotHovered();
  };

  return {
    isOpen,
    isHovered,
    containerRef,
    handlers: {
      onFabClick: handleFabClick,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClose: close,
    },
  };
}

export default useFloatingActionButton;
