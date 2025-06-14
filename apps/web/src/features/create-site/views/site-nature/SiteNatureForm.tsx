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
  value: SiteNature | "ECONOMIC_ACTIVITY_ZONE" | "RESIDENTIAL_AREA";
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
    value: "ECONOMIC_ACTIVITY_ZONE",
    title: "Zone d'activité économique",
    description: "Commerciale, industrielle, bureaux...",
    imgSrc: "/img/pictograms/site-nature/economic-activity-zone.svg",
    disabled: true,
  },
  {
    value: "RESIDENTIAL_AREA",
    title: "Zone d'habitation",
    description: "Parc résidentiel, îlots anciens dégradés...",
    imgSrc: "/img/pictograms/site-nature/residential-area.svg",
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
        <div className="tw-mb-10">
          <div className="tw-grid sm:tw-grid-cols-2 tw-gap-4">
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
                              <Badge small style="disabled" className="tw-mt-2">
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
