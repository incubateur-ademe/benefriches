import type { ReactNode } from "react";
import { useMemo } from "react";
import { getKeyImpactIndicatorsList } from "shared";
import type { Link, Route } from "type-route";

import type { routes } from "@/app/router";
import type { embedRoutes } from "@/embed";
import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";

import { ImpactModalDescriptionContext } from "./ImpactModalDescriptionContext";
import { SummaryModalWizard } from "./body-component/summary/SummaryModalWizard";
import { getBreadcrumbProps } from "./breadcrumb";
import MdxContentDialog from "./lazy-component/MdxContentDialog";
import useImpactListModalContent from "./useImpactListModalContent";
import useToggleDescriptionModal from "./useToggleDescriptionModal";

type SupportedRoute =
  | Route<typeof routes.projectImpactsBreakEvenLevel>
  | Route<typeof routes.projectImpacts>
  | Route<typeof embedRoutes.routes.quickImpactsUrbanProject>;

const DIALOG_ID = "impact-modal-description";

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

  const { contentState, handleClose, getDetailsLink, onCloseLink } = useToggleDescriptionModal({
    route,
    getRouteFn,
  });

  const impactModalDescriptionContextValue = useMemo(
    () => ({
      contentState,
      onClose: handleClose,
      dialogTitleId: `${DIALOG_ID}-title`,
      getDetailsLink,
      onCloseLink,
    }),
    [contentState, handleClose, onCloseLink, getDetailsLink],
  );

  const breadcrumbSegments = useMemo(
    () =>
      contentState.sectionName &&
      contentState.sectionName !== "breakEvenLevel" &&
      contentState.sectionName !== "summary"
        ? getBreadcrumbProps(contentState, getDetailsLink)
        : undefined,
    [contentState, getDetailsLink],
  );

  const config = useImpactListModalContent(contentState, props, getDetailsLink);

  return (
    <ImpactModalDescriptionContext.Provider value={impactModalDescriptionContextValue}>
      {children}
      {(() => {
        if (!isOpen || !contentState?.sectionName) {
          return null;
        }

        if (contentState.sectionName === "summary") {
          return contentState.impactDetailsName ? (
            <SummaryModalWizard
              impactsData={getKeyImpactIndicatorsList(props.impactsData, props.contextData)}
              contentState={contentState}
            />
          ) : undefined;
        }

        if (!config?.ContentComponent) {
          return null;
        }

        return (
          <MdxContentDialog
            dialogId={DIALOG_ID}
            modalsData={props}
            breadcrumbSegments={breadcrumbSegments}
            dataProps={config.dataProps}
            route={route}
            getRouteFn={getRouteFn}
            ContentComponent={config?.ContentComponent}
            disableExport={route.name === "quickImpactsUrbanProject"}
          />
        );
      })()}
    </ImpactModalDescriptionContext.Provider>
  );
}

export default ImpactModalDescriptionProvider;
