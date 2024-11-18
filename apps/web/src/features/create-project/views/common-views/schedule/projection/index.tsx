import {
  selectDefaultSchedule,
  selectIsSiteFriche,
} from "@/features/create-project/application/createProject.selectors";
import { Schedule } from "@/features/create-project/domain/project.types";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ScheduleProjectionForm from "./ScheduleProjectionForm";

type Props = {
  onSubmit: (data: {
    firstYearOfOperation: number;
    installationSchedule?: Schedule;
    reinstatementSchedule?: Schedule;
  }) => void;
  onBack: () => void;
  installationScheduleLabel?: string;
};

function ScheduleProjectionFormContainer({
  onSubmit,
  installationScheduleLabel = "Installation du projet",
  ...props
}: Props) {
  const isSiteFriche = useAppSelector(selectIsSiteFriche);
  const defaultSchedule = useAppSelector(selectDefaultSchedule);

  return (
    <ScheduleProjectionForm
      {...props}
      defaultSchedule={defaultSchedule}
      hasReinstatement={isSiteFriche}
      installationScheduleLabel={installationScheduleLabel}
      onSubmit={onSubmit}
    />
  );
}

export default ScheduleProjectionFormContainer;
