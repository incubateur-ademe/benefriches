import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { Suspense, useCallback, useLayoutEffect, useMemo, useState } from "react";
import { GetReconversionProjectImpactsResultDto } from "shared";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  ImpactModalDescriptionContext,
  INITIAL_CONTENT_STATE,
  UpdateModalContentArgs,
  ContentState,
} from "../../../shared/impacts/modals/ImpactModalDescriptionContext";
import { SummaryModalWizard } from "../../../shared/impacts/modals/summary/SummaryModalWizard";
import { EconomicBalanceModalWizard } from "./economic-balance/EconomicBalanceModalWizard";
import { EnvironmentalModalWizard } from "./environmental/EnvironmentalModalWizard";
import { SocialModalWizard } from "./social/SocialModalWizard";
import { SocioEconomicModalWizard } from "./socio-economic/SocioEconomicModalWizard";

export type ModalDataProps = {
  contextData: GetReconversionProjectImpactsResultDto["contextData"];
  impactsData: GetReconversionProjectImpactsResultDto["impacts"];
};

type ModalDescriptionProviderProps = ModalDataProps & {
  dialogId: string;
  initialState: ContentState;
};

function ImpactModalDescription({
  contextData,
  impactsData,
  dialogId,
  initialState,
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

  const updateModalContent = useCallback((args: UpdateModalContentArgs) => {
    setContentState(args);
  }, []);

  const impactModalDescriptionContextValue = useMemo(
    () => ({
      contentState,
      updateModalContent,
      dialogTitleId,
      dialogId,
    }),
    [contentState, updateModalContent, dialogTitleId, dialogId],
  );

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
      <ImpactModalDescriptionContext.Provider value={impactModalDescriptionContextValue}>
        <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
          {(() => {
            if (!isOpen) {
              return null;
            }
            switch (contentState.sectionName) {
              case "economic_balance":
                return (
                  <EconomicBalanceModalWizard
                    contextData={contextData}
                    impactsData={impactsData}
                    impactName={contentState.impactName}
                    impactDetailsName={contentState.impactDetailsName}
                  />
                );
              case "socio_economic":
                return (
                  <SocioEconomicModalWizard
                    contextData={contextData}
                    impactsData={impactsData}
                    impactSubSectionName={contentState.subSectionName}
                    impactName={contentState.impactName}
                    impactDetailsName={contentState.impactDetailsName}
                  />
                );

              case "social":
                return (
                  <SocialModalWizard
                    contextData={contextData}
                    impactsData={impactsData}
                    impactSubSectionName={contentState.subSectionName}
                    impactName={contentState.impactName}
                    impactDetailsName={contentState.impactDetailsName}
                  />
                );
              case "environmental":
                return (
                  <EnvironmentalModalWizard
                    contextData={contextData}
                    impactsData={impactsData}
                    impactSubSectionName={contentState.subSectionName}
                    impactName={contentState.impactName}
                    impactDetailsName={contentState.impactDetailsName}
                  />
                );
              case "summary":
                return <SummaryModalWizard impactData={contentState.impactData} />;
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
