import { appSettingUpdated, selectAppSettings } from "@/features/app-settings/core/appSettings";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

export const useSurfaceAreaInputMode = () => {
  const inputMode = useAppSelector(selectAppSettings).surfaceAreaInputMode;
  const dispatch = useAppDispatch();
  const onInputModeChange = (inputMode: "percentage" | "squareMeters") => {
    dispatch(appSettingUpdated({ field: "surfaceAreaInputMode", value: inputMode }));
  };

  return { inputMode, onInputModeChange };
};
