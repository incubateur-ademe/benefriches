import { Controller, useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import CreateModeOption from "./CreateModeOption";

import AboutFormsModal from "@/shared/app-settings/views/AboutFormsModal";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  createMode: "express" | "custom";
};

type Option = {
  value: FormValues["createMode"];
  title: string;
  description: string;
  imgSrc: string;
  badgeText: string;
  disabled: boolean;
};

const options: Option[] = [
  {
    value: "express",
    title: "Mode express",
    description:
      "Un projet d'aménagement de quartier sera créé automatiquement. Bénéfriches affectera des données par défaut sur l'aménagement des espaces, les bâtiments, les dépenses et recettes, les emplois mobilisés, etc.",
    badgeText: "Le plus rapide",
    disabled: false,
    imgSrc: "/img/pictograms/creation-mode/express-creation.svg",
  },
  {
    value: "custom",
    title: "Mode custom",
    description:
      "Renseignez les informations dont vous disposez : aménagement des espaces, bâtiments, dépenses et recettes, emplois mobilisés, etc. Si certaines infos vous manquent, Bénéfriches vous proposera des données automatiques.",
    badgeText: "Bientôt disponible",
    disabled: true,
    imgSrc: "/img/pictograms/creation-mode/custom-creation.svg",
  },
] as const;

function CreateModeSelectionForm({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>();
  const validationError = formState.errors.createMode;

  return (
    <>
      <AboutFormsModal />
      <WizardFormLayout title="Comment souhaitez-vous créer votre projet ?">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={fr.cx("fr-mb-5w")}>
            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              {options.map((option) => {
                return (
                  <div className={fr.cx("fr-col-12", "fr-col-md-6")} key={option.value}>
                    <Controller
                      control={control}
                      name="createMode"
                      rules={{ required: "Veuillez sélectionner un mode de création." }}
                      render={({ field }) => {
                        const isSelected = field.value === option.value;
                        return (
                          <CreateModeOption
                            checked={isSelected}
                            onChange={() => {
                              field.onChange(option.value);
                            }}
                            title={option.title}
                            description={option.description}
                            badgeText={option.badgeText}
                            disabled={option.disabled}
                            imgSrc={option.imgSrc}
                          />
                        );
                      }}
                    />
                  </div>
                );
              })}
            </div>
            {validationError && <p className={fr.cx("fr-error-text")}>{validationError.message}</p>}
          </div>
          <BackNextButtonsGroup onBack={onBack} />
        </form>
      </WizardFormLayout>
    </>
  );
}

export default CreateModeSelectionForm;
