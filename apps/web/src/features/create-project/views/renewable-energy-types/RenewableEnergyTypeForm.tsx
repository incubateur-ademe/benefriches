import { Controller, useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import { RenewableEnergyDevelopmentPlanType } from "../../domain/project.types";
import RenewableEnergyTile from "./RenewableEnergyTile";

import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  renewableEnergyTypes: RenewableEnergyDevelopmentPlanType[];
};

const options: Record<RenewableEnergyDevelopmentPlanType, { disabled: boolean }> = {
  PHOTOVOLTAIC_POWER_PLANT: { disabled: false },
  AGRIVOLTAIC: { disabled: true },
  GEOTHERMAL: { disabled: true },
  BIOMASS: { disabled: true },
};

function RenewableEnergyTypesForm({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { renewableEnergyTypes: [] },
  });
  const validationError = formState.errors.renewableEnergyTypes;

  return (
    <WizardFormLayout title="Quel système d’EnR souhaitez-vous installer ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mb-5w")}>
          {typedObjectKeys(options).map((renewableEnergy) => {
            return (
              <div className={fr.cx("fr-col-6")} key={renewableEnergy}>
                <Controller
                  control={control}
                  name="renewableEnergyTypes"
                  rules={{
                    required: "Veuillez sélectionner au moins un type d'énergie renouvelable.",
                  }}
                  render={({ field }) => {
                    const isSelected = field.value.includes(renewableEnergy);
                    return (
                      <RenewableEnergyTile
                        renewableEnergy={renewableEnergy}
                        disabled={options[renewableEnergy].disabled}
                        isSelected={isSelected}
                        onSelect={() => {
                          field.onChange(
                            isSelected
                              ? field.value.filter((v) => v !== renewableEnergy)
                              : [...field.value, renewableEnergy],
                          );
                        }}
                      />
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
        {validationError && <p className={fr.cx("fr-error-text")}>{validationError.message}</p>}
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default RenewableEnergyTypesForm;
