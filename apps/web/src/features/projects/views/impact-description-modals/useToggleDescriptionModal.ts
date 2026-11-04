import { useCallback, useMemo } from "react";
import type { Link } from "type-route";

import {
  INITIAL_CONTENT_STATE,
  parseContentState,
  serializeContentState,
  type UpdateModalContentArgs,
} from "./ImpactModalDescriptionContext";
import type { DetailsCode, SectionCode } from "./impactModalUrlCodes";
import { MODAL_CONFIG_GROUPS } from "./useImpactListModalContent";

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

type Props = {
  routeParamsDetails?: string;
  getUpdateRouteDetailsFn: (details?: string) => { link: Link; push: () => void };
};
export default ({ routeParamsDetails, getUpdateRouteDetailsFn }: Props) => {
  const contentState = useMemo(
    () =>
      (routeParamsDetails
        ? parseContentState(routeParamsDetails as `${SectionCode}_${DetailsCode}`)
        : undefined) ?? INITIAL_CONTENT_STATE,
    [routeParamsDetails],
  );

  const getDetailsLink = useCallback(
    (args: UpdateModalContentArgs) => {
      if (!hasModalConfigFor(args)) {
        return undefined;
      }

      return getUpdateRouteDetailsFn(serializeContentState(args)).link;
    },
    [getUpdateRouteDetailsFn],
  );

  const handleClose = useCallback(() => {
    getUpdateRouteDetailsFn(undefined).push();
  }, [getUpdateRouteDetailsFn]);

  const onCloseLink = useMemo(
    () => getUpdateRouteDetailsFn(undefined).link,
    [getUpdateRouteDetailsFn],
  );

  return {
    handleClose,
    getDetailsLink,
    onCloseLink,
    contentState,
  };
};
