import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";
import { SiteNature } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Badge from "@/shared/views/components/Badge/Badge";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  initialValues?: FormValues;
};

export type FormValues = {
  nature: SiteNature;
};

type Option = {
  value: SiteNature | "URBAN_ZONE";
  title: string;
  description: string;
  imgSrc: string;
  disabled: boolean;
};

const options: Option[] = [
  {
    value: "AGRICULTURAL_OPERATION",
    title: "Exploitation agricole",
    description: "Culture, élevage...",
    imgSrc: "/img/pictograms/site-nature/agricultural-operation.svg",
    disabled: false,
  },
  {
    value: "NATURAL_AREA",
    title: "Espace naturel",
    description: "Forêt, prairie, zone humide...",
    imgSrc: "/img/pictograms/site-nature/natural-area.svg",
    disabled: false,
  },
  {
    value: "URBAN_ZONE",
    title: "Zone urbaine",
    description: "Zone d'activité économique, d'habitation, espace public ou mixte",
    imgSrc: "/img/pictograms/site-nature/urban-zone.svg",
    disabled: true,
  },
] as const satisfies Option[];

function SiteNatureForm({ onSubmit, onBack, initialValues }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const validationError = formState.errors.nature;

  return (
    <WizardFormLayout title="Quelle est la nature du site ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-10">
          <div className="grid sm:grid-cols-2 gap-4">
            {options.map((option) => {
              return (
                <Controller
                  key={option.value}
                  control={control}
                  name="nature"
                  rules={{ required: "Veuillez sélectionner une option." }}
                  render={({ field }) => {
                    const isSelected = field.value === option.value;
                    return (
                      <CheckableTile
                        title={option.title}
                        description={
                          option.disabled ? (
                            <div>
                              <div>{option.description}</div>
                              <Badge small style="green-tilleul" className="mt-2">
                                Bientôt disponible
                              </Badge>
                            </div>
                          ) : (
                            option.description
                          )
                        }
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
          {validationError && <p className={fr.cx("fr-error-text")}>{validationError.message}</p>}
        </div>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteNatureForm;
