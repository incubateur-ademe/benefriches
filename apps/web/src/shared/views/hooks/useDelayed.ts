import { useEffect, useState } from "react";

/** Returns true after `delayMs` once `condition` becomes true, resets to false when it becomes false. */
export function useDelayed(condition: boolean, delayMs: number): boolean {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!condition) {
      setActive(false);
      return;
    }
    const timer = setTimeout(() => {
      setActive(true);
    }, delayMs);
    return () => {
      clearTimeout(timer);
    };
  }, [condition, delayMs]);

  return active;
}
