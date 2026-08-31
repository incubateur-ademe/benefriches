import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectDerivedSiteData } from "@/features/create-site/core/selectors/createSite.selectors";

import NaturalAreaTypeForm, { FormValues } from "./NaturalAreaTypeForm";

export default function NaturalAreaTypeFormContainer() {
  const dispatch = useAppDispatch();
  const naturalAreaType = useAppSelector((state) => selectDerivedSiteData(state).naturalAreaType);

  return (
    <NaturalAreaTypeForm
      initialValues={naturalAreaType ? { type: naturalAreaType } : undefined}
      onSubmit={(data: FormValues) => {
        dispatch(
          stepCompletionRequested({
            stepId: "NATURAL_AREA_TYPE",
            answers: { naturalAreaType: data.type },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}
