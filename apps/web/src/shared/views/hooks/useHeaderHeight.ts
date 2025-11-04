import { useEffect, useState } from "react";

export function useHeaderHeight(): number {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerElement = document.querySelector("header.fr-header");
      if (headerElement) {
        const height = headerElement.getBoundingClientRect().height;
        setHeaderHeight(height);
      }
    };

    updateHeaderHeight();
    const timeoutId = setTimeout(updateHeaderHeight, 100);

    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  return headerHeight;
}
