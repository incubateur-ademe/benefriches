import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";
import { ReconversionProjectCreationMode } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import HorizontalCheckableTile from "@/shared/views/components/CheckableTile/HorizontalCheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  initialValues?: FormValues;
};

export type FormValues = {
  createMode: Extract<ReconversionProjectCreationMode, "custom" | "express">;
};

type Option = {
  value: FormValues["createMode"];
  title: string;
  description: string;
  imgSrc: string;
};
const options: Option[] = [
  {
    value: "custom" as const,
    title: "J'ai des données précises ou approximatives",
    description:
      "Bénéfriches réalisera une évaluation au plus près de la réalité de votre projet. S’il vous manque des données, pas de panique, Bénéfriches vous proposera des données préremplies. Vous pourrez aussi revenir plus tard modifier ces données.",
    imgSrc: "/img/pictograms/creation-mode/custom-creation.svg",
  },
  {
    value: "express" as const,
    title: "J'ai pas ou peu de données ou ne sais pas encore ce que je veux faire.",
    description: "Bénéfriches réalisera une évaluation d’un projet d’aménagement “démo”.",
    imgSrc: "/img/icons/demo.svg",
  },
];

function CreateModeSelectionForm({ onSubmit, onBack, initialValues }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const validationError = formState.errors.createMode;

  return (
    <WizardFormLayout title="Que savez vous de votre projet ?">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          {options.map((option) => {
            return (
              <Controller
                key={option.title}
                control={control}
                name="createMode"
                rules={{ required: "Veuillez sélectionner un mode de création." }}
                render={({ field }) => {
                  const isSelected = field.value === option.value;
                  return (
                    <HorizontalCheckableTile
                      title={option.title}
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

        {validationError && (
          <p className={fr.cx("fr-error-text", "fr-mb-2w")}>{validationError.message}</p>
        )}

        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default CreateModeSelectionForm;
