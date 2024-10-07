import { Controller, useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import RenewableEnergyTile from "./RenewableEnergyTile";

import { RenewableEnergyDevelopmentPlanType } from "@/shared/domain/reconversionProject";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  renewableEnergyType: RenewableEnergyDevelopmentPlanType;
};

const options: Record<RenewableEnergyDevelopmentPlanType, { disabled: boolean }> = {
  PHOTOVOLTAIC_POWER_PLANT: { disabled: false },
  AGRIVOLTAIC: { disabled: true },
  GEOTHERMAL: { disabled: true },
  BIOMASS: { disabled: true },
};

function RenewableEnergyTypesForm({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>();
  const validationError = formState.errors.renewableEnergyType;

  return (
    <WizardFormLayout title="Quel système d'EnR souhaitez-vous installer&nbsp;?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="tw-grid tw-grid-cols-[repeat(auto-fill,_357px)] tw-gap-x-4">
          {typedObjectKeys(options).map((renewableEnergy) => {
            return (
              <div className="tw-mb-4" key={renewableEnergy}>
                <Controller
                  control={control}
                  name="renewableEnergyType"
                  rules={{
                    required: "Veuillez sélectionner au moins un type d'énergie renouvelable.",
                  }}
                  render={({ field }) => {
                    const isSelected = field.value === renewableEnergy;
                    return (
                      <RenewableEnergyTile
                        renewableEnergy={renewableEnergy}
                        disabled={options[renewableEnergy].disabled}
                        isSelected={isSelected}
                        onSelect={() => {
                          field.onChange(renewableEnergy);
                        }}
                      />
                    );
                  }}
                />
              </div>
            );
          })}
          <div className="tw-row-start-5 tw-col-start-1 tw-col-end-[-1]">
            {validationError && (
              <p className={fr.cx("fr-error-text", "fr-mb-2w")}>{validationError.message}</p>
            )}
            <BackNextButtonsGroup
              onBack={onBack}
              nextLabel="Valider"
              disabled={!formState.isValid}
            />
          </div>
        </div>
      </form>
    </WizardFormLayout>
  );
}

export default RenewableEnergyTypesForm;
