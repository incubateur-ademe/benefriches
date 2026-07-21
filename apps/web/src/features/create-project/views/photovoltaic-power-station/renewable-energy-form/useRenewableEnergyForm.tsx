import { useContext } from "react";

import { RenewableEnergyFormContext } from "./RenewableEnergyFormContext";

export const useRenewableEnergyForm = () => {
  const context = useContext(RenewableEnergyFormContext);
  if (!context) {
    throw new Error("useRenewableEnergyForm must be used within RenewableEnergyFormProvider");
  }
  return context;
};
