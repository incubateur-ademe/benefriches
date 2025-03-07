import { Controller, useForm } from "react-hook-form";
import { NaturalAreaType, getLabelForNaturalAreaType } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Option = {
  value: NaturalAreaType;
  title: string;
  description: string;
  imgSrc: string;
};

const options: Option[] = [
  {
    value: "PRAIRIE",
    title: getLabelForNaturalAreaType("PRAIRIE"),
    description: "Herbacée, arbustive ou arborée",
    imgSrc: "/img/pictograms/natural-area-types/prairie.svg",
  },
  {
    value: "FOREST",
    title: getLabelForNaturalAreaType("FOREST"),
    description: "De feuillus, conifères, peupliers ou mixte",
    imgSrc: "/img/pictograms/natural-area-types/forest.svg",
  },
  {
    value: "WET_LAND",
    title: getLabelForNaturalAreaType("WET_LAND"),
    description: "Marais, tourbières, prairies humides, mangrove, lagune...",
    imgSrc: "/img/pictograms/natural-area-types/wet-land.svg",
  },
  {
    value: "MIXED_NATURAL_AREA",
    title: getLabelForNaturalAreaType("MIXED_NATURAL_AREA"),
    description: "Prairie, forêt, zone humide, plan d'eau",
    imgSrc: "/img/pictograms/natural-area-types/mixed.svg",
  },
] as const satisfies Option[];

export type FormValues = {
  type: NaturalAreaType;
};

type Props = {
  initialValues?: Partial<FormValues>;
  onSubmit: (formData: FormValues) => void;
  onBack: () => void;
};

const requiredMessage =
  "Si vous ne savez pas qualifier l'espace naturel, sélectionnez « Espace naturel mixte ».";

function NaturalAreaTypeForm({ initialValues, onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const error = formState.errors.type;

  return (
    <WizardFormLayout title="De quel type d'espace naturel s'agit-il ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="tw-my-10">
          <div className="tw-grid sm:tw-grid-cols-2 tw-gap-4">
            {options.map((option) => {
              return (
                <Controller
                  key={option.value}
                  control={control}
                  name="type"
                  rules={{ required: requiredMessage }}
                  render={({ field }) => {
                    const isSelected = field.value === option.value;
                    return (
                      <CheckableTile
                        title={option.title}
                        checkType="radio"
                        description={option.description}
                        checked={isSelected}
                        onChange={() => {
                          field.onChange(option.value);
                        }}
                        imgSrc={option.imgSrc}
                      />
                    );
                  }}
                />
              );
            })}
          </div>
          {error && <p className="fr-error-text">{error.message}</p>}
        </div>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default NaturalAreaTypeForm;
