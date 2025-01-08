import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
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

const modal = createModal({
  id: `modal-impacts-description`,
  isOpenedByDefault: false,
});

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

  useIsModalOpen(modal, {
    onConceal: resetOpenState,
  });

  useEffect(() => {
    if (openState) {
      modal.open();
    }
  }, [openState]);

  useLayoutEffect(() => {
    const domModalBody = document.querySelector(`#${modal.id} .fr-modal__body`);
    if (domModalBody) {
      domModalBody.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [openState]);

  return (
    <ImpactModalDescriptionContext.Provider
      value={{
        openState,
        openImpactModalDescription,
        resetOpenState,
      }}
    >
      {children}

      <modal.Component title={undefined} concealingBackdrop={true} size="large">
        <ImpactDescriptionModalWizard
          projectData={projectData}
          siteData={siteData}
          impactsData={impactsData}
        />
      </modal.Component>
    </ImpactModalDescriptionContext.Provider>
  );
}

export default ImpactModalDescriptionProvider;
