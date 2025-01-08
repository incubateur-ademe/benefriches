import { createContext } from "react";

import { ImpactDescriptionModalCategory } from "./ImpactDescriptionModalWizard";

type Context = {
  openState: ImpactDescriptionModalCategory;
  openImpactModalDescription: (_modalId: ImpactDescriptionModalCategory) => void;
  resetOpenState: () => void;
};
export const ImpactModalDescriptionContext = createContext<Context>({
  openState: undefined,
  openImpactModalDescription: () => {},
  resetOpenState: () => {},
});
