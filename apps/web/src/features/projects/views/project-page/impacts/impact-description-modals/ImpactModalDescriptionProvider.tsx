import { ReactNode, useState } from "react";
import {
  BuildingFloorAreaUsageDistribution,
  ReconversionProjectImpacts,
  SoilsDistribution,
} from "shared";

import {
  ImpactDescriptionModalCategory,
  ImpactDescriptionModalWizard,
} from "./ImpactDescriptionModalWizard";
import { ImpactModalDescriptionContext } from "./ImpactModalDescriptionContext";

export type ProjectData = {
  soilsDistribution: SoilsDistribution;
  contaminatedSoilSurface: number;
  developmentPlan:
    | {
        type: "PHOTOVOLTAIC_POWER_PLANT";
        electricalPowerKWc: number;
        surfaceArea: number;
      }
    | {
        type: "URBAN_PROJECT";
        buildingsFloorAreaDistribution: BuildingFloorAreaUsageDistribution;
      };
};

export type SiteData = {
  soilsDistribution: SoilsDistribution;
  contaminatedSoilSurface: number;
  addressLabel: string;
  surfaceArea: number;
};

export type ImpactsData = ReconversionProjectImpacts;

type ModalDescriptionProviderProps = {
  children: ReactNode;
  projectData: ProjectData;
  siteData: SiteData;
  impactsData: ImpactsData;
};

type State = ImpactDescriptionModalCategory;

const INITAL_OPEN_STATE = undefined;

function ImpactModalDescriptionProvider({
  children,
  projectData,
  siteData,
  impactsData,
}: ModalDescriptionProviderProps) {
  const [openState, setOpenState] = useState<State>(INITAL_OPEN_STATE);

  const openImpactModalDescription = (modalId: ImpactDescriptionModalCategory) => {
    setOpenState(modalId);
  };

  const resetOpenState = () => {
    setOpenState(INITAL_OPEN_STATE);
  };

  return (
    <ImpactModalDescriptionContext.Provider
      value={{
        openState,
        openImpactModalDescription,
        resetOpenState,
      }}
    >
      {children}
      <ImpactDescriptionModalWizard
        projectData={projectData}
        siteData={siteData}
        impactsData={impactsData}
      />
    </ImpactModalDescriptionContext.Provider>
  );
}

export default ImpactModalDescriptionProvider;
