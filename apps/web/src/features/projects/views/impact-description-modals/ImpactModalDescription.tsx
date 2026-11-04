import type { ReactNode } from "react";
import { useMemo } from "react";
import type { Link } from "type-route";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";

import { ImpactModalDescriptionContext } from "./ImpactModalDescriptionContext";
import { getBreadcrumbProps } from "./breadcrumb";
import MdxContentDialog from "./lazy-component/MdxContentDialog";
import useImpactListModalContent from "./useImpactListModalContent";
import useToggleDescriptionModal from "./useToggleDescriptionModal";

const DIALOG_ID = "impact-modal-description";

function ImpactModalDescriptionProvider({
  children,
  routeParamsDetails,
  getUpdateRouteDetailsFn,
  ...props
}: ModalDataProps & {
  children: ReactNode;
  routeParamsDetails?: string;
  getUpdateRouteDetailsFn: (details?: string) => { link: Link; push: () => void };
}) {
  const isOpen = Boolean(routeParamsDetails);

  const { contentState, handleClose, getDetailsLink, onCloseLink } = useToggleDescriptionModal({
    routeParamsDetails,
    getUpdateRouteDetailsFn,
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
      contentState.sectionName && contentState.sectionName !== "breakEvenLevel"
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

        if (!config?.ContentComponent) {
          return null;
        }

        return (
          <MdxContentDialog
            dialogId={DIALOG_ID}
            modalsData={props}
            breadcrumbSegments={breadcrumbSegments}
            dataProps={config.dataProps}
            routeParamsDetails={routeParamsDetails}
            getUpdateRouteDetailsFn={getUpdateRouteDetailsFn}
            ContentComponent={config?.ContentComponent}
          />
        );
      })()}
    </ImpactModalDescriptionContext.Provider>
  );
}

export default ImpactModalDescriptionProvider;
