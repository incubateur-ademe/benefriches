import Input from "@codegouvfr/react-dsfr/Input";
import { useForm } from "react-hook-form";

import { WorksSchedule } from "@/shared/domain/reconversionProject";
import { getFormattedDuration } from "@/shared/services/dates";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  defaultFirstYearOfOperation: number;
  askForReinstatementSchedule: boolean;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  reinstatementSchedule?: WorksSchedule;
  photovoltaicInstallationSchedule?: WorksSchedule;
  firstYearOfOperation?: number;
};

const FormattedDuration = ({ startDate, endDate }: WorksSchedule) => {
  return (
    <p>
      Soit <strong>{getFormattedDuration(new Date(startDate), new Date(endDate))}</strong>.
    </p>
  );
};

function ScheduleProjectionForm({
  defaultFirstYearOfOperation,
  askForReinstatementSchedule,
  onSubmit,
  onBack,
}: Props) {
  const { handleSubmit, register, control, formState, watch } = useForm<FormValues>({
    defaultValues: {
      firstYearOfOperation: defaultFirstYearOfOperation,
    },
  });

  const { errors } = formState;
  const formValues = watch();
  const {
    reinstatementSchedule: reinstatementError,
    photovoltaicInstallationSchedule: photovoltaicError,
  } = errors;

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
      <form onSubmit={handleSubmit(onSubmit)}>
        {askForReinstatementSchedule && (
          <Fieldset
            legend="Remise en état de la friche"
            state={formState.errors.reinstatementSchedule ? "error" : "default"}
            stateRelatedMessage={
              reinstatementError ? (
                <ul className="tw-m-0">
                  {reinstatementError.startDate && (
                    <li>{reinstatementError.startDate.message ?? ""}</li>
                  )}
                  {reinstatementError.endDate && (
                    <li>{reinstatementError.endDate.message ?? ""}</li>
                  )}
                </ul>
              ) : undefined
            }
          >
            <div className="fr-grid-row fr-grid-row--gutters">
              <Input
                className="fr-col-6"
                label="Début des travaux"
                nativeInputProps={{
                  type: "date",
                  ...register("reinstatementSchedule.startDate"),
                }}
              />
              <Input
                className="fr-col-6"
                label="Fin des travaux"
                nativeInputProps={{
                  type: "date",
                  ...register("reinstatementSchedule.endDate"),
                }}
              />
            </div>
            {formValues.reinstatementSchedule?.startDate &&
            formValues.reinstatementSchedule.endDate ? (
              <FormattedDuration
                startDate={formValues.reinstatementSchedule.startDate}
                endDate={formValues.reinstatementSchedule.endDate}
              />
            ) : null}
          </Fieldset>
        )}
        <Fieldset
          legend="Installation de la centrale photovoltaïque"
          state={formState.errors.photovoltaicInstallationSchedule ? "error" : "default"}
          stateRelatedMessage={
            photovoltaicError ? (
              <ul className="tw-m-0">
                {photovoltaicError.startDate && (
                  <li>{photovoltaicError.startDate.message ?? ""}</li>
                )}
                {photovoltaicError.endDate && <li>{photovoltaicError.endDate.message ?? ""}</li>}
              </ul>
            ) : undefined
          }
        >
          <div className="fr-grid-row fr-grid-row--gutters">
            <Input
              className="fr-col-6"
              label="Début des travaux"
              nativeInputProps={{
                type: "date",
                ...register("photovoltaicInstallationSchedule.startDate"),
              }}
            />

            <Input
              className="fr-col-6"
              label="Fin des travaux"
              nativeInputProps={{
                type: "date",
                ...register("photovoltaicInstallationSchedule.endDate"),
              }}
            />
          </div>
          {formValues.photovoltaicInstallationSchedule?.startDate &&
          formValues.photovoltaicInstallationSchedule.endDate ? (
            <FormattedDuration
              startDate={formValues.photovoltaicInstallationSchedule.startDate}
              endDate={formValues.photovoltaicInstallationSchedule.endDate}
            />
          ) : null}
        </Fieldset>

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
