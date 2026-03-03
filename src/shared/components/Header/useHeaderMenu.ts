import { useState, useCallback, useRef } from 'react';

interface UseHeaderMenuReturn {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  handleMouseEnterTrigger: () => void;
  handleMouseLeaveTrigger: () => void;
  handleMouseEnterMenu: () => void;
  handleMouseLeaveMenu: () => void;
}

/**
 * Manages hover-based dropdown menu state.
 * Uses a small delay on close so the user can move the mouse
 * from the trigger to the menu without it disappearing.
 */
export const useHeaderMenu = (): UseHeaderMenuReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    cancelClose();
    setIsOpen(true);
  }, [cancelClose]);

  const closeMenu = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 120);
  }, []);

  const handleMouseEnterTrigger = useCallback(() => openMenu(), [openMenu]);
  const handleMouseLeaveTrigger = useCallback(() => closeMenu(), [closeMenu]);
  const handleMouseEnterMenu = useCallback(() => cancelClose(), [cancelClose]);
  const handleMouseLeaveMenu = useCallback(() => closeMenu(), [closeMenu]);

  return {
    isOpen,
    openMenu,
    closeMenu,
    handleMouseEnterTrigger,
    handleMouseLeaveTrigger,
    handleMouseEnterMenu,
    handleMouseLeaveMenu,
  };
};
