import { Controller, useForm } from "react-hook-form";
import { buildingsUse as buildingsUseSchema, BuildingsUse } from "shared";

import {
  getDescriptionForBuildingsUse,
  getLabelForBuildingsUse,
} from "@/features/create-project/domain/urbanProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  buildingsUse: BuildingsUse[];
};

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type BuildingsUseTileProps = {
  buildingsUse: BuildingsUse;
  isSelected: boolean;
  onChange: () => void;
};

const BuildingsUseTile = ({ buildingsUse, isSelected, onChange }: BuildingsUseTileProps) => {
  const title = getLabelForBuildingsUse(buildingsUse);
  const description = getDescriptionForBuildingsUse(buildingsUse);
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
    defaultValues: { buildingsUse: [] },
  });

  return (
    <WizardFormLayout title="Quelles seront les surfaces de plancher de chacun des usages ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-4 tw-mb-10">
          {buildingsUseSchema.options.map((value) => {
            return (
              <Controller
                control={control}
                name="buildingsUse"
                render={({ field }) => {
                  const isSelected = field.value.includes(value);
                  return (
                    <BuildingsUseTile
                      buildingsUse={value}
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
          })}
        </div>
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default BuildingsUseSelection;
