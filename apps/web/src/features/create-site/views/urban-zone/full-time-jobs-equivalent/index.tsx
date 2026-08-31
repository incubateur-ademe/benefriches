import { useAppSelector } from "@/app/hooks/store.hooks";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import FullTimeJobsEquivalentForm from "./FullTimeJobsEquivalentForm";

function FullTimeJobsEquivalentContainer() {
  const { onBack, onRequestStepCompletion, selectFullTimeJobsEquivalentViewData } =
    useUrbanZoneSiteForm();
  const { initialValue } = useAppSelector(selectFullTimeJobsEquivalentViewData);

  return (
    <FullTimeJobsEquivalentForm
      initialValue={initialValue}
      onSubmit={({ fullTimeJobs }) => {
        onRequestStepCompletion({
          stepId: "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
          answers: { fullTimeJobs },
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default FullTimeJobsEquivalentContainer;
