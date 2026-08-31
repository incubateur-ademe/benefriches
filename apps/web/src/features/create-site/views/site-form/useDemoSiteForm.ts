import { useContext } from "react";

import { DemoSiteFormContext } from "./DemoSiteFormContext";

export const useDemoSiteForm = () => {
  const context = useContext(DemoSiteFormContext);
  if (!context) {
    throw new Error("useDemoSiteForm must be used within DemoSiteFormProvider");
  }
  return context;
};
