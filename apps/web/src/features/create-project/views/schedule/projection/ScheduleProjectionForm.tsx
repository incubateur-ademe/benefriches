import { useForm } from "react-hook-form";
import Input from "@codegouvfr/react-dsfr/Input";

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
  reinstatementSchedule?: {
    startDate: string;
    endDate: string;
  };
  photovoltaicInstallationSchedule: {
    startDate: string;
    endDate: string;
  };
  firstYearOfOperation?: number;
};

function ScheduleProjectionForm({
  defaultFirstYearOfOperation,
  askForReinstatementSchedule,
  onSubmit,
  onBack,
}: Props) {
  const { handleSubmit, register, control, formState } = useForm<FormValues>({
    defaultValues: {
      firstYearOfOperation: defaultFirstYearOfOperation,
    },
  });

  const { errors } = formState;
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
            legend="Travaux de remise en état de la friche"
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
          </Fieldset>
        )}
        <Fieldset
          legend="Travaux d'installation des panneaux photovoltaïques"
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
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default ScheduleProjectionForm;
