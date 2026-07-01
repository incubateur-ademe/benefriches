import { createContext } from "react";

export const SidebarCurrentStepContext = createContext({
  setCurrentStepLabel: (_label: string) => {},
});
