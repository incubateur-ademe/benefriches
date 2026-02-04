import { useEffect, useRef, useState } from "react";

export function useProjectTileMenu() {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const closeMenu = () => {
    setIsMenuOpened(false);
    menuButtonRef.current?.focus();
  };

  const openMenu = () => {
    setIsMenuOpened(true);
    menuButtonRef.current?.focus();
  };

  useEffect(() => {
    const handleOutsideInteraction = (e: MouseEvent | FocusEvent) => {
      const target = e.target as Node;

      if (
        isMenuOpened &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !menuButtonRef.current?.contains(target)
      ) {
        closeMenu();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpened) {
        closeMenu();
      }
    };

    if (isMenuOpened) {
      document.addEventListener("mousedown", handleOutsideInteraction);
      document.addEventListener("focusin", handleOutsideInteraction);
      document.addEventListener("keydown", handleEscape);

      menuButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("focusin", handleOutsideInteraction);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpened]);

  return {
    isMenuOpened,
    openMenu,
    menuRef,
    menuButtonRef,
    closeMenu,
  };
}
