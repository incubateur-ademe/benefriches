import Input from "@codegouvfr/react-dsfr/Input";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { ProjectSchedule } from "shared";

import { Schedule } from "@/features/create-project/core/project.types";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import ScheduleField from "./ScheduleField";

function formatDateForInput(date: Date) {
  return format(date, "yyyy-MM-dd");
}

type Props = {
  initialValues: ProjectSchedule;
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
  initialValues,
  hasReinstatement,
  installationScheduleLabel,
  onSubmit,
  onBack,
}: Props) {
  const { handleSubmit, control, formState, register, setValue } = useForm<FormValues>({
    defaultValues: {
      firstYearOfOperation: initialValues.firstYearOfOperations,
      installationSchedule: {
        startDate: formatDateForInput(initialValues.installation.startDate),
        endDate: formatDateForInput(initialValues.installation.endDate),
      },
      reinstatementSchedule: initialValues.reinstatement
        ? {
            startDate: formatDateForInput(initialValues.reinstatement.startDate),
            endDate: formatDateForInput(initialValues.reinstatement.endDate),
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
            onStartDateChange={() => {
              setValue("reinstatementSchedule.endDate", "");
            }}
          />
        )}

        <ScheduleField
          control={control}
          scheduleName="installationSchedule"
          label={installationScheduleLabel}
          onStartDateChange={() => {
            setValue("installationSchedule.endDate", "");
          }}
        />

        <Input
          label={<RequiredLabel label="Mise en service du site" />}
          nativeInputProps={register("firstYearOfOperation", {
            valueAsNumber: true,
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
          })}
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default ScheduleProjectionForm;
