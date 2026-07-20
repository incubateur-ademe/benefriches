import { useState } from "react";

export const useSurfaceAreaInputMode = () => {
  const [inputMode, setInputMode] = useState<"percentage" | "squareMeters">("percentage");

  return { inputMode, onInputModeChange: setInputMode };
};
