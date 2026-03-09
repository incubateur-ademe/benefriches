import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";
import type { UrbanZoneLandParcelType } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Option = {
  value: UrbanZoneLandParcelType;
  label: string;
};

const OPTIONS: Option[] = [
  { value: "COMMERCIAL_ACTIVITY_AREA", label: "Surface d'activité" },
  { value: "PUBLIC_SPACES", label: "Espaces publics" },
  { value: "SERVICED_SURFACE", label: "Surface viabilisée" },
  { value: "RESERVED_SURFACE", label: "Surface réservée" },
];

export type FormValues = {
  landParcelTypes: UrbanZoneLandParcelType[];
};

type Props = {
  initialValues: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function LandParcelsSelectionForm({ initialValues, onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const validationError = formState.errors.landParcelTypes;

  return (
    <WizardFormLayout title="Quelles sont les parcelles présentes sur la zone ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid sm:grid-cols-2 gap-4 my-6">
          {OPTIONS.map((option) => (
            <Controller
              key={option.value}
              control={control}
              name="landParcelTypes"
              rules={{ required: "Veuillez sélectionner au moins un type de parcelle." }}
              render={({ field }) => {
                const isSelected = field.value.includes(option.value);
                return (
                  <CheckableTile
                    title={option.label}
                    checkType="checkbox"
                    imgSrc=""
                    checked={isSelected}
                    onChange={() => {
                      field.onChange(
                        isSelected
                          ? field.value.filter((v) => v !== option.value)
                          : [...field.value, option.value],
                      );
                    }}
                  />
                );
              }}
            />
          ))}
        </div>
        {validationError && (
          <p className={fr.cx("fr-error-text", "fr-mb-1-5v")}>{validationError.message}</p>
        )}
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default LandParcelsSelectionForm;
