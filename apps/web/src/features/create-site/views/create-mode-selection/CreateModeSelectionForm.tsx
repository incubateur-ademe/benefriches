import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { Controller, useForm } from "react-hook-form";
import { SiteNature } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Badge from "@/shared/views/components/Badge/Badge";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  siteNature: SiteNature;
  onSubmit: (data: FormValues) => void;
  onBack?: () => void;
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
  badgeColor: "blue" | "green-tilleul";
};

const options: Option[] = [
  {
    value: "express",
    title: "Mode express",
    description:
      "Renseignez seulement 3 infos : le type de site, sa commune et sa superficie. Bénéfriches affectera des données par défaut sur la répartition des sols, les dépenses de gestion, etc.",
    badgeText: "Le plus rapide",
    badgeColor: "green-tilleul",
    imgSrc: "/img/pictograms/creation-mode/express-creation.svg",
  },
  {
    value: "custom",
    title: "Mode personnalisé",
    description:
      "Renseignez les infos dont vous disposez : type de site, superficie, adresse, répartition des sols, acteurs, dépenses de gestion, etc. Si certaines infos vous manquent, Bénéfriches vous proposera des données automatiques.",
    badgeText: "Le plus précis",
    badgeColor: "blue",
    imgSrc: "/img/pictograms/creation-mode/custom-creation.svg",
  },
] as const satisfies Option[];

const getTitle = (siteNature: SiteNature) => {
  const withSiteNature = (natureLabel: string) =>
    `Comment souhaitez-vous renseigner les informations ${natureLabel} ?`;
  switch (siteNature) {
    case "FRICHE":
      return withSiteNature("de la friche");
    case "AGRICULTURAL_OPERATION":
      return withSiteNature("de l'exploitation agricole");
    case "NATURAL_AREA":
      return withSiteNature("de l'espace naturel");
  }
};

function CreateModeSelectionForm({ siteNature, onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>();
  const validationError = formState.errors.createMode;

  return (
    <WizardFormLayout title={getTitle(siteNature)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="tw-mb-10">
          <div className="tw-grid sm:tw-grid-cols-2 tw-gap-4">
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
                            <Badge className="tw-mt-3" style={option.badgeColor}>
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
        {onBack ? (
          <BackNextButtonsGroup onBack={onBack} />
        ) : (
          <Button nativeButtonProps={{ type: "submit", disabled: !formState.isValid }}>
            Valider
          </Button>
        )}
      </form>
    </WizardFormLayout>
  );
}

export default CreateModeSelectionForm;
