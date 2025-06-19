import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { lazy, Suspense, useLayoutEffect, useState } from "react";
import { BuildingsUseDistribution, ReconversionProjectImpacts, SoilsDistribution } from "shared";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  ImpactModalDescriptionContext,
  INITIAL_CONTENT_STATE,
  UpdateModalContentArgs,
  ContentState,
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
  initialState: ContentState;
};

function ImpactModalDescription({
  projectData,
  siteData,
  impactsData,
  dialogId,
  initialState = INITIAL_CONTENT_STATE,
}: ModalDescriptionProviderProps) {
  const dialogTitleId = `${dialogId}-title`;

  const [contentState, setContentState] = useState<ContentState>(INITIAL_CONTENT_STATE);

  const resetContentState = () => {
    setContentState(initialState);
  };

  const isOpen = useIsModalOpen(
    { id: dialogId, isOpenedByDefault: false },
    {
      onConceal: resetContentState,
      onDisclose: resetContentState,
    },
  );

  const updateModalContent = (args: UpdateModalContentArgs) => {
    setContentState(args);
  };

  useLayoutEffect(() => {
    const domModalBody = document.querySelector(`#${dialogId} .fr-modal__body`);
    if (domModalBody) {
      domModalBody.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [dialogId, contentState]);

  return (
    <dialog
      aria-labelledby={isOpen ? dialogTitleId : ""}
      id={dialogId}
      className="fr-modal"
      data-fr-concealing-backdrop={true}
    >
      <ImpactModalDescriptionContext.Provider
        value={{
          contentState,
          updateModalContent,
          dialogTitleId,
          dialogId,
        }}
      >
        <Suspense fallback={<LoadingSpinner classes={{ text: "tw-text-grey-light" }} />}>
          {(() => {
            if (!isOpen) {
              return null;
            }
            switch (contentState.sectionName) {
              case "economic_balance":
                return (
                  <EconomicBalanceModalWizard
                    projectData={projectData}
                    impactsData={impactsData}
                    impactName={contentState.impactName}
                    impactDetailsName={contentState.impactDetailsName}
                  />
                );
              case "socio_economic":
                return (
                  <SocioEconomicModalWizard
                    projectData={projectData}
                    siteData={siteData}
                    impactsData={impactsData}
                    impactSubSectionName={contentState.subSectionName}
                    impactName={contentState.impactName}
                    impactDetailsName={contentState.impactDetailsName}
                  />
                );

              case "social":
                return (
                  <SocialModalWizard
                    projectData={projectData}
                    siteData={siteData}
                    impactsData={impactsData}
                    impactSubSectionName={contentState.subSectionName}
                    impactName={contentState.impactName}
                    impactDetailsName={contentState.impactDetailsName}
                  />
                );
              case "environmental":
                return (
                  <EnvironmentalModalWizard
                    projectData={projectData}
                    siteData={siteData}
                    impactsData={impactsData}
                    impactSubSectionName={contentState.subSectionName}
                    impactName={contentState.impactName}
                    impactDetailsName={contentState.impactDetailsName}
                  />
                );
              case "summary":
                return <SummaryModalWizard impactData={contentState.impactData} />;
              case "charts":
                switch (contentState.impactName) {
                  case "cost_benefit_analysis":
                    return <CostBenefitAnalysisDescription impactsData={impactsData} />;
                  case "soils_carbon_storage":
                    return (
                      <SoilsCarbonStorageDescription
                        impactData={impactsData.environmental.soilsCarbonStorage!}
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
