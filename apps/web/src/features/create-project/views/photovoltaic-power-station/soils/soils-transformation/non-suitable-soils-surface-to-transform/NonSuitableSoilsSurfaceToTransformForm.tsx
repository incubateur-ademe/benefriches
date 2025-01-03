import { useForm } from "react-hook-form";
import { SoilsDistribution, typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/services/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
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
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    defaultValues: {
      soilsTransformation: getSoilsTransformationDefaultValue(soilsToTransform),
    },
  });

  const totalSurfaceEntered = sumObjectValues(watch("soilsTransformation"));
  const totalSurfaceEnteredIsValid = totalSurfaceEntered >= missingSuitableSurfaceArea;

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
          const soilSurfaceArea = surfaceArea as number;
          const nativeInputProps = register(`soilsTransformation.${soilType}`, {
            ...optionalNumericFieldRegisterOptions,
            max: {
              value: soilSurfaceArea,
              message: `La superficie de ce sol est de ${formatSurfaceArea(soilSurfaceArea)}.`,
            },
          });
          const error =
            formState.errors.soilsTransformation && formState.errors.soilsTransformation[soilType];
          return (
            <RowDecimalsNumericInput
              key={soilType}
              hintText={getDescriptionForSoilType(soilType)}
              addonText={SQUARE_METERS_HTML_SYMBOL}
              label={getLabelForSoilType(soilType)}
              imgSrc={getPictogramForSoilType(soilType)}
              nativeInputProps={nativeInputProps}
              state={error ? "error" : "default"}
              stateRelatedMessage={error?.message}
              hintInputText={`Maximum ${formatSurfaceArea(soilSurfaceArea)}`}
            />
          );
        })}
        <RowNumericInput
          className="tw-pb-5"
          label="Total des sols à aplanir ou remblayer"
          addonText={SQUARE_METERS_HTML_SYMBOL}
          nativeInputProps={{
            value: totalSurfaceEntered,
            min: missingSuitableSurfaceArea,
            type: "number",
          }}
          disabled
          state={totalSurfaceEnteredIsValid ? "success" : "warning"}
          stateRelatedMessage={
            totalSurfaceEnteredIsValid
              ? "Le compte est bon !"
              : `${formatSurfaceArea(Math.abs(missingSuitableSurfaceArea - totalSurfaceEntered))} manquants`
          }
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default NonSuitableSoilsSurfaceToTransformForm;
