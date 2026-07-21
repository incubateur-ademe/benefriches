import { useContext } from "react";

import { ProjectFormContext } from "./ProjectFormContext";

export const useProjectForm = () => {
  const context = useContext(ProjectFormContext);
  if (!context) {
    throw new Error("useProjectForm must be used within ProjectFormProvider");
  }
  return context;
};
