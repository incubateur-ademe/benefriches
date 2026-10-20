import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { Dialog, DialogPanel } from "@headlessui/react";
import type { ReactNode } from "react";
import { Suspense, useLayoutEffect, useMemo } from "react";
import { getKeyImpactIndicatorsList } from "shared";
import type { Link, Route } from "type-route";

import type { routes } from "@/app/router";
import type { embedRoutes } from "@/embed";
import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { ImpactModalContentWizard } from "./ImpactModalContentWizard";
import { ImpactModalDescriptionContext } from "./ImpactModalDescriptionContext";
import CostBenefitAnalysisDescription from "./body-component/CostBenefitAnalysisDescription";
import { SummaryModalWizard } from "./body-component/summary/SummaryModalWizard";
import useToggleDescriptionModal from "./useToggleDescriptionModal";

const DIALOG_ID = "impact-modal-description";
const DIALOG_TITLE_ID = "impact-modal-description-title";

const DIALOG_DSFR_CSS = [
  "fixed inset-0",
  "w-screen",
  "flex items-center justify-center",
  "z-[1750]",
  "bg-[var(--grey-50-1000)]/[0.64] dark:bg-[var(--grey-1000-100)]/[0.64]",
];

type SupportedRoute =
  | Route<typeof routes.projectImpactsBreakEvenLevel>
  | Route<typeof routes.projectImpacts>
  | Route<typeof embedRoutes.routes.quickImpactsUrbanProject>;

function ImpactModalDescriptionProvider<TRoute extends SupportedRoute>({
  children,
  route,
  getRouteFn,
  ...props
}: ModalDataProps & {
  children: ReactNode;
  route: TRoute;
  getRouteFn: (params: TRoute["params"]) => { link: Link; push: () => void };
}) {
  const isOpen = Boolean(route.params.details);

  const { contentState, handleClose, getDetailsLink } = useToggleDescriptionModal({
    route,
    getRouteFn,
  });

  const impactModalDescriptionContextValue = useMemo(
    () => ({
      contentState,
      onClose: handleClose,
      dialogTitleId: DIALOG_TITLE_ID,
      getDetailsLink,
    }),
    [contentState, handleClose, getDetailsLink],
  );

  const { isDark } = useIsDark();

  useLayoutEffect(() => {
    const domModalBody = document.querySelector(`#${DIALOG_ID} .fr-modal__body`);

    if (domModalBody) {
      domModalBody.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentState]);
  return (
    <ImpactModalDescriptionContext.Provider value={impactModalDescriptionContextValue}>
      {children}

      <Dialog id={DIALOG_ID} open={isOpen} onClose={handleClose} aria-labelledby={DIALOG_TITLE_ID}>
        <div
          className={classNames(DIALOG_DSFR_CSS, isDark ? "highcharts-dark" : "highcharts-light")}
        >
          <DialogPanel>
            <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
              {(() => {
                if (!isOpen) {
                  return null;
                }
                switch (contentState.sectionName) {
                  case "economicBalance":
                  case "socioEconomic":
                  case "socioEconomic.humanity":
                  case "socioEconomic.localPeopleOrCompany":
                  case "socioEconomic.localAuthority":
                  case "social":
                  case "social.humanity":
                  case "social.jobs":
                  case "social.localPeopleOrCompany":
                  case "environmental":
                  case "environmental.co2eq":
                  case "environmental.soils": {
                    return <ImpactModalContentWizard {...props} contentState={contentState} />;
                  }
                  case "summary":
                    return contentState.impactDetailsName ? (
                      <SummaryModalWizard
                        impactsData={getKeyImpactIndicatorsList(
                          props.impactsData,
                          props.contextData,
                        )}
                        contentState={contentState}
                      />
                    ) : undefined;
                  case "breakEvenLevel":
                    return <CostBenefitAnalysisDescription impactsData={props.impactsData} />;
                  default:
                    return undefined;
                }
              })()}
            </Suspense>
          </DialogPanel>
        </div>
      </Dialog>
    </ImpactModalDescriptionContext.Provider>
  );
}

export default ImpactModalDescriptionProvider;
