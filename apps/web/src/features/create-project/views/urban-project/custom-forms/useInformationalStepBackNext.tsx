import { useCallback } from "react";

import {
  navigateToNext,
  navigateToPrevious,
} from "@/features/create-project/core/urban-project/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

export const useInformationalStepBackNext = () => {
  const dispatch = useAppDispatch();

  const onBack = useCallback(() => {
    dispatch(navigateToPrevious());
  }, [dispatch]);

  const onNext = useCallback(() => {
    dispatch(navigateToNext());
  }, [dispatch]);

  return { onBack, onNext };
};
