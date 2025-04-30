import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { lazy, Suspense, useLayoutEffect, useState } from "react";
import { BuildingsUseDistribution, ReconversionProjectImpacts, SoilsDistribution } from "shared";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import "./ImpactDescriptionModal.css";
import {
  ImpactModalDescriptionContext,
  INITIAL_OPEN_STATE,
  OpenImpactModalDescriptionArgs,
  OpenState,
} from "./ImpactModalDescriptionContext";
import { EconomicBalanceModalWizard } from "./economic-balance/EconomicBalanceModalWizard";
import { EnvironmentalModalWizard } from "./environmental/EnvironmentalModalWizard";
import { SocialModalWizard } from "./social/SocialModalWizard";
import { SocioEconomicModalWizard } from "./socio-economic/SocioEconomicModalWizard";
import { SummaryModalWizard } from "./summary/SummaryModalWizard";

const SoilsCarbonStorageDescription = lazy(
  () => import("./soils-carbon-storage/SoilsCarbonStorageDescription"),
);
const CostBenefitAnalysisDescription = lazy(
  () => import("./cost-benefit-analysis/CostBenefitAnalysisDescription"),
);

export type ModalDataProps = {
  projectData: {
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
  siteData: {
    soilsDistribution: SoilsDistribution;
    contaminatedSoilSurface: number;
    addressLabel: string;
    surfaceArea: number;
  };
  impactsData: ReconversionProjectImpacts;
};

type ModalDescriptionProviderProps = ModalDataProps & {
  dialogId: string;
  initialState: OpenState;
};

function ImpactModalDescription({
  projectData,
  siteData,
  impactsData,
  dialogId,
  initialState = INITIAL_OPEN_STATE,
}: ModalDescriptionProviderProps) {
  const dialogTitleId = `${dialogId}-title`;

  const [openState, setOpenState] = useState<OpenState>(INITIAL_OPEN_STATE);

  const resetOpenState = () => {
    setOpenState(initialState);
  };

  const isOpen = useIsModalOpen(
    { id: dialogId, isOpenedByDefault: false },
    {
      onConceal: resetOpenState,
      onDisclose: resetOpenState,
    },
  );

  const openImpactModalDescription = (args: OpenImpactModalDescriptionArgs) => {
    setOpenState(args);
  };

  useLayoutEffect(() => {
    const domModalBody = document.querySelector(`#${dialogId} .fr-modal__body`);
    if (domModalBody) {
      domModalBody.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [dialogId, openState]);

  return (
    <dialog
      aria-labelledby={dialogTitleId}
      id={dialogId}
      className="fr-modal"
      data-fr-concealing-backdrop={true}
    >
      <ImpactModalDescriptionContext.Provider
        value={{
          openState,
          openImpactModalDescription,
          resetOpenState,
          dialogTitleId,
          dialogId,
        }}
      >
        <Suspense fallback={<LoadingSpinner classes={{ text: "tw-text-grey-light" }} />}>
          {(() => {
            if (!isOpen) {
              return null;
            }
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
        </Suspense>
      </ImpactModalDescriptionContext.Provider>
    </dialog>
  );
}

export default ImpactModalDescription;
