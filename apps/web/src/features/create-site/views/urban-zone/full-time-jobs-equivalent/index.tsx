import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectFullTimeJobsEquivalentViewData } from "@/features/create-site/core/urban-zone/steps/management/full-time-jobs-equivalent/fullTimeJobsEquivalent.selectors";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import FullTimeJobsEquivalentForm from "./FullTimeJobsEquivalentForm";

function FullTimeJobsEquivalentContainer() {
  const dispatch = useAppDispatch();
  const { initialValue } = useAppSelector(selectFullTimeJobsEquivalentViewData);

  return (
    <FullTimeJobsEquivalentForm
      initialValue={initialValue}
      onSubmit={({ fullTimeJobs }) => {
        dispatch(
          stepCompletionRequested({
            stepId: "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
            answers: { fullTimeJobs },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default FullTimeJobsEquivalentContainer;
