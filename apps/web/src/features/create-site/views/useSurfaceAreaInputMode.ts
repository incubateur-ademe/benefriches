import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectSurfaceAreaInputMode } from "@/features/create-site/core/selectors/createSite.selectors";

import { surfaceAreaInputModeUpdated } from "../core/steps/spaces/spaces.actions";

/**
 * Kept bound to creation's own `state.siteCreation` — its only remaining consumers are the
 * urban-zone sub-flow's land-parcel distribution forms (still creation-only, out of scope until
 * ticket 11). The custom flow's own distribution form reads `inputMode`/`onInputModeChange`
 * through `useCustomSiteForm()` instead (see SiteSpacesDistributionContainer), so it resolves
 * the active flow (create or update) via the injected lens.
 */
export const useSurfaceAreaInputMode = () => {
  const inputMode = useAppSelector(selectSurfaceAreaInputMode);
  const dispatch = useAppDispatch();
  const onInputModeChange = (inputMode: "percentage" | "squareMeters") => {
    dispatch(surfaceAreaInputModeUpdated(inputMode));
  };

  return { inputMode, onInputModeChange };
};
