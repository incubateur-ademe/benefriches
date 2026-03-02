import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectSurfaceAreaInputMode } from "@/features/create-site/core/selectors/createSite.selectors";

import { surfaceAreaInputModeUpdated } from "../core/steps/spaces/spaces.actions";

export const useSurfaceAreaInputMode = () => {
  const inputMode = useAppSelector(selectSurfaceAreaInputMode);
  const dispatch = useAppDispatch();
  const onInputModeChange = (inputMode: "percentage" | "squareMeters") => {
    dispatch(surfaceAreaInputModeUpdated(inputMode));
  };

  return { inputMode, onInputModeChange };
};
