import { useContext } from "react";

import { CustomSiteFormContext } from "./CustomSiteFormContext";

export const useCustomSiteForm = () => {
  const context = useContext(CustomSiteFormContext);
  if (!context) {
    throw new Error("useCustomSiteForm must be used within CustomSiteFormProvider");
  }
  return context;
};
