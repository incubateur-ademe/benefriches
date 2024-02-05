import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";

import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  askForReinstatementTimetable: boolean;
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  reinstatementTimetable?: {
    startDate: string;
    endDate: string;
  };
  photovoltaicInstallationTimetable: {
    startDate: string;
    endDate: string;
  };
  firstYearOfOperation: string;
};

function TimetableProjectionForm({ askForReinstatementTimetable, onSubmit }: Props) {
  const { handleSubmit, register, formState } = useForm<FormValues>();

  const { errors } = formState;
  const {
    reinstatementTimetable: reinstatementError,
    photovoltaicInstallationTimetable: photovoltaicError,
  } = errors;

  return (
    <WizardFormLayout title="Calendrier prévisionnel des travaux">
      <form onSubmit={handleSubmit(onSubmit)}>
        {askForReinstatementTimetable && (
          <Fieldset
            legend="Travaux de remise en état de la friche"
            state={formState.errors.reinstatementTimetable ? "error" : "default"}
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
                  ...register("reinstatementTimetable.startDate"),
                }}
              />
              <Input
                className="fr-col-6"
                label="Fin des travaux"
                nativeInputProps={{
                  type: "date",
                  ...register("reinstatementTimetable.endDate"),
                }}
              />
            </div>
          </Fieldset>
        )}
        <Fieldset
          legend="Travaux d’installation des panneaux photovoltaïques"
          state={formState.errors.photovoltaicInstallationTimetable ? "error" : "default"}
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
                ...register("photovoltaicInstallationTimetable.startDate"),
              }}
            />

            <Input
              className="fr-col-6"
              label="Fin des travaux"
              nativeInputProps={{
                type: "date",
                ...register("photovoltaicInstallationTimetable.endDate"),
              }}
            />
          </div>
        </Fieldset>

        <Input
          label="Mise en service du site"
          state={formState.errors.firstYearOfOperation ? "error" : "default"}
          stateRelatedMessage={
            formState.errors.firstYearOfOperation
              ? formState.errors.firstYearOfOperation.message
              : undefined
          }
          nativeInputProps={{
            pattern: "[0-9]{4}",
            ...register("firstYearOfOperation"),
            placeholder: "2025",
          }}
        />
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Suivant",
              nativeButtonProps: { type: "submit" },
            },
          ]}
        />
      </form>
    </WizardFormLayout>
  );
}

export default TimetableProjectionForm;
