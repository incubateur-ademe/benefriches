import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { Suspense, useLayoutEffect, useState } from "react";

import { UrbanSprawlImpactsComparisonState } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  getEconomicBalanceDetailsImpactLabel,
  getEconomicBalanceImpactLabel,
  getEnvironmentalDetailsImpactLabel,
  getEnvironmentalImpactLabel,
  getSocialImpactLabel,
  getSocioEconomicImpactLabel,
} from "../../project-page/impacts/getImpactLabel";
import { getSubSectionBreadcrumb as getEnvironmentSubSectionBreadcrumb } from "../../project-page/impacts/impact-description-modals/environmental/breadcrumbSections";
import { getSubSectionBreadcrumb as getSocialSubSectionBreadcrumb } from "../../project-page/impacts/impact-description-modals/social/breadcrumbSections";
import { getSubSectionBreadcrumb as getSocioEconomicSubSectionBreadcrumb } from "../../project-page/impacts/impact-description-modals/socio-economic/breadcrumbSections";
import ImpactInProgressDescriptionModal from "../../shared/impacts/modals/ImpactInProgressDescriptionModal";
import {
  ContentState,
  ImpactModalDescriptionContext,
  INITIAL_CONTENT_STATE,
  UpdateModalContentArgs,
} from "../../shared/impacts/modals/ImpactModalDescriptionContext";
import { SummaryModalWizard } from "../../shared/impacts/modals/summary/SummaryModalWizard";

export type ModalDataProps = Pick<
  Required<UrbanSprawlImpactsComparisonState>,
  "baseCase" | "comparisonCase" | "projectData"
>;

type ModalDescriptionProviderProps = ModalDataProps & {
  dialogId: string;
  initialState: ContentState;
};

function ImpactComparisonModalDescription({
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
              case "summary":
                return <SummaryModalWizard impactData={contentState.impactData} />;

              case "economic_balance":
                return (
                  <ImpactInProgressDescriptionModal
                    title={
                      contentState.impactName
                        ? contentState.impactDetailsName
                          ? getEconomicBalanceDetailsImpactLabel(
                              contentState.impactName,
                              contentState.impactDetailsName,
                            )
                          : getEconomicBalanceImpactLabel(contentState.impactName)
                        : "📉 Bilan de l'opération"
                    }
                    breadcrumbProps={{
                      section: {
                        label: "Bilan de l'opération",
                        contentState: { sectionName: "economic_balance" },
                      },
                      segments: contentState.impactDetailsName &&
                        contentState.impactName && [
                          {
                            label: getEconomicBalanceImpactLabel(contentState.impactName),
                            contentState: {
                              sectionName: "economic_balance",
                              impactName: contentState.impactName,
                            },
                          },
                        ],
                    }}
                  />
                );
              case "socio_economic": {
                const subSectionSegments = contentState.subSectionName && [
                  getSocioEconomicSubSectionBreadcrumb(contentState.subSectionName),
                ];
                const impactNameSegments = contentState.impactDetailsName &&
                  contentState.impactName && [
                    {
                      label: getSocioEconomicImpactLabel(contentState.impactName),
                      contentState: {
                        sectionName: "socio_economic" as const,
                        subSectionName: contentState.subSectionName,
                        impactName: contentState.impactName,
                      },
                    },
                  ];
                return (
                  <ImpactInProgressDescriptionModal
                    title={
                      contentState.impactName
                        ? getSocioEconomicImpactLabel(
                            contentState.impactDetailsName ?? contentState.impactName,
                          )
                        : "Impacts socio-économiques"
                    }
                    breadcrumbProps={{
                      section: {
                        label: "Impacts socio-économiques",
                        contentState: { sectionName: "socio_economic" },
                      },
                      segments: [...(subSectionSegments ?? []), ...(impactNameSegments ?? [])],
                    }}
                  />
                );
              }
              case "environmental": {
                const subSectionSegments = contentState.subSectionName && [
                  getEnvironmentSubSectionBreadcrumb(contentState.subSectionName),
                ];
                const impactNameSegments = contentState.impactDetailsName &&
                  contentState.impactName && [
                    {
                      label: getEnvironmentalImpactLabel(contentState.impactName),
                      contentState: {
                        sectionName: "environmental" as const,
                        subSectionName: contentState.subSectionName,
                        impactName: contentState.impactName,
                      },
                    },
                  ];
                return (
                  <ImpactInProgressDescriptionModal
                    title={
                      contentState.impactName
                        ? contentState.impactDetailsName
                          ? getEnvironmentalDetailsImpactLabel(
                              contentState.impactName,
                              contentState.impactDetailsName,
                            )
                          : getEnvironmentalImpactLabel(contentState.impactName)
                        : "Impacts environnementaux"
                    }
                    breadcrumbProps={{
                      section: {
                        label: "Impacts environnementaux",
                        contentState: { sectionName: "environmental" },
                      },
                      segments: [...(subSectionSegments ?? []), ...(impactNameSegments ?? [])],
                    }}
                  />
                );
              }
              case "social": {
                const subSectionSegments = contentState.subSectionName && [
                  getSocialSubSectionBreadcrumb(contentState.subSectionName),
                ];
                const impactNameSegments = contentState.impactDetailsName &&
                  contentState.impactName && [
                    {
                      label: getSocialImpactLabel(contentState.impactName),
                      contentState: {
                        sectionName: "social" as const,
                        subSectionName: contentState.subSectionName,
                        impactName: contentState.impactName,
                      },
                    },
                  ];
                return (
                  <ImpactInProgressDescriptionModal
                    title={
                      contentState.impactName
                        ? getSocialImpactLabel(
                            contentState.impactDetailsName ?? contentState.impactName,
                          )
                        : "Impacts sociaux"
                    }
                    breadcrumbProps={{
                      section: {
                        label: "Impacts sociaux",
                        contentState: { sectionName: "social" },
                      },
                      segments: [...(subSectionSegments ?? []), ...(impactNameSegments ?? [])],
                    }}
                  />
                );
              }

              default:
                return (
                  <ImpactInProgressDescriptionModal
                    title="Bientôt disponible"
                    breadcrumbProps={{
                      section: { label: "Synthèse" },
                      segments: [],
                    }}
                  />
                );
            }
          })()}
        </Suspense>
      </ImpactModalDescriptionContext.Provider>
    </dialog>
  );
}

export default ImpactComparisonModalDescription;
