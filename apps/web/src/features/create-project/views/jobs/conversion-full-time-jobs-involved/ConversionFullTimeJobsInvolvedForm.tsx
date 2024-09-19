import { Controller, useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  askForReinstatementFullTimeJobs: boolean;
  defaultValues: {
    fullTimeJobs?: number;
    reinstatementFullTimeJobs?: number;
  };
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  reinstatementFullTimeJobs?: number;
  fullTimeJobs?: number;
};

function ConversionFullTimeJobsInvolvedForm({
  askForReinstatementFullTimeJobs,
  defaultValues,
  onSubmit,
  onBack,
}: Props) {
  const { handleSubmit, control, watch } = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: {
      fullTimeJobs: defaultValues.fullTimeJobs,
      reinstatementFullTimeJobs: defaultValues.reinstatementFullTimeJobs,
    },
  });

  const { fullTimeJobs, reinstatementFullTimeJobs } = watch();

  return (
    <WizardFormLayout
      title="ETP mobilisés pour la reconversion du site"
      instructions={
        <FormInfo>
          <p>
            Nombre d’emplois équivalent temps plein calculé d’après les dépenses que vous avez
            renseignées à l’étape précédente et le nombre d’emplois par € de chiffre d’affaires des
            secteurs d’activités concernés (ex : dépollution, déconstruction, gestion de déchets,
            photovoltaïque) en France.
          </p>
          <p>
            Il s’agit des emplois mobilisés pendant la durée de la reconversion (étude et travaux).
          </p>
          <p>Vous pouvez modifier ces valeurs.</p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {askForReinstatementFullTimeJobs && (
          <Controller
            control={control}
            name="reinstatementFullTimeJobs"
            rules={{
              min: {
                value: 0,
                message: "Veuillez entrer un montant valide",
              },
            }}
            render={(controller) => {
              return (
                <ControlledRowNumericInput
                  {...controller}
                  label="Remise en état de la friche"
                  className="!tw-pt-4 !tw-mb-3"
                />
              );
            }}
          />
        )}
        <Controller
          control={control}
          name="fullTimeJobs"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                {...controller}
                label="Installation des panneaux photovoltaïques"
                className="!tw-pt-4 !tw-mb-8"
              />
            );
          }}
        />
        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={!fullTimeJobs && !reinstatementFullTimeJobs ? "Passer" : "Valider"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default ConversionFullTimeJobsInvolvedForm;
