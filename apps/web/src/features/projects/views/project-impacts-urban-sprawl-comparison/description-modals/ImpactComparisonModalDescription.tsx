import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { Suspense, useLayoutEffect, useState } from "react";

import { UrbanSprawlImpactsComparisonState } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

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
