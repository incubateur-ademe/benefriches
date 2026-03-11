import { useForm } from "react-hook-form";
import type { UrbanZoneLandParcelType } from "shared";

import {
  formatNumberFr,
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import { PARCEL_TYPE_LABELS } from "../parcelTypeLabels";

export type FormValues = {
  buildingsFloorSurfaceArea: number;
};

type Props = {
  currentParcelType: UrbanZoneLandParcelType;
  buildingsFootprintSurfaceArea: number;
  initialValue?: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function LandParcelBuildingsFloorAreaForm({
  currentParcelType,
  buildingsFootprintSurfaceArea,
  initialValue,
  onSubmit,
  onBack,
}: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      buildingsFloorSurfaceArea: initialValue,
    },
  });

  const parcelLabel = PARCEL_TYPE_LABELS[currentParcelType];

  return (
    <WizardFormLayout
      title={`Surface de plancher des bâtiments de la ${parcelLabel.toLowerCase()}`}
      instructions={`Pour rappel, la surface au sol des bâtiments est de ${formatSurfaceArea(buildingsFootprintSurfaceArea)}`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowNumericInput
          label="Surface de plancher"
          addonText={SQUARE_METERS_HTML_SYMBOL}
          nativeInputProps={register("buildingsFloorSurfaceArea", {
            required: "Ce champ est requis.",
            min: { value: 1, message: "La surface doit être supérieure à 0." },
            valueAsNumber: true,
          })}
          state={formState.errors.buildingsFloorSurfaceArea ? "error" : "default"}
          stateRelatedMessage={formState.errors.buildingsFloorSurfaceArea?.message}
        />
        {initialValue && (
          <p>
            Valeur actuelle : {formatNumberFr(initialValue)} {SQUARE_METERS_HTML_SYMBOL}
          </p>
        )}
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default LandParcelBuildingsFloorAreaForm;
