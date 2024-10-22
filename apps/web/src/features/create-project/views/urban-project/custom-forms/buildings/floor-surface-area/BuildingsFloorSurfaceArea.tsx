import { useForm } from "react-hook-form";
import { roundTo2Digits } from "shared";

import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  buildingsFootprintSurfaceArea: number;
};

type FormValues = {
  surfaceArea: number;
};

const getFormattedFloorCount = (footprintSurfaceArea: number, floorSurfaceArea: number) => {
  if (floorSurfaceArea === 0) return 0;
  return formatNumberFr(roundTo2Digits(floorSurfaceArea / footprintSurfaceArea));
};

function BuildingsFloorSurfaceArea({ onSubmit, onBack, buildingsFootprintSurfaceArea }: Props) {
  const { control, handleSubmit, watch, formState } = useForm<FormValues>();

  const surface = watch("surfaceArea");

  return (
    <WizardFormLayout
      title="Quelle sera la surface de plancher de l'ensemble des bâtiments ?"
      instructions={
        <FormInfo>
          <p>
            Pour rappel, votre projet d'aménagement des lieux de vie et d'activités comporte{" "}
            <strong>{formatSurfaceArea(buildingsFootprintSurfaceArea)}</strong> de surface au sol de
            bâtiments.
          </p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="surfaceArea"
          label={<RequiredLabel label="Superficie" />}
          addonText={SQUARE_METERS_HTML_SYMBOL}
          rules={{
            required: "Ce champ est requis",
            min: {
              value: 0,
              message: "Veuillez entrer une superficie valide.",
            },
          }}
          control={control}
        />
        {!isNaN(surface) && (
          <p>
            💡 Soit une moyenne de{" "}
            <strong>
              {getFormattedFloorCount(buildingsFootprintSurfaceArea, surface)} niveaux
            </strong>{" "}
            par bâtiment.
          </p>
        )}

        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default BuildingsFloorSurfaceArea;
