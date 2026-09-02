import { useMemo } from "react";

import { routes, useRoute } from "@/app/router";
import { SidebarLayoutProps } from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import { buildSiteUpdateSidebarActions } from "./siteUpdateSidebarActions";

type Props = {
  siteId: string;
  onSave: () => void;
  saveState: "idle" | "dirty" | "loading" | "success" | "error";
  isFormValid: boolean;
};

/**
 * Thin wiring hook: computes the route-dependent `goBackProps` (unchanged from the previous
 * inline memo in `SiteUpdateView`) and delegates to the pure `buildSiteUpdateSidebarActions`.
 */
export const useSiteUpdateSidebarActions = ({
  siteId,
  onSave,
  saveState,
  isFormValid,
}: Props): SidebarLayoutProps["actions"] => {
  const currentRoute = useRoute();

  const goBackProps = useMemo(() => {
    if (
      currentRoute.name === routes.updateSite.name &&
      currentRoute.params.from === "evaluations"
    ) {
      return { linkProps: routes.myEvaluations().link, text: "Retour à mes évaluations" };
    }
    return {
      linkProps: routes.siteFeatures({ siteId }).link,
      text: "Retour aux détails du site",
    };
  }, [currentRoute, siteId]);

  return useMemo(
    () => buildSiteUpdateSidebarActions({ saveState, isFormValid, onSave, goBackProps }),
    [saveState, isFormValid, onSave, goBackProps],
  );
};
