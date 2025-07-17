import { useForm } from "react-hook-form";
import { SiteNature } from "shared";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onBack: () => void;
  onSubmit: (data: FormValues) => void;
  siteNature?: SiteNature;
};

export type FormValues = {
  knowsSurfaceAreas: "yes" | "no";
};

const getTitle = (siteNature: SiteNature | undefined) => {
  const baseTitle = `Connaissez-vous les superficies des différents espaces`;
  switch (siteNature) {
    case "FRICHE":
      return `${baseTitle} de la friche ?`;
    case "AGRICULTURAL_OPERATION":
      return `${baseTitle} de l'exploitation ?`;
    case "NATURAL_AREA":
      return `${baseTitle} de l'espace naturel ?`;
    default:
      return `${baseTitle} du site ?`;
  }
};

function SiteSpacesDistributionKnowledgeForm({ onSubmit, onBack, siteNature }: Props) {
  const { handleSubmit, register, formState } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const error = formState.errors.knowsSurfaceAreas;

  return (
    <WizardFormLayout
      title={getTitle(siteNature)}
      instructions={
        <>
          <p>Les types d'espaces serviront à définir la composition des sols.</p>3 modes de saisie
          des surfaces vous sont proposés selon votre niveau de connaissance du site:
          <ul>
            <li>
              Le premier vous permet de saisir des valeurs de surface en m² (l’adverbe “précisément”
              n’impose pas une connaissance au m² près des surfaces),
            </li>
            <li>
              Le deuxième vous permet de positionner les différentes surfaces en termes de
              proportions via une saisie en %,
            </li>
            <li>
              La dernière vous permet d’avancer même si vous n’avez pas d’estimation des proportions
              entre les différentes surfaces du site.
            </li>
          </ul>
        </>
      }
    >
      <form onSubmit={_onSubmit}>
        <RadioButtons
          {...register("knowsSurfaceAreas", {
            required: "Ce champ est requis pour déterminer l'étape suivante.",
          })}
          error={error}
          options={[
            {
              label: `Oui, je connais les superficies, je peux les saisir en % ou en ${SQUARE_METERS_HTML_SYMBOL}`,
              value: "yes",
            },
            {
              label: "Non, je ne connais pas les superficies",
              value: "no",
              hintText: "Bénéfriches affectera une superficie égale à tous les types de sols.",
            },
          ]}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default SiteSpacesDistributionKnowledgeForm;
