import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { Controller, useForm } from "react-hook-form";

import Badge from "@/shared/views/components/Badge/Badge";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  createMode: "express" | "custom";
};

type Option = {
  value: FormValues["createMode"];
  title: string;
  description?: string;
  imgSrc: string;
  badgeText: string;
  badgeColor: "blue" | "green-tilleul";
};

const options: Option[] = [
  {
    value: "custom",
    title: "Évaluer mon site",
    badgeText: "Analyse des impacts socio-économiques",
    badgeColor: "green-tilleul",
    imgSrc: "/img/pictograms/creation-mode/custom-creation.svg",
  },
  {
    value: "express",
    title: "Évaluer un site et un projet demo",
    badgeText: "Découverte de l’outil en 30 secondes",
    badgeColor: "blue",
    imgSrc: "/img/icons/demo.svg",
  },
];

function CreateModeSelectionForm({ onSubmit }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>();
  const validationError = formState.errors.createMode;
  return (
    <WizardFormLayout title="Que souhaitez-vous évaluer&nbsp;?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-10">
          <div className="grid sm:grid-cols-2 gap-4">
            {options.map((option) => {
              return (
                <Controller
                  key={option.value}
                  control={control}
                  name="createMode"
                  rules={{ required: "Veuillez sélectionner un mode de création." }}
                  render={({ field }) => {
                    const isSelected = field.value === option.value;

                    return (
                      <CheckableTile
                        title={option.title}
                        description={
                          <>
                            <div>{option.description}</div>
                            <Badge className="mt-3" style={option.badgeColor}>
                              {option.badgeText}
                            </Badge>
                          </>
                        }
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
          {validationError && <p className={fr.cx("fr-error-text")}>{validationError.message}</p>}
        </div>
        <Button
          className="float-right"
          nativeButtonProps={{ type: "submit", disabled: !formState.isValid }}
        >
          Valider
        </Button>
      </form>
    </WizardFormLayout>
  );
}

export default CreateModeSelectionForm;
