import { selectSurfaceAreaInputMode } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { surfaceAreaInputModeUpdated } from "../core/actions/spaces.actions";

export const useSurfaceAreaInputMode = () => {
  const inputMode = useAppSelector(selectSurfaceAreaInputMode);
  const dispatch = useAppDispatch();
  const onInputModeChange = (inputMode: "percentage" | "squareMeters") => {
    dispatch(surfaceAreaInputModeUpdated(inputMode));
  };

  return { inputMode, onInputModeChange };
};
