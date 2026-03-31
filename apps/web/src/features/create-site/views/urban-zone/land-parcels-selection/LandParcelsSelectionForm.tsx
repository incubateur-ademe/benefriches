import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";
import type { UrbanZoneLandParcelType } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import {
  getPictogramForUrbanZoneLandParcelType,
  PARCEL_TYPE_DESCRIPTIONS,
  PARCEL_TYPE_LABELS,
} from "../landParcelTypeMetadata";

type Option = {
  value: UrbanZoneLandParcelType;
  label: string;
  description: string;
  imgSrc: string;
};

const OPTIONS: Option[] = [
  {
    value: "COMMERCIAL_ACTIVITY_AREA",
    label: PARCEL_TYPE_LABELS.COMMERCIAL_ACTIVITY_AREA,
    description: PARCEL_TYPE_DESCRIPTIONS.COMMERCIAL_ACTIVITY_AREA,
    imgSrc: getPictogramForUrbanZoneLandParcelType("COMMERCIAL_ACTIVITY_AREA"),
  },
  {
    value: "PUBLIC_SPACES",
    label: PARCEL_TYPE_LABELS.PUBLIC_SPACES,
    description: PARCEL_TYPE_DESCRIPTIONS.PUBLIC_SPACES,
    imgSrc: getPictogramForUrbanZoneLandParcelType("PUBLIC_SPACES"),
  },
  {
    value: "SERVICED_SURFACE",
    label: PARCEL_TYPE_LABELS.SERVICED_SURFACE,
    description: PARCEL_TYPE_DESCRIPTIONS.SERVICED_SURFACE,
    imgSrc: getPictogramForUrbanZoneLandParcelType("SERVICED_SURFACE"),
  },
  {
    value: "RESERVED_SURFACE",
    label: PARCEL_TYPE_LABELS.RESERVED_SURFACE,
    description: PARCEL_TYPE_DESCRIPTIONS.RESERVED_SURFACE,
    imgSrc: getPictogramForUrbanZoneLandParcelType("RESERVED_SURFACE"),
  },
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
    <WizardFormLayout title="Quels types de surfaces foncières y a-t-il au sein de la zone commerciale ?">
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
                    description={option.description}
                    checkType="checkbox"
                    imgSrc={option.imgSrc}
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
