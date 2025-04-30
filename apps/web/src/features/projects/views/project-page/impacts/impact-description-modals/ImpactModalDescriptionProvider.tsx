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
import SoilsCarbonStorageDescription from "./soils-carbon-storage/SoilsCarbonStorageDescription";
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
  dialogId: string;
};

function ImpactModalDescriptionProvider({
  children,
  projectData,
  siteData,
  impactsData,
  dialogId,
}: ModalDescriptionProviderProps) {
  const dialogTitleId = `fr-modal-title-${dialogId}`;

  const [openState, setOpenState] = useState<OpenState>(INITIAL_OPEN_STATE);

  const resetOpenState = () => {
    setOpenState(INITIAL_OPEN_STATE);
  };

  useIsModalOpen(
    { id: dialogId, isOpenedByDefault: false },
    {
      onConceal: resetOpenState,
    },
  );

  const openImpactModalDescription = (args: OpenImpactModalDescriptionArgs) => {
    setOpenState(args);
  };

  const getControlButtonProps = (onOpenDialogArgs: OpenImpactModalDescriptionArgs) => {
    return {
      "data-fr-opened": false,
      "aria-controls": dialogId,
      onClick: () => {
        openImpactModalDescription(onOpenDialogArgs);
      },
      onKeyUp: (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter") {
          openImpactModalDescription(onOpenDialogArgs);
        }
      },
    };
  };

  useLayoutEffect(() => {
    const domModalBody = document.querySelector(`#${dialogId} .fr-modal__body`);
    if (domModalBody) {
      domModalBody.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [dialogId, openState]);

  return (
    <ImpactModalDescriptionContext.Provider
      value={{
        openState,
        openImpactModalDescription,
        getControlButtonProps,
        resetOpenState,
        dialogTitleId,
        dialogId,
      }}
    >
      <dialog
        aria-labelledby={dialogTitleId}
        id={dialogId}
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
            case "charts":
              switch (openState.impactName) {
                case "cost_benefit_analysis":
                  return <CostBenefitAnalysisDescription impactsData={impactsData} />;
                case "soils_carbon_storage":
                  return (
                    <SoilsCarbonStorageDescription
                      impactData={impactsData.environmental.soilsCarbonStorage?.difference}
                      baseSoilsDistribution={siteData.soilsDistribution}
                      forecastSoilsDistribution={projectData.soilsDistribution}
                    />
                  );
              }
              break;
            default:
              return undefined;
          }
        })()}
      </dialog>
      {children}
    </ImpactModalDescriptionContext.Provider>
  );
}

export default ImpactModalDescriptionProvider;
