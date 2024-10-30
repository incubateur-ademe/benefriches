import { Controller, useForm } from "react-hook-form";
import { UrbanLivingAndActivitySpace, livingAndActivitySpace } from "shared";

import {
  getLabelForLivingAndActivitySpace,
  getPictogramUrlForUrbanLivingAndActivitySpace,
} from "@/features/create-project/domain/urbanProject";
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
  onChange: () => void;
};

const LivingAndActivitySpaceTile = ({
  livingAndActivitySpace,
  isSelected,
  onChange,
}: LivingAndActivitySpaceTileProps) => {
  const title = getLabelForLivingAndActivitySpace(livingAndActivitySpace);
  const imgSrc = getPictogramUrlForUrbanLivingAndActivitySpace(livingAndActivitySpace);

  return (
    <CheckableTile
      title={title}
      imgSrc={imgSrc}
      checked={isSelected}
      onChange={onChange}
      checkType="checkbox"
    />
  );
};

function LivingAndActivitySpacesSelection({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { livingAndActivitySpaces: [] },
  });

  return (
    <WizardFormLayout title="Quels types d'espaces y aura-t-il dans les lieux de vie et d'activité ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="tw-grid tw-grid-cols-[repeat(auto-fill,_260px)] tw-gap-4 tw-mb-10">
          {livingAndActivitySpace.options.map((value) => {
            return (
              <Controller
                key={value}
                control={control}
                name="livingAndActivitySpaces"
                rules={{ required: "Veuillez sélectionner au moins un type d'espace." }}
                render={({ field }) => {
                  const isSelected = field.value.includes(value);
                  return (
                    <LivingAndActivitySpaceTile
                      livingAndActivitySpace={value}
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
            );
          })}
        </div>
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default LivingAndActivitySpacesSelection;
