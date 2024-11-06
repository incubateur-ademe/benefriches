import { useForm } from "react-hook-form";

import { WorksSchedule } from "@/shared/domain/reconversionProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import ScheduleField from "./ScheduleField";

type Props = {
  defaultFirstYearOfOperation: number;
  schedulesConfig: {
    reinstatement: boolean;
    installation: {
      label: string;
    };
  };
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  reinstatementSchedule?: WorksSchedule;
  installationSchedule?: WorksSchedule;
  firstYearOfOperation: number;
};

const formatScheduleBeforeSubmit = (schedule?: WorksSchedule) => {
  return schedule?.startDate && schedule.endDate ? schedule : undefined;
};

function ScheduleProjectionForm({
  defaultFirstYearOfOperation,
  schedulesConfig,
  onSubmit,
  onBack,
}: Props) {
  const { handleSubmit, control, formState } = useForm<FormValues>({
    defaultValues: {
      firstYearOfOperation: defaultFirstYearOfOperation,
    },
  });

  return (
    <WizardFormLayout
      title="Calendrier"
      instructions={
        <FormInfo>
          <p>L'année de mise en service est proposée par défaut à l'année suivante.</p>
          <p>Vous pouvez modifier cette date.</p>
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
        {schedulesConfig.reinstatement && (
          <ScheduleField
            control={control}
            scheduleName="reinstatementSchedule"
            label="Remise en état de la friche"
          />
        )}

        <ScheduleField
          control={control}
          scheduleName="installationSchedule"
          label={schedulesConfig.installation.label}
        />

        <NumericInput
          label={<RequiredLabel label="Mise en service du site" />}
          name="firstYearOfOperation"
          placeholder="2025"
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
