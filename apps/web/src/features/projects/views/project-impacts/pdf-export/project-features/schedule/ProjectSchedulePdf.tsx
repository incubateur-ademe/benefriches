import { getFormattedDuration } from "@/shared/core/dates";

import DataLine from "../../components/DataLine";
import FeaturesSection from "../../components/FeaturesSection";

type Props = {
  reinstatementSchedule?: {
    startDate: string;
    endDate: string;
  };
  installationSchedule?: {
    startDate: string;
    endDate: string;
  };
  firstYearOfOperation?: number;
};

export default function ProjectSchedulePdf({
  reinstatementSchedule,
  installationSchedule,
  firstYearOfOperation,
}: Props) {
  const reinstatementStartDate = reinstatementSchedule
    ? new Date(reinstatementSchedule.startDate)
    : undefined;
  const reinstatementEndDate = reinstatementSchedule
    ? new Date(reinstatementSchedule.endDate)
    : undefined;
  const installationStartDate = installationSchedule
    ? new Date(installationSchedule.startDate)
    : undefined;
  const installationEndDate = installationSchedule
    ? new Date(installationSchedule.endDate)
    : undefined;

  return (
    <FeaturesSection title="📆 Calendrier">
      {reinstatementStartDate && reinstatementEndDate && (
        <DataLine
          label="Travaux de remise en état de la friche"
          value={`${reinstatementStartDate.toLocaleDateString()} - ${reinstatementEndDate.toLocaleDateString()} (${getFormattedDuration(reinstatementStartDate, reinstatementEndDate)})`}
          bold
        />
      )}
      {installationStartDate && installationEndDate && (
        <DataLine
          label="Aménagement du site"
          value={`${installationStartDate.toLocaleDateString()} - ${installationEndDate.toLocaleDateString()} (${getFormattedDuration(installationStartDate, installationEndDate)})`}
          bold
        />
      )}
      <DataLine
        label="Année de mise en service du site"
        labelClassName="font-bold"
        value={firstYearOfOperation ?? "Non renseigné"}
      />
    </FeaturesSection>
  );
}
