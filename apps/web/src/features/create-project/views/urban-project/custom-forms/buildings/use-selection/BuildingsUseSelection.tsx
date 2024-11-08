import { Controller, useForm } from "react-hook-form";

import {
  BuildingsUseCategory,
  getDescriptionForBuildingsUseCategory,
  getLabelForBuildingsUseCategory,
  getPictogramUrlForBuildingsUseCategory,
} from "@/features/create-project/domain/urbanProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import TileFormFieldWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldWrapper";
import TileFormFieldsWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldsWrapper";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  buildingsUseCategories: BuildingsUseCategory[];
};

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type BuildingsUseCategoryTileProps = {
  buildingsUseCategory: BuildingsUseCategory;
  isSelected: boolean;
  onChange: () => void;
};

const BuildingsUseCategoryTile = ({
  buildingsUseCategory,
  isSelected,
  onChange,
}: BuildingsUseCategoryTileProps) => {
  const title = getLabelForBuildingsUseCategory(buildingsUseCategory);
  const description = getDescriptionForBuildingsUseCategory(buildingsUseCategory);
  const imgSrc = getPictogramUrlForBuildingsUseCategory(buildingsUseCategory);

  return (
    <CheckableTile
      title={title}
      description={description}
      imgSrc={imgSrc}
      checked={isSelected}
      onChange={onChange}
      checkType="checkbox"
    />
  );
};

const BUILDINGS_USES = [
  "RESIDENTIAL",
  "ECONOMIC_ACTIVITY",
  "MULTI_STORY_PARKING",
  "OTHER",
] as const;
function BuildingsUseSelection({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { buildingsUseCategories: [] },
  });

  return (
    <WizardFormLayout
      title="Quels usages auront les bâtiments ?"
      instructions="Plusieurs réponses possibles."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <TileFormFieldsWrapper small>
          {BUILDINGS_USES.map((value) => {
            return (
              <TileFormFieldWrapper key={value}>
                <Controller
                  control={control}
                  name="buildingsUseCategories"
                  rules={{ required: "Veuillez sélectionner au moins un type d'usage." }}
                  render={({ field }) => {
                    const isSelected = field.value.includes(value);
                    return (
                      <BuildingsUseCategoryTile
                        buildingsUseCategory={value}
                        isSelected={isSelected}
                        onChange={() => {
                          field.onChange(
                            isSelected
                              ? field.value.filter((v) => v !== value)
                              : [...field.value, value],
                          );
                        }}
                      />
                    );
                  }}
                />
              </TileFormFieldWrapper>
            );
          })}
        </TileFormFieldsWrapper>
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default BuildingsUseSelection;
