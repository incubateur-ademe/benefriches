import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";
import { UrbanPublicSpace, urbanPublicSpace } from "shared";

import { getLabelForPublicSpace } from "@/features/create-project/domain/urbanProject";
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
  publicSpaces: UrbanPublicSpace;
  isSelected: boolean;
  onSelect: () => void;
};

const PublicSpaceTile = ({ publicSpaces, isSelected, onSelect }: PublicSpaceTileProps) => {
  const title = getLabelForPublicSpace(publicSpaces);
  const imgSrc = "";

  return (
    <CheckableTile title={title} imgSrc={imgSrc} isSelected={isSelected} onSelect={onSelect} />
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
                        publicSpaces={value}
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

export default PublicSpacesSelection;
