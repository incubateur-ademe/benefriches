import { useForm } from "react-hook-form";
import { SiteNature } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onBack: () => void;
  onSubmit: (data: FormValues) => void;
  siteNature?: SiteNature;
};

export type FormValues = {
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
        <>
          <p>Les types d'espaces serviront à définir la composition des sols.</p>
          <p>Les espaces peuvent être :</p>
          <ul>
            <li>des espaces minéraux (bâtiments, sol imperméabilisé, sol perméable minéral)</li>
            <li>des espaces végétalisés artificiels (enherbés et arbustifs ou arborés)</li>
            <li>des prairies (herbacées, arbustives ou arborées)</li>
            <li>des espaces agricoles (culture, vigne, verger)</li>
            <li>des forêts (de feuillus, conifères, peupliers, mixte)</li>
            <li>d'autres espaces naturels (plan d'eau, zone humide)</li>
          </ul>
          <p>
            Si vous savez lesquels de ces espaces sont présents sur le site, vous pourrez les
            sélectionner lors de l'étape suivante.
          </p>
        </>
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
                "Bénéfriches affectera automatiquement des types d'espaces corespondant à la nature de votre site, basée sur les moyennes observées.",
            },
          ]}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}
