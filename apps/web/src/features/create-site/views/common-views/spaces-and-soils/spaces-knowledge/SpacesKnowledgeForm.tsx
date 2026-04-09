import { useForm } from "react-hook-form";
import { SiteNature } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onBack: () => void;
  onSubmit: (data: FormValues) => void;
  siteNature?: SiteNature;
};

type FormValues = {
  knowsSpaces: "yes" | "no";
};

const getTitle = (siteNature: SiteNature | undefined) => {
  const baseTitle = `Connaissez-vous les types d'espaces présents sur`;
  switch (siteNature) {
    case "FRICHE":
      return `${baseTitle} la friche ?`;
    case "AGRICULTURAL_OPERATION":
      return `${baseTitle} l'exploitation ?`;
    case "NATURAL_AREA":
      return `${baseTitle} l'espace naturel ?`;
    default:
      return `${baseTitle} le site ?`;
  }
};

export function SpacesKnowledgeForm({ onSubmit, onBack, siteNature }: Props) {
  const { handleSubmit, register, formState } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const error = formState.errors.knowsSpaces;

  return (
    <WizardFormLayout
      title={getTitle(siteNature)}
      instructions={
        <FormInfo>
          <span className="title">Pourquoi renseigner les types d’espaces&nbsp;?</span>

          <p>
            Les types d’espace (bâtiments, voies d’accès ou parking, espace végétal, prairie...)
            vont servir à Bénéfriches à définir la composition des sols et donc à calculer des
            impacts environnementaux.
          </p>
        </FormInfo>
      }
    >
      <form onSubmit={_onSubmit}>
        <RadioButtons
          {...register("knowsSpaces", {
            required: "Ce champ est requis pour déterminer l'étape suivante.",
          })}
          error={error}
          options={[
            {
              label: "Oui, je connais les types d'espaces",
              value: "yes",
            },
            {
              label: "Non, je ne connais pas les types d'espaces",
              value: "no",
              hintText:
                "Bénéfriches affectera automatiquement des types d'espaces correspondant à la nature de votre site, basée sur les moyennes observées.",
            },
          ]}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}
