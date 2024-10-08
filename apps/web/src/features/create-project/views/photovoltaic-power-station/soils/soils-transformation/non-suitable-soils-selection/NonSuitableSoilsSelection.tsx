import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";
import { SoilsDistribution, SoilType, typedObjectEntries } from "shared";

import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import {
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import classNames from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  soils: SoilType[];
};

type Props = {
  nonSuitableSoils: SoilsDistribution;
  missingSuitableSurfaceArea: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type SoilTypeTileProps = {
  soilType: SoilType;
  surfaceArea: number;
  isSelected: boolean;
  onSelect: () => void;
};

const SoilTypeTile = ({ soilType, surfaceArea, isSelected, onSelect }: SoilTypeTileProps) => {
  const title: string = getLabelForSoilType(soilType);
  const imgSrc = `/img/pictograms/soil-types/${getPictogramForSoilType(soilType)}`;

  return (
    <CheckableTile
      title={title}
      description={`Jusqu'à ${formatSurfaceArea(surfaceArea)} supprimables`}
      imgSrc={imgSrc}
      isSelected={isSelected}
      onSelect={onSelect}
    />
  );
};

function NonSuitableSoilsSelection({
  nonSuitableSoils,
  missingSuitableSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      soils: [],
    },
  });

  const validationError = formState.errors.soils;

  return (
    <WizardFormLayout
      title="Quels espaces souhaitez-vous supprimer ?"
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
          <p>
            Dans l'étape suivante, vous pourrez décider de la superficie de chaque espace à
            supprimer.
          </p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className={classNames(
            "tw-grid",
            "tw-grid-cols-1",
            "sm:tw-grid-cols-2",
            "lg:tw-grid-cols-3",
            "tw-gap-4",
            "fr-mb-5w",
          )}
        >
          {typedObjectEntries(nonSuitableSoils).map(([soilType, surfaceArea]) => {
            return (
              <div key={soilType}>
                <Controller
                  control={control}
                  name="soils"
                  rules={{ required: "Veuillez sélectionner au moins un type de sol." }}
                  render={({ field }) => {
                    const isSelected = field.value.includes(soilType);
                    return (
                      <SoilTypeTile
                        soilType={soilType}
                        surfaceArea={surfaceArea as number}
                        isSelected={isSelected}
                        onSelect={() => {
                          field.onChange(
                            isSelected
                              ? field.value.filter((v) => v !== soilType)
                              : [...field.value, soilType],
                          );
                        }}
                      />
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
        {validationError && <p className={fr.cx("fr-error-text")}>{validationError.message}</p>}
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default NonSuitableSoilsSelection;
