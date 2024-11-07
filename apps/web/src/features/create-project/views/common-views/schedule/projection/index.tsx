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
  const projectSite = useAppSelector((state) => state.projectCreation.siteData);

  return (
    <ScheduleProjectionForm
      {...props}
      schedulesConfig={{
        reinstatement: projectSite?.isFriche ?? false,
        installation: { label: installationScheduleLabel },
      }}
      defaultFirstYearOfOperation={new Date().getFullYear() + 1}
      onSubmit={onSubmit}
    />
  );
}

export default ScheduleProjectionFormContainer;
