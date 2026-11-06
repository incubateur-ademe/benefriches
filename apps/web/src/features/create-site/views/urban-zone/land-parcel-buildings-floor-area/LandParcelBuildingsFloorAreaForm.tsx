import { useForm } from "react-hook-form";
import type { UrbanZoneLandParcelType } from "shared";

import {
  formatNumberFr,
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import { getLandParcelTypeLabelWithDeArticle } from "../landParcelTypeMetadata";

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
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    defaultValues: {
      buildingsFloorSurfaceArea: initialValue,
    },
  });

  // Unlike the urban project wizard, this is a warning, not a block: some existing urban zone
  // buildings (e.g. warehouses, open structures) may count little or no floor area.
  const buildingsFloorSurfaceArea = watch("buildingsFloorSurfaceArea");
  const isBelowBuildingsFootprint =
    Number.isFinite(buildingsFloorSurfaceArea) &&
    buildingsFloorSurfaceArea > 0 &&
    buildingsFloorSurfaceArea < buildingsFootprintSurfaceArea;

  const parcelLabel = getLandParcelTypeLabelWithDeArticle(currentParcelType);

  return (
    <WizardFormLayout
      title={`Surface de plancher des bâtiments ${parcelLabel}`}
      instructions={
        <FormInfo>
          Pour rappel, la surface au sol des bâtiments est de{" "}
          {formatSurfaceArea(buildingsFootprintSurfaceArea)}
        </FormInfo>
      }
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
          state={
            formState.errors.buildingsFloorSurfaceArea
              ? "error"
              : isBelowBuildingsFootprint
                ? "warning"
                : "default"
          }
          stateRelatedMessage={
            formState.errors.buildingsFloorSurfaceArea?.message ??
            (isBelowBuildingsFootprint
              ? "La surface de plancher est inférieure à la surface au sol des bâtiments. Vérifiez la valeur saisie."
              : undefined)
          }
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
