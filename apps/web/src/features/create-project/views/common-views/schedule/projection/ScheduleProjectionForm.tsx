import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { ProjectSchedule } from "shared";

import { Schedule } from "@/features/create-project/domain/project.types";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import ScheduleField from "./ScheduleField";

function formatDateForInput(date: Date) {
  return format(date, "yyyy-MM-dd");
}

type Props = {
  defaultSchedule: ProjectSchedule;
  hasReinstatement: boolean;
  installationScheduleLabel: string;
  onSubmit: (data: {
    reinstatementSchedule?: Schedule;
    installationSchedule?: Schedule;
    firstYearOfOperation: number;
  }) => void;
  onBack: () => void;
};

export type FormValues = {
  reinstatementSchedule?: Partial<Schedule>;
  installationSchedule?: Partial<Schedule>;
  firstYearOfOperation: number;
};

const formatScheduleBeforeSubmit = (schedule?: Partial<Schedule>): Schedule | undefined => {
  return schedule?.startDate && schedule.endDate
    ? { startDate: schedule.startDate, endDate: schedule.endDate }
    : undefined;
};

function ScheduleProjectionForm({
  defaultSchedule,
  hasReinstatement,
  installationScheduleLabel,
  onSubmit,
  onBack,
}: Props) {
  const { handleSubmit, control, formState } = useForm<FormValues>({
    defaultValues: {
      firstYearOfOperation: defaultSchedule.firstYearOfOperations,
      installationSchedule: {
        startDate: formatDateForInput(defaultSchedule.installation.startDate),
        endDate: formatDateForInput(defaultSchedule.installation.endDate),
      },
      reinstatementSchedule: defaultSchedule.reinstatement
        ? {
            startDate: formatDateForInput(defaultSchedule.reinstatement.startDate),
            endDate: formatDateForInput(defaultSchedule.reinstatement.endDate),
          }
        : undefined,
    },
  });

  return (
    <WizardFormLayout
      title="Calendrier"
      instructions={
        <FormInfo>
          <p>
            Les dates de début et fin des travaux sont proposés par défaut avec une durée d'un an.
          </p>
          <p>
            L'année de mise en service est proposée par défaut à l'année correspondant à la fin des
            travaux.
          </p>
          <p>Vous pouvez modifier ces dates.</p>
        </FormInfo>
      }
    >
      <form
        onSubmit={handleSubmit((formData: FormValues) => {
          onSubmit({
            firstYearOfOperation: formData.firstYearOfOperation,
            installationSchedule: formatScheduleBeforeSubmit(formData.installationSchedule),
            reinstatementSchedule: formatScheduleBeforeSubmit(formData.reinstatementSchedule),
          });
        })}
      >
        {hasReinstatement && (
          <ScheduleField
            control={control}
            scheduleName="reinstatementSchedule"
            label="Remise en état de la friche"
          />
        )}

        <ScheduleField
          control={control}
          scheduleName="installationSchedule"
          label={installationScheduleLabel}
        />

        <NumericInput
          label={<RequiredLabel label="Mise en service du site" />}
          name="firstYearOfOperation"
          control={control}
          allowDecimals={false}
          rules={{
            required:
              "L'année de mise en service est nécessaire pour pouvoir calculer les impacts de votre projet.",
            min: {
              value: 2000,
              message: "Veuillez entrer une année valide",
            },
            max: {
              value: 2100,
              message: "Veuillez entrer une année valide",
            },
          }}
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default ScheduleProjectionForm;
