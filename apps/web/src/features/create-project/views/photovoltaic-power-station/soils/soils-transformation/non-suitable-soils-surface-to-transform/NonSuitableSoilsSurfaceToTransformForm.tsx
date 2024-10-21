import Input from "@codegouvfr/react-dsfr/Input";
import { useForm } from "react-hook-form";
import { SoilsDistribution, typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import SoilSurfaceAreaSliderInput from "./SoilSurfaceAreaSliderInput";

export type FormValues = {
  soilsTransformation: SoilsDistribution;
};

type Props = {
  soilsToTransform: SoilsDistribution;
  missingSuitableSurfaceArea: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

const getSoilsTransformationDefaultValue = (
  soilsToTransform: SoilsDistribution,
): SoilsDistribution => {
  return typedObjectKeys(soilsToTransform).reduce<SoilsDistribution>((acc, soilType) => {
    acc[soilType] = 0;
    return acc;
  }, {});
};

function NonSuitableSoilsSurfaceToTransformForm({
  soilsToTransform,
  missingSuitableSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  const { control, handleSubmit, watch, formState } = useForm<FormValues>({
    defaultValues: {
      soilsTransformation: getSoilsTransformationDefaultValue(soilsToTransform),
    },
  });

  const totalSurfaceEntered = sumObjectValues(watch("soilsTransformation"));
  const missesSuitableSurfaceArea = totalSurfaceEntered < missingSuitableSurfaceArea;

  return (
    <WizardFormLayout
      title="Quelle proportion de chaque espace souhaitez-vous supprimer ?"
      instructions={
        <FormInfo>
          <p>
            Vous devez rendre compatible au moins{" "}
            <strong>{formatSurfaceArea(missingSuitableSurfaceArea)}</strong> de sol.
          </p>
          <p>
            Les bâtiments seront démolis et deviendront un <strong>sol perméable minéral</strong>.
          </p>
          <p>
            Les arbres seront coupés. Les sols artificiels arborés deviendront un{" "}
            <strong>sol enherbé et arbustif</strong> tandis que les prairies arborées et les forêts
            deviendront une <strong>prairie herbacée</strong>.
          </p>
          <p>Les zones humides et plans d'eau devront être remblayés.</p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {typedObjectEntries(soilsToTransform).map(([soilType, surfaceArea]) => {
          const maxValue = surfaceArea as number;
          const marks = {
            0: "0",

            [maxValue]: formatNumberFr(maxValue),
          };
          if (maxValue > missingSuitableSurfaceArea) {
            marks[missingSuitableSurfaceArea] = formatNumberFr(missingSuitableSurfaceArea);
          }
          return (
            <SoilSurfaceAreaSliderInput
              soilType={soilType}
              control={control}
              name={`soilsTransformation.${soilType}`}
              marks={marks}
              maxValue={maxValue}
              key={soilType}
            />
          );
        })}
        <Input
          label="Total des sols à aplanir ou remblayer"
          className="tw-mt-12"
          hintText="en m²"
          nativeInputProps={{
            value: totalSurfaceEntered,
            min: missingSuitableSurfaceArea,
          }}
          disabled
          state={missesSuitableSurfaceArea ? "error" : "default"}
          stateRelatedMessage={`Vous devez aplanir ou remblayer au moins ${formatSurfaceArea(missingSuitableSurfaceArea)}`}
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default NonSuitableSoilsSurfaceToTransformForm;
