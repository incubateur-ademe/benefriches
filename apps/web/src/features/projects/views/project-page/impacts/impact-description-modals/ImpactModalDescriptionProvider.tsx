import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import {
  BuildingFloorAreaUsageDistribution,
  ReconversionProjectImpacts,
  SoilsDistribution,
} from "shared";

import { ImpactDescriptionModalWizard } from "./ImpactDescriptionModalWizard";
import {
  ImpactModalDescriptionContext,
  INITIAL_OPEN_STATE,
  OpenImpactModalDescriptionArgs,
  OpenState,
} from "./ImpactModalDescriptionContext";

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
  const [openState, setOpenState] = useState<OpenState>(INITIAL_OPEN_STATE);

  const openImpactModalDescription = (args: OpenImpactModalDescriptionArgs) => {
    setOpenState(args);
  };

  const resetOpenState = () => {
    setOpenState(INITIAL_OPEN_STATE);
  };

  useIsModalOpen(modal, {
    onConceal: resetOpenState,
  });

  useEffect(() => {
    if (openState.sectionName) {
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
