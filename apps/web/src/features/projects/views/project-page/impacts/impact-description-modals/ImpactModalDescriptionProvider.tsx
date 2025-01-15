import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import {
  BuildingFloorAreaUsageDistribution,
  ReconversionProjectImpacts,
  SoilsDistribution,
} from "shared";

import "./ImpactDescriptionModal.css";
import {
  ImpactModalDescriptionContext,
  INITIAL_OPEN_STATE,
  OpenImpactModalDescriptionArgs,
  OpenState,
} from "./ImpactModalDescriptionContext";
import { EconomicBalanceModalWizard } from "./economic-balance/EconomicBalanceModalWizard.";
import { EnvironmentalModalWizard } from "./environmental/EnvironmentalModalWizard";
import { SocialModalWizard } from "./social/SocialModalWizard";
import { SocioEconomicModalWizard } from "./socio-economic/SocioEconomicModalWizard";

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
        {(() => {
          switch (openState.sectionName) {
            case "economic_balance":
              return (
                <EconomicBalanceModalWizard
                  impactName={openState.impactName}
                  impactDetailsName={openState.impactDetailsName}
                />
              );
            case "socio_economic":
              return (
                <SocioEconomicModalWizard
                  projectData={projectData}
                  siteData={siteData}
                  impactsData={impactsData.socioeconomic}
                  impactName={openState.impactName}
                  impactDetailsName={openState.impactDetailsName}
                />
              );

            case "social":
              return (
                <SocialModalWizard
                  projectData={projectData}
                  siteData={siteData}
                  impactName={openState.impactName}
                  impactDetailsName={openState.impactDetailsName}
                />
              );
            case "environmental":
              return (
                <EnvironmentalModalWizard
                  projectData={projectData}
                  siteData={siteData}
                  impactName={openState.impactName}
                  impactDetailsName={openState.impactDetailsName}
                />
              );
            default:
              return undefined;
          }
        })()}
      </modal.Component>
    </ImpactModalDescriptionContext.Provider>
  );
}

export default ImpactModalDescriptionProvider;
