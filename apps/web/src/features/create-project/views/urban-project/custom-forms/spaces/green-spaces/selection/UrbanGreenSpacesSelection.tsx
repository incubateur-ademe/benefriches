import { Controller, useForm } from "react-hook-form";
import { UrbanGreenSpace, urbanGreenSpaces } from "shared";

import {
  getLabelForUrbanGreenSpace,
  getPictogramUrlForUrbanGreenSpace,
} from "@/features/create-project/domain/urbanProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  greenSpaces: UrbanGreenSpace[];
};

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type GreenSpaceTileProps = {
  greenSpace: UrbanGreenSpace;
  isSelected: boolean;
  onChange: () => void;
};

const GreenSpaceTile = ({ greenSpace, isSelected, onChange }: GreenSpaceTileProps) => {
  const title = getLabelForUrbanGreenSpace(greenSpace);
  const imgSrc = getPictogramUrlForUrbanGreenSpace(greenSpace);

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

function UrbanGreenSpacesSelection({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { greenSpaces: [] },
  });

  return (
    <WizardFormLayout title="Quels types d'espaces souhaitez-vous aménager sur les espaces verts ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="tw-grid tw-grid-cols-[repeat(auto-fill,_300px)] tw-gap-4 tw-mb-10">
          {urbanGreenSpaces.options.map((value) => {
            return (
              <Controller
                key={value}
                control={control}
                name="greenSpaces"
                render={({ field }) => {
                  const isSelected = field.value.includes(value);
                  return (
                    <GreenSpaceTile
                      greenSpace={value}
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

export default UrbanGreenSpacesSelection;
