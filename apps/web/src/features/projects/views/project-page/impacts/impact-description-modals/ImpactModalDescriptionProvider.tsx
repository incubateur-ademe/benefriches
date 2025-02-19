import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { ReactNode, useLayoutEffect, useState } from "react";
import { BuildingsUseDistribution, ReconversionProjectImpacts, SoilsDistribution } from "shared";

import "./ImpactDescriptionModal.css";
import {
  ImpactModalDescriptionContext,
  INITIAL_OPEN_STATE,
  OpenImpactModalDescriptionArgs,
  OpenState,
} from "./ImpactModalDescriptionContext";
import CostBenefitAnalysisDescription from "./cost-benefit-analysis/CostBenefitAnalysisDescription";
import { EconomicBalanceModalWizard } from "./economic-balance/EconomicBalanceModalWizard.";
import { EnvironmentalModalWizard } from "./environmental/EnvironmentalModalWizard";
import { SocialModalWizard } from "./social/SocialModalWizard";
import { SocioEconomicModalWizard } from "./socio-economic/SocioEconomicModalWizard";
import { SummaryModalWizard } from "./summary/SummaryModalWizard";

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
        buildingsFloorAreaDistribution: BuildingsUseDistribution;
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

export const MODAL_DESCRIPTION_ID = "modal-impacts-description";
export const MODAL_TITLE_ID = `fr-modal-title-${MODAL_DESCRIPTION_ID}`;
const HIDDEN_CONTROL_BUTTON_ID = `${MODAL_DESCRIPTION_ID}-control-button`;
function ImpactModalDescriptionProvider({
  children,
  projectData,
  siteData,
  impactsData,
}: ModalDescriptionProviderProps) {
  const [openState, setOpenState] = useState<OpenState>(INITIAL_OPEN_STATE);

  const resetOpenState = () => {
    setOpenState(INITIAL_OPEN_STATE);
  };

  const isOpen = useIsModalOpen(
    { id: MODAL_DESCRIPTION_ID, isOpenedByDefault: false },
    {
      onConceal: resetOpenState,
    },
  );

  const openImpactModalDescription = (args: OpenImpactModalDescriptionArgs) => {
    if (!isOpen) {
      document.getElementById(HIDDEN_CONTROL_BUTTON_ID)?.click();
    }
    setOpenState(args);
  };

  useLayoutEffect(() => {
    const domModalBody = document.querySelector(`#${MODAL_DESCRIPTION_ID} .fr-modal__body`);
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

      <Button
        nativeButtonProps={{
          id: HIDDEN_CONTROL_BUTTON_ID,
          "aria-controls": MODAL_DESCRIPTION_ID,
          "data-fr-opened": false,
          type: "button",
          tabIndex: -1,
          "aria-hidden": true,
        }}
        className={fr.cx("fr-hidden")}
      >
        {" "}
      </Button>
      <dialog
        aria-labelledby={MODAL_TITLE_ID}
        id={MODAL_DESCRIPTION_ID}
        className="fr-modal"
        data-fr-concealing-backdrop={true}
      >
        {(() => {
          switch (openState.sectionName) {
            case "economic_balance":
              return (
                <EconomicBalanceModalWizard
                  projectData={projectData}
                  impactsData={impactsData}
                  impactName={openState.impactName}
                  impactDetailsName={openState.impactDetailsName}
                />
              );
            case "socio_economic":
              return (
                <SocioEconomicModalWizard
                  projectData={projectData}
                  siteData={siteData}
                  impactsData={impactsData}
                  impactSubSectionName={openState.subSectionName}
                  impactName={openState.impactName}
                  impactDetailsName={openState.impactDetailsName}
                />
              );

            case "social":
              return (
                <SocialModalWizard
                  projectData={projectData}
                  siteData={siteData}
                  impactsData={impactsData}
                  impactSubSectionName={openState.subSectionName}
                  impactName={openState.impactName}
                  impactDetailsName={openState.impactDetailsName}
                />
              );
            case "environmental":
              return (
                <EnvironmentalModalWizard
                  projectData={projectData}
                  siteData={siteData}
                  impactsData={impactsData}
                  impactSubSectionName={openState.subSectionName}
                  impactName={openState.impactName}
                  impactDetailsName={openState.impactDetailsName}
                />
              );
            case "summary":
              return <SummaryModalWizard impactData={openState.impactData} />;
            case "cost_benefit_analysis":
              return <CostBenefitAnalysisDescription impactsData={impactsData} />;
            default:
              return undefined;
          }
        })()}
      </dialog>
    </ImpactModalDescriptionContext.Provider>
  );
}

export default ImpactModalDescriptionProvider;
