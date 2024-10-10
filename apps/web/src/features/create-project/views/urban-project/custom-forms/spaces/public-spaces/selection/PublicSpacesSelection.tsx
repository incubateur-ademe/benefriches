import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";
import { UrbanPublicSpace, urbanPublicSpace } from "shared";

import {
  getDescriptionForPublicSpace,
  getLabelForPublicSpace,
} from "@/features/create-project/domain/urbanProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  publicSpaces: UrbanPublicSpace[];
};

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type PublicSpaceTileProps = {
  publicSpace: UrbanPublicSpace;
  isSelected: boolean;
  onChange: () => void;
};

const PublicSpaceTile = ({ publicSpace, isSelected, onChange }: PublicSpaceTileProps) => {
  const title = getLabelForPublicSpace(publicSpace);
  const description = getDescriptionForPublicSpace(publicSpace);
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

function PublicSpacesSelection({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { publicSpaces: [] },
  });

  return (
    <WizardFormLayout title="Quel sera le revêtement des espaces publics ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mb-5w")}>
          {urbanPublicSpace.options.map((value) => {
            return (
              <div className={fr.cx("fr-col-12", "fr-col-sm-6")} key={value}>
                <Controller
                  control={control}
                  name="publicSpaces"
                  render={({ field }) => {
                    const isSelected = field.value.includes(value);
                    return (
                      <PublicSpaceTile
                        publicSpace={value}
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
              </div>
            );
          })}
        </div>
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default PublicSpacesSelection;
