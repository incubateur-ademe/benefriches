import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";

import { BENEFRICHES_ENV } from "@/app/application/envVars";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Badge from "@/shared/views/components/Badge/Badge";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import TileFormFieldWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldWrapper";
import TileFormFieldsWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldsWrapper";
import TileFormFooterWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFooterWrapper";
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
    title: "Mode personnalisé",
    description:
      "Renseignez les informations dont vous disposez : aménagement des espaces, bâtiments, dépenses et recettes, emplois mobilisés, etc. Si certaines infos vous manquent, Bénéfriches vous proposera des données automatiques.",
    badgeText: BENEFRICHES_ENV.isUrbanProjectCustomCreationAvailable
      ? "Le plus précis"
      : "Bientôt disponible",
    disabled: !BENEFRICHES_ENV.isUrbanProjectCustomCreationAvailable,
    imgSrc: "/img/pictograms/creation-mode/custom-creation.svg",
  },
] as const;

function CreateModeSelectionForm({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>();
  const validationError = formState.errors.createMode;

  return (
    <WizardFormLayout title="Comment souhaitez-vous créer votre projet ?" fullScreen>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TileFormFieldsWrapper>
          {options.map((option) => {
            return (
              <TileFormFieldWrapper key={option.value}>
                <Controller
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
                            <Badge
                              className="tw-mt-3"
                              style={option.disabled ? "disabled" : "green-tilleul"}
                            >
                              {option.badgeText}
                            </Badge>
                          </>
                        }
                        checked={isSelected}
                        onChange={() => {
                          field.onChange(option.value);
                        }}
                        disabled={option.disabled}
                        imgSrc={option.imgSrc}
                      />
                    );
                  }}
                />
              </TileFormFieldWrapper>
            );
          })}
          <TileFormFooterWrapper tileCount={options.length}>
            {validationError && (
              <p className={fr.cx("fr-error-text", "fr-mb-2w")}>{validationError.message}</p>
            )}
            <BackNextButtonsGroup
              onBack={onBack}
              nextLabel="Valider"
              disabled={!formState.isValid}
            />
          </TileFormFooterWrapper>
        </TileFormFieldsWrapper>
      </form>
    </WizardFormLayout>
  );
}

export default CreateModeSelectionForm;
