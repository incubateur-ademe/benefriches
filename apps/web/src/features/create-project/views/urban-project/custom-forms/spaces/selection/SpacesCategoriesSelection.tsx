import { Controller, useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import { urbanProjectSpacesCategories, UrbanSpaceCategory } from "shared";

import {
  getDescriptionForUrbanSpaceCategory,
  getLabelForSpaceCategory,
  getPictogramForUrbanSpaceCategory,
} from "@/features/create-project/domain/urbanProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
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
  onSelect: () => void;
};

const SoilTypeTile = ({ spaceCategory, isSelected, onSelect }: SoilTypeTileProps) => {
  const title = getLabelForSpaceCategory(spaceCategory);
  const imgSrc = getPictogramForUrbanSpaceCategory(spaceCategory);

  return (
    <CheckableTile
      title={title}
      description={getDescriptionForUrbanSpaceCategory(spaceCategory)}
      imgSrc={imgSrc}
      isSelected={isSelected}
      onSelect={onSelect}
    />
  );
};

function SpacesCategoriesSelection({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { spaceCategories: [] },
  });

  return (
    <WizardFormLayout title="Quels espaces y aura-t-il dans ce projet urbain ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mb-5w")}>
          {urbanProjectSpacesCategories.options.map((value) => {
            return (
              <div className={fr.cx("fr-col-12", "fr-col-sm-6")} key={value}>
                <Controller
                  control={control}
                  name="spaceCategories"
                  render={({ field }) => {
                    const isSelected = field.value.includes(value);
                    return (
                      <SoilTypeTile
                        spaceCategory={value}
                        isSelected={isSelected}
                        onSelect={() => {
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
              </div>
            );
          })}
        </div>
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default SpacesCategoriesSelection;
