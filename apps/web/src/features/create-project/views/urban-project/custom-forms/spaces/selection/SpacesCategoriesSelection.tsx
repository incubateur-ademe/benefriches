import { Controller, useForm } from "react-hook-form";
import { urbanProjectSpacesCategories, UrbanSpaceCategory } from "shared";

import {
  getDescriptionForUrbanSpaceCategory,
  getLabelForSpaceCategory,
  getPictogramForUrbanSpaceCategory,
} from "@/features/create-project/domain/urbanProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import TileFormFieldWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldWrapper";
import TileFormFieldsWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldsWrapper";
import TileFormFooterWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFooterWrapper";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  spaceCategories: UrbanSpaceCategory[];
};

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type SoilTypeTileProps = {
  spaceCategory: UrbanSpaceCategory;
  isSelected: boolean;
  onChange: () => void;
};

const SoilTypeTile = ({ spaceCategory, isSelected, onChange }: SoilTypeTileProps) => {
  const title = getLabelForSpaceCategory(spaceCategory);
  const imgSrc = getPictogramForUrbanSpaceCategory(spaceCategory);

  return (
    <CheckableTile
      title={title}
      description={getDescriptionForUrbanSpaceCategory(spaceCategory)}
      imgSrc={imgSrc}
      checked={isSelected}
      onChange={onChange}
      checkType="checkbox"
    />
  );
};

function SpacesCategoriesSelection({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { spaceCategories: [] },
  });

  return (
    <WizardFormLayout title="Quels espaces y aura-t-il dans ce projet urbain ?" fullScreen>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TileFormFieldsWrapper small>
          {urbanProjectSpacesCategories.options.map((value) => {
            return (
              <TileFormFieldWrapper key={value}>
                <Controller
                  control={control}
                  name="spaceCategories"
                  render={({ field }) => {
                    const isSelected = field.value.includes(value);
                    return (
                      <SoilTypeTile
                        spaceCategory={value}
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
          <TileFormFooterWrapper tileCount={urbanProjectSpacesCategories.options.length}>
            <BackNextButtonsGroup
              onBack={onBack}
              nextLabel="Valider"
              disabled={!formState.isValid}
            />
          </TileFormFooterWrapper>
        </TileFormFieldsWrapper>
      </form>
    </WizardFormLayout>
  );
}

export default SpacesCategoriesSelection;
