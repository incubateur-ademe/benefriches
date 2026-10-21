import { fr } from "@codegouvfr/react-dsfr";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Suspense, useLayoutEffect, useMemo } from "react";
import type { Route } from "type-route";

import { routes } from "@/app/router";
import type { DevelopmentScoreDataView } from "@/features/projects/application/project-impacts/selectors/projectDevelopmentScore.selectors";
import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { ImpactModalContentWizard } from "../../impact-description-modals/ImpactModalContentWizard";
import { ImpactModalDescriptionContext } from "../../impact-description-modals/ImpactModalDescriptionContext";
import ModalBody from "../../impact-description-modals/modal-layout/ModalBody";
import ModalGrid from "../../impact-description-modals/modal-layout/ModalGrid";
import useToggleDescriptionModal from "../../impact-description-modals/useToggleDescriptionModal";
import { developmentScoreMdxComponents } from "../../shared/impacts/documentation/mdxComponents";
import DevelopmentScoreModalHeader, { DIALOG_TITLE_ID } from "./DevelopmentScoreModalHeader";
import DevelopmentScoreModalLink from "./DevelopmentScoreModalLink";
import { DEVELOPMENT_SCORE_CONFIG_MODALS } from "./developmentScoreModalsConfig";
import { parseContentState } from "./useOpenDescriptionModalLink";

const DIALOG_ID = "developmentScore-modal-description";
const DIALOG_DSFR_CSS = [
  "fixed inset-0",
  "w-screen",
  "flex items-center justify-center",
  "z-[1750]",
  "bg-[var(--grey-50-1000)]/[0.64] dark:bg-[var(--grey-1000-100)]/[0.64]",
];

type Props = DevelopmentScoreDataView & {
  route: Route<typeof routes.projectImpactsDevelopmentScore>;
};

function DevelopmentScoreModalDescription({ developmentScore, route, modalsData }: Props) {
  const isOpen = Boolean(route.params.details);

  const detailsName = useMemo(
    () => (isOpen ? parseContentState(route.params.details) : undefined),
    [isOpen, route.params.details],
  );

  const { getUpdateDetailsLink, handleClose } = useMemo(
    () => ({
      getUpdateDetailsLink: (details?: string) =>
        routes[route.name]({
          ...route.params,
          details,
        }).link,
      handleClose: () => {
        routes[route.name]({
          ...route.params,
          details: undefined,
        }).push();
      },
    }),
    [route],
  );

  const { isDark } = useIsDark();

  const config = detailsName ? DEVELOPMENT_SCORE_CONFIG_MODALS[detailsName] : undefined;

  useLayoutEffect(() => {
    const domModalBody = document.querySelector(`#${DIALOG_ID} .fr-modal__body`);

    if (domModalBody) {
      domModalBody.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailsName]);

  const {
    contentState: impactsListModalsMatchedState,
    getDetailsLink: getImpactListModalContentLink,
  } = useToggleDescriptionModal({
    route,
    getRouteFn: routes.projectImpactsDevelopmentScore,
  });

  const isImpactListDetailsContent =
    impactsListModalsMatchedState.sectionName &&
    impactsListModalsMatchedState.sectionName !== "summary" &&
    impactsListModalsMatchedState.sectionName !== "breakEvenLevel";

  const impactModalDescriptionContextValue = useMemo(
    () => ({
      dialogTitleId: `${DIALOG_ID}-title`,
      onClose: handleClose,
      contentState: impactsListModalsMatchedState,
      getDetailsLink: getImpactListModalContentLink,
    }),
    [handleClose, impactsListModalsMatchedState, getImpactListModalContentLink],
  );

  return (
    <Dialog id={DIALOG_ID} open={isOpen} onClose={handleClose} aria-labelledby={DIALOG_TITLE_ID}>
      <div className={classNames(DIALOG_DSFR_CSS, isDark ? "highcharts-dark" : "highcharts-light")}>
        <DialogPanel>
          <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
            {isImpactListDetailsContent ? (
              <ImpactModalDescriptionContext.Provider value={impactModalDescriptionContextValue}>
                <ImpactModalContentWizard
                  noBreadcrumb
                  contentState={impactsListModalsMatchedState}
                  {...modalsData}
                />
              </ImpactModalDescriptionContext.Provider>
            ) : (
              detailsName &&
              config && (
                <ModalBody size="large">
                  <ModalGrid>
                    <div className={classNames("p-10 pt-4", "mb-0", fr.cx("fr-modal__content"))}>
                      {(() => {
                        const letterGrade = config.letterGrade?.(developmentScore.details);
                        const DataComponent = config?.DataComponent;
                        const MetricsComponent = config?.MetricsComponent;

                        return (
                          <config.ContentComponent
                            components={{
                              ...developmentScoreMdxComponents,
                              h1: (props) => (
                                <>
                                  <DevelopmentScoreModalHeader
                                    letterGrade={letterGrade}
                                    detailsName={detailsName}
                                    onCloseLink={getUpdateDetailsLink(undefined)}
                                    {...props}
                                  />

                                  {DataComponent ? (
                                    <DataComponent
                                      developmentScore={developmentScore}
                                      modalsData={modalsData}
                                      getUpdateDetailsLink={getUpdateDetailsLink}
                                    />
                                  ) : null}
                                </>
                              ),
                              a: (props) => (
                                <DevelopmentScoreModalLink
                                  developmentScore={developmentScore}
                                  getUpdateDetailsLink={getUpdateDetailsLink}
                                  {...props}
                                />
                              ),

                              Metrics: () =>
                                MetricsComponent ? (
                                  <MetricsComponent developmentScore={developmentScore} />
                                ) : null,
                            }}
                          />
                        );
                      })()}
                    </div>
                  </ModalGrid>
                </ModalBody>
              )
            )}
          </Suspense>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default DevelopmentScoreModalDescription;
