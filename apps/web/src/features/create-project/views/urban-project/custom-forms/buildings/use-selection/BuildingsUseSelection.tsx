import { Controller, useForm } from "react-hook-form";

import {
  BuildingsUseCategory,
  getDescriptionForBuildingsUseCategory,
  getLabelForBuildingsUseCategory,
} from "@/features/create-project/domain/urbanProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
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
  const imgSrc = "";

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

function BuildingsUseSelection({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { buildingsUseCategories: [] },
  });

  return (
    <WizardFormLayout title="Quelles seront les surfaces de plancher de chacun des usages ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-4 tw-mb-10">
          {(["RESIDENTIAL", "ECONOMIC_ACTIVITY", "MULTI_STORY_PARKING", "OTHER"] as const).map(
            (value) => {
              return (
                <Controller
                  control={control}
                  name="buildingsUseCategories"
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
                  key={value}
                />
              );
            },
          )}
        </div>
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default BuildingsUseSelection;
