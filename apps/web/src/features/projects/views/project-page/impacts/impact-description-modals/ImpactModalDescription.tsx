import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { Dialog, DialogPanel } from "@headlessui/react";
import { ReactNode, Suspense, useCallback, useLayoutEffect, useMemo } from "react";

import { routes, useRoute } from "@/app/router";
import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { getKeyImpactIndicatorsList } from "@/features/projects/core/projectKeyImpactIndicators";
import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  ImpactModalDescriptionContext,
  INITIAL_CONTENT_STATE,
  parseContentState,
  serializeContentState,
  UpdateModalContentArgs,
} from "../../../shared/impacts/modals/ImpactModalDescriptionContext";
import { DetailsCode, SectionCode } from "../../../shared/impacts/modals/impactModalUrlCodes";
import { SummaryModalWizard } from "../../../shared/impacts/modals/summary/SummaryModalWizard";
import { ProjectRoute } from "../../ProjectPage";
import { ImpactModalContentWizard, MODAL_CONFIG_GROUPS } from "./ImpactModalContentWizard";
import CostBenefitAnalysisDescription from "./body-component/CostBenefitAnalysisDescription";

const DIALOG_ID = "impact-modal-description";
const DIALOG_TITLE_ID = "impact-modal-description-title";

const DIALOG_DSFR_CSS = [
  "fixed inset-0",
  "w-screen",
  "flex items-center justify-center",
  "z-[1750]",
  "bg-[var(--grey-50-1000)]/[0.64] dark:bg-[var(--grey-1000-100)]/[0.64]",
];

function hasModalConfigFor(args: UpdateModalContentArgs): boolean {
  if (!args.sectionName) {
    return false;
  }
  const group = MODAL_CONFIG_GROUPS.find((group) => group.sections.includes(args.sectionName));
  if (!group) return true;

  const key =
    ("impactDetailsName" in args ? args.impactDetailsName : undefined) ?? args.sectionName;
  return group.modals[key] !== undefined;
}

function ImpactModalDescription({
  contextData,
  impactsData,
  children,
}: ModalDataProps & { children: ReactNode }) {
  const route = useRoute() as ProjectRoute;

  const isOpen = Boolean(route.params.details);

  const contentState = useMemo(
    () =>
      (isOpen
        ? parseContentState(route.params.details as `${SectionCode}_${DetailsCode}`)
        : undefined) ?? INITIAL_CONTENT_STATE,
    [isOpen, route.params.details],
  );

  const getDetailsLink = useCallback(
    (args: UpdateModalContentArgs) => {
      if (!hasModalConfigFor(args)) {
        return undefined;
      }

      return routes[route.name]({
        projectId: route.params.projectId,
        details: serializeContentState(args),
      }).link;
    },
    [route],
  );

  const handleClose = useCallback(() => {
    routes[route.name]({ projectId: route.params.projectId }).push();
  }, [route]);

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
                    return (
                      <ImpactModalContentWizard
                        contextData={contextData}
                        impactsData={impactsData}
                        contentState={contentState}
                      />
                    );
                  }
                  case "summary":
                    return contentState.impactDetailsName ? (
                      <SummaryModalWizard
                        impactsData={getKeyImpactIndicatorsList(impactsData, contextData)}
                        contentState={contentState}
                      />
                    ) : undefined;
                  case "breakEvenLevel":
                    return <CostBenefitAnalysisDescription impactsData={impactsData} />;
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

export default ImpactModalDescription;
