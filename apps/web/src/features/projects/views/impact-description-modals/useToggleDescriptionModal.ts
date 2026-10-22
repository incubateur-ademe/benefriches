import { useCallback, useMemo } from "react";
import type { Link, Route } from "type-route";

import type { routes } from "@/app/router";
import type { embedRoutes } from "@/embed";

import { MODAL_CONFIG_GROUPS } from "./ImpactModalContentWizard";
import {
  INITIAL_CONTENT_STATE,
  parseContentState,
  serializeContentState,
  type UpdateModalContentArgs,
} from "./ImpactModalDescriptionContext";
import type { DetailsCode, SectionCode } from "./impactModalUrlCodes";

type SupportedRoute =
  | Route<typeof routes.projectImpactsBreakEvenLevel>
  | Route<typeof routes.projectImpactsDevelopmentScore>
  | Route<typeof routes.projectImpacts>
  | Route<typeof embedRoutes.routes.quickImpactsUrbanProject>;

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

export default <TRoute extends SupportedRoute>({
  route,
  getRouteFn,
}: {
  route: TRoute;
  getRouteFn: (params: TRoute["params"]) => { link: Link; push: () => void };
}) => {
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

      return getRouteFn({
        ...route.params,
        details: serializeContentState(args),
      }).link;
    },
    [route, getRouteFn],
  );

  const handleClose = useCallback(() => {
    getRouteFn({ ...route.params, details: undefined }).push();
  }, [route, getRouteFn]);

  return {
    handleClose,
    getDetailsLink,
    contentState,
  };
};
