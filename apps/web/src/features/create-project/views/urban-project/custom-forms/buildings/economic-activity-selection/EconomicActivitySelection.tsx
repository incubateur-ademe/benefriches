import { Controller, useForm } from "react-hook-form";

import {
  BuildingsEconomicActivityUse,
  getDescriptionForBuildingFloorArea,
  getPictogramUrlForEconomicActivityUses,
} from "@/features/create-project/domain/urbanProject";
import { getLabelForBuildingFloorArea } from "@/shared/domain/urbanProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  economicActivityCategories: BuildingsEconomicActivityUse[];
};

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

const ECONOMIC_ACTIVITY_BUILDINGS_USE = [
  "GROUND_FLOOR_RETAIL",
  "TERTIARY_ACTIVITIES",
  "NEIGHBOURHOOD_FACILITIES_AND_SERVICES",
  "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS",
  "SHIPPING_OR_INDUSTRIAL_BUILDINGS",
] as const;

function BuildingsEconomicActivitySelection({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { economicActivityCategories: [] },
  });

  return (
    <WizardFormLayout title="Quel(s) lieu(x) d’activité économique y aura-t-il ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="tw-grid tw-grid-cols-[repeat(auto-fill,_300px)] tw-gap-4 tw-mb-10">
          {ECONOMIC_ACTIVITY_BUILDINGS_USE.map((value) => {
            return (
              <Controller
                control={control}
                name="economicActivityCategories"
                rules={{ required: "Veuillez sélectionner au moins un type de lieu." }}
                render={({ field }) => {
                  const isSelected = field.value.includes(value);
                  return (
                    <CheckableTile
                      title={getLabelForBuildingFloorArea(value)}
                      description={getDescriptionForBuildingFloorArea(value)}
                      imgSrc={getPictogramUrlForEconomicActivityUses(value)}
                      checked={isSelected}
                      checkType="checkbox"
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

export default BuildingsEconomicActivitySelection;
