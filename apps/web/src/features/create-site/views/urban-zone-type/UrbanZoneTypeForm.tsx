import { Controller, useForm } from "react-hook-form";
import type { UrbanZoneType } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Option = {
  value: UrbanZoneType;
  title: string;
  description: string;
  imgSrc: string;
  disabled: boolean;
};

const options: Option[] = [
  {
    value: "ECONOMIC_ACTIVITY_ZONE",
    title: "Zone d'activités économiques",
    description: "Industrielle, commerciale, tertiaire ou mixte",
    imgSrc: "/img/pictograms/urban-zone-types/economic-activity-zone.svg",
    disabled: false,
  },
  {
    value: "RESIDENTIAL_ZONE",
    title: "Zone d'habitation",
    description: "Pavillons, grand ensemble, îlot ancien dégradé",
    imgSrc: "/img/pictograms/urban-zone-types/residential-zone.svg",
    disabled: true,
  },
  {
    value: "PUBLIC_FACILITY",
    title: "Équipement public",
    description: "Établissement scolaire, équipement sportif, bâtiment public...",
    imgSrc: "/img/pictograms/urban-zone-types/public-facility.svg",
    disabled: true,
  },
  {
    value: "MIXED_URBAN_ZONE",
    title: "Zone urbaine mixte",
    description: "Zone d'activités économiques, d'habitation, équipement public...",
    imgSrc: "/img/pictograms/urban-zone-types/mixed-urban-zone.svg",
    disabled: true,
  },
] as const satisfies Option[];

export type FormValues = {
  urbanZoneType: UrbanZoneType;
};

type Props = {
  initialValues?: Partial<FormValues>;
  onSubmit: (formData: FormValues) => void;
  onBack: () => void;
};

function UrbanZoneTypeForm({ initialValues, onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const error = formState.errors.urbanZoneType;

  return (
    <WizardFormLayout title="De quel type de zone urbaine s'agit-il ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-10">
          <div className="grid sm:grid-cols-2 gap-4">
            {options.map((option) => {
              return (
                <Controller
                  key={option.value}
                  control={control}
                  name="urbanZoneType"
                  rules={{ required: "Veuillez sélectionner un type de zone urbaine." }}
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
                        disabled={option.disabled}
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

export default UrbanZoneTypeForm;
