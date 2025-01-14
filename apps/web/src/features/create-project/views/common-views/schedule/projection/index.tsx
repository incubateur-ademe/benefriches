import { ProjectSchedule } from "shared";

import { selectIsSiteFriche } from "@/features/create-project/core/createProject.selectors";
import { Schedule } from "@/features/create-project/core/project.types";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ScheduleProjectionForm from "./ScheduleProjectionForm";

type Props = {
  initialValues: ProjectSchedule;
  onSubmit: (data: {
    firstYearOfOperation: number;
    installationSchedule?: Schedule;
    reinstatementSchedule?: Schedule;
  }) => void;
  onBack: () => void;
  installationScheduleLabel?: string;
};

function ScheduleProjectionFormContainer({
  initialValues,
  onSubmit,
  onBack,
  installationScheduleLabel = "Installation du projet",
}: Props) {
  const isSiteFriche = useAppSelector(selectIsSiteFriche);

  return (
    <ScheduleProjectionForm
      initialValues={initialValues}
      hasReinstatement={isSiteFriche}
      installationScheduleLabel={installationScheduleLabel}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default ScheduleProjectionFormContainer;
