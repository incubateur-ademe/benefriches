import Alert from "@codegouvfr/react-dsfr/Alert";
import { useEffect } from "react";
import type { SiteNotEditableReason } from "shared";
import { Route } from "type-route";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { routes } from "@/app/router";
import { CustomSiteFormProvider } from "@/features/create-site/views/site-form/CustomSiteFormProvider";
import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import { siteUpdateInitiated } from "../core/updateSite.actions";
import SiteUpdateView from "./SiteUpdateView";

type Props = {
  route: Route<typeof routes.updateSite>;
};

const NOT_EDITABLE_REASON_LABEL: Record<SiteNotEditableReason, string> = {
  NOT_CREATOR: "Seul le créateur de ce site peut le modifier.",
  NOT_CUSTOM: "Ce site n'a pas été créé manuellement et ne peut pas être modifié ici.",
  ACTIVE_RECONVERSION_PROJECT:
    "Ce site est utilisé par un projet de reconversion actif et ne peut pas être modifié.",
};

function UpdateSitePage({ route }: Props) {
  const dispatch = useAppDispatch();
  const currentUserEmail = useAppSelector(selectCurrentUserEmail);
  const { loadingState, isEditable, notEditableReason, nature } = useAppSelector(
    (state) => state.siteUpdate,
  );

  useEffect(() => {
    void dispatch(siteUpdateInitiated(route.params.siteId));
  }, [dispatch, route.params.siteId]);

  if (loadingState !== "success") {
    return (
      <>
        <HtmlTitle>Modifier un site</HtmlTitle>
        <SidebarLayout
          title="Modification du site"
          currentUserEmail={currentUserEmail}
          sidebarChildren={null}
          mainChildren={(() => {
            switch (loadingState) {
              case "error":
                return (
                  <Alert
                    className="md:max-w-xl"
                    severity="error"
                    title="Impossible de charger le site"
                    description="Une erreur s'est produite lors de la récupération du site."
                  />
                );
              case "idle":
              case "loading":
                return <LoadingSpinner />;
            }
          })()}
        />
      </>
    );
  }

  if (isEditable === false) {
    return (
      <>
        <HtmlTitle>Modification impossible</HtmlTitle>
        <SidebarLayout
          title="Modification du site"
          currentUserEmail={currentUserEmail}
          sidebarChildren={null}
          mainChildren={
            <Alert
              className="md:max-w-xl"
              severity="warning"
              title="Ce site ne peut pas être modifié"
              description={
                notEditableReason ? NOT_EDITABLE_REASON_LABEL[notEditableReason] : undefined
              }
            />
          }
        />
      </>
    );
  }

  if (nature === "URBAN_ZONE") {
    return (
      <>
        <HtmlTitle>Modification bientôt disponible</HtmlTitle>
        <SidebarLayout
          title="Modification du site"
          currentUserEmail={currentUserEmail}
          sidebarChildren={null}
          mainChildren={
            <Alert
              className="md:max-w-xl"
              severity="info"
              title="Fonctionnalité bientôt disponible"
              description="La modification des sites en zone urbaine n'est pas encore disponible."
            />
          }
        />
      </>
    );
  }

  return (
    <CustomSiteFormProvider mode="update">
      <SiteUpdateView siteId={route.params.siteId} />
    </CustomSiteFormProvider>
  );
}

export default UpdateSitePage;
