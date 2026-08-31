import { useContext } from "react";

import { UrbanZoneSiteFormContext } from "./UrbanZoneSiteFormContext";

export const useUrbanZoneSiteForm = () => {
  const context = useContext(UrbanZoneSiteFormContext);
  if (!context) {
    throw new Error("useUrbanZoneSiteForm must be used within UrbanZoneSiteFormProvider");
  }
  return context;
};
