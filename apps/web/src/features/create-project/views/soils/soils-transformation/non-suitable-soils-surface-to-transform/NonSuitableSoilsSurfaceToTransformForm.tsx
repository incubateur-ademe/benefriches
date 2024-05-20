import { useForm } from "react-hook-form";
import Input from "@codegouvfr/react-dsfr/Input";
import { SoilsDistribution, typedObjectEntries } from "shared";

import { getColorForSoilType } from "@/shared/domain/soils";
import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";
import { sumObjectValues } from "@/shared/services/sum/sum";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SliderNumericInput from "@/shared/views/components/form/NumericInput/SliderNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

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
  const { control, handleSubmit, watch } = useForm<FormValues>({
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
        <>
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
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {typedObjectEntries(soilsToTransform).map(([soilType, surfaceArea]) => {
          const maxValue = surfaceArea as number;
          const marks =
            maxValue > missingSuitableSurfaceArea
              ? {
                  [missingSuitableSurfaceArea]: formatNumberFr(missingSuitableSurfaceArea),
                }
              : {};
          return (
            <SliderNumericInput
              key={soilType}
              control={control}
              name={`soilsTransformation.${soilType}`}
              label={getLabelForSoilType(soilType)}
              maxValue={maxValue}
              sliderStartValue={0}
              sliderEndValue={maxValue}
              sliderProps={{
                marks,
                styles: {
                  track: {
                    background: getColorForSoilType(soilType),
                  },
                },
                tooltip: {
                  formatter: (value?: number) => value && formatSurfaceArea(value),
                },
              }}
              showPercentage={false}
            />
          );
        })}
        <Input
          label="Total des sols à aplanir ou remblayer"
          className="fr-mt-6w"
          hintText="en m²"
          nativeInputProps={{
            value: totalSurfaceEntered,
            min: missingSuitableSurfaceArea,
          }}
          disabled
          state={missesSuitableSurfaceArea ? "error" : "default"}
          stateRelatedMessage={`Vous devez aplanir ou remblayer au moins ${formatSurfaceArea(missingSuitableSurfaceArea)}`}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default NonSuitableSoilsSurfaceToTransformForm;
