import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";
import { UrbanLivingAndActivitySpace, livingAndActivitySpace } from "shared";

import { getLabelForLivingAndActivitySpace } from "@/features/create-project/domain/urbanProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  livingAndActivitySpaces: UrbanLivingAndActivitySpace[];
};

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type LivingAndActivitySpaceTileProps = {
  livingAndActivitySpace: UrbanLivingAndActivitySpace;
  isSelected: boolean;
  onSelect: () => void;
};

const LivingAndActivitySpaceTile = ({
  livingAndActivitySpace,
  isSelected,
  onSelect,
}: LivingAndActivitySpaceTileProps) => {
  const title = getLabelForLivingAndActivitySpace(livingAndActivitySpace);
  const imgSrc = "";

  return (
    <CheckableTile title={title} imgSrc={imgSrc} isSelected={isSelected} onSelect={onSelect} />
  );
};

function LivingAndActivitySpacesSelection({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { livingAndActivitySpaces: [] },
  });

  return (
    <WizardFormLayout title="Quels types d'espaces y aura-t-il dans les lieux de vie et d'activité ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mb-5w")}>
          {livingAndActivitySpace.options.map((value) => {
            return (
              <div className={fr.cx("fr-col-12", "fr-col-sm-6")} key={value}>
                <Controller
                  control={control}
                  name="livingAndActivitySpaces"
                  render={({ field }) => {
                    const isSelected = field.value.includes(value);
                    return (
                      <LivingAndActivitySpaceTile
                        livingAndActivitySpace={value}
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

export default LivingAndActivitySpacesSelection;
