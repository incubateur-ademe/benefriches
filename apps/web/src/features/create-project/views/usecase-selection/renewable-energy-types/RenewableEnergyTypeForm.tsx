import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";
import { typedObjectKeys } from "shared";

import { RenewableEnergyDevelopmentPlanType } from "@/shared/core/reconversionProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import TileFormFieldWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldWrapper";
import TileFormFieldsWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldsWrapper";
import TileFormFooterWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFooterWrapper";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import RenewableEnergyTile from "./RenewableEnergyTile";

type Props = {
  initialValues?: FormValues;
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

function RenewableEnergyTypesForm({ initialValues, onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const validationError = formState.errors.renewableEnergyType;

  return (
    <WizardFormLayout title="Quel système d'EnR souhaitez-vous installer&nbsp;?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TileFormFieldsWrapper>
          {typedObjectKeys(options).map((renewableEnergy) => {
            return (
              <TileFormFieldWrapper key={renewableEnergy}>
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
              </TileFormFieldWrapper>
            );
          })}
          <TileFormFooterWrapper tileCount={Object.keys(options).length}>
            {validationError && (
              <p className={fr.cx("fr-error-text", "fr-mb-2w")}>{validationError.message}</p>
            )}
            <BackNextButtonsGroup
              onBack={onBack}
              nextLabel="Valider"
              disabled={!formState.isValid}
            />
          </TileFormFooterWrapper>
        </TileFormFieldsWrapper>
      </form>
    </WizardFormLayout>
  );
}

export default RenewableEnergyTypesForm;
