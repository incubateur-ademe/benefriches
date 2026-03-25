import Button from "@codegouvfr/react-dsfr/Button";
import React, { ReactNode, useMemo } from "react";

import { routes } from "@/app/router";
import OnboardingPageLayout from "@/shared/views/layout/OnboardingPageLayout/OnboardingPageLayout";

import { OnboardingVariant } from "../when-to-use/OnboardingWhenToUsePage";
import Step from "./HowItWorksStep";

type Props = {
  variant?: OnboardingVariant;
};

type HowItWorksStepDefinition = {
  emoji: string;
  title: string;
  description: string;
  colorClass: string;
  introductionText?: ReactNode;
};

const impactsEvaluationSteps: HowItWorksStepDefinition[] = [
  {
    emoji: "📍",
    title: "Je décris mon site",
    description:
      "Type de site, sols, pollution, gestion du site... avec un maximum de données pré-remplies par l'outil.",
    colorClass: "bg-how-it-works-impacts-step-1",
  },
  {
    emoji: "🏗️",
    title: "Je décris mon projet",
    description:
      "Type de projet, dépenses et recettes... avec là aussi un maximum de données pré-remplies.",
    colorClass: "bg-how-it-works-impacts-step-2",
  },
  {
    emoji: "🗂️",
    title: "L'outil croise vos données avec les siennes",
    description:
      "Instructions du gouvernement, enquêtes et statistiques, rapports institutionnels scientifiques...",
    colorClass: "bg-how-it-works-impacts-step-3",
  },
  {
    emoji: "📊",
    title: "L'outil calcule les impacts du projet",
    description:
      "Impact sur l'environnement, l'emploi, le cadre de vie des riverains, les finances publiques...",
    colorClass: "bg-how-it-works-impacts-step-4",
  },
  {
    emoji: "📥",
    title: "Je m'approprie les impacts",
    description:
      "Après avoir consulté les impacts, je peux les exporter en PDF et les comparer avec les impacts d'un autre projet.",
    colorClass: "bg-how-it-works-impacts-step-5",
  },
];

const mutabiliteEvaluationSteps: HowItWorksStepDefinition[] = [
  {
    emoji: "📍",
    title: "Je décris ma friche",
    description:
      "Adresse, terrain, bâtiments, environnement... avec un maximum de données pré-remplies par l'outil.",
    colorClass: "bg-how-it-works-mutabilite-step-1",
  },
  {
    emoji: "🔍",
    title: "L'outil analyse ma friche",
    description:
      "Il calcule le potentiel de mutabilité vers 7 types d'usage et les classe par pertinence du plus adapté au moins adapté.",
    colorClass: "bg-how-it-works-mutabilite-step-2",
  },
  {
    emoji: "🎯",
    title: "Je choisis un projet d'aménagement",
    description:
      "Bénéfriches affecte alors des caractéristiques automatiques à ce projet, basées sur des valeurs représentatives.",
    colorClass: "bg-how-it-works-mutabilite-step-3",
    introductionText: <p className="text-xl font-bold">Et ensuite ? Je peux aller plus loin :</p>,
  },
  {
    emoji: "📊",
    title: "L'outil calcule les impacts du projet sur ma friche",
    description:
      "Pour certains projets, l'outil peut calculer les impacts sur l'environnement, l'emploi,  les finances publiques... ",
    colorClass: "bg-how-it-works-mutabilite-step-4",
  },
  {
    emoji: "💡",
    title: "Je découvre les solutions pour reconvertir ma friche",
    description:
      "Outils, subventions disponibles, mise en relation avec un conseiller ou avec des porteurs de projets...",
    colorClass: "bg-how-it-works-mutabilite-step-5",
  },
];

function HowItWorksPage({ variant }: Props) {
  const stepsToUse =
    variant === "evaluation-mutabilite" ? mutabiliteEvaluationSteps : impactsEvaluationSteps;

  const finishIntroductionLinkProps = useMemo(() => {
    if (variant === "evaluation-impacts") {
      return routes.createSite({ evaluationMode: "impacts" }).link;
    }
    if (variant === "evaluation-mutabilite") {
      return routes.evaluateReconversionCompatibility().link;
    }
    return routes.myEvaluations().link;
  }, [variant]);

  return (
    <OnboardingPageLayout
      htmlTitle="Comment ça marche - Introduction"
      bottomBarContent={
        <div className="flex justify-between gap-4">
          <Button
            priority="secondary"
            linkProps={routes.onBoardingWhenNotToUse({ fonctionnalite: variant }).link}
          >
            Retour
          </Button>
          <Button priority="secondary" className="ml-auto" linkProps={finishIntroductionLinkProps}>
            Passer l'intro
          </Button>
          <Button priority="primary" linkProps={finishIntroductionLinkProps}>
            C'est parti
          </Button>
        </div>
      }
    >
      <h2 className="mb-8">Bénéfriches, comment ça marche ?</h2>

      <div className="animate-fade-in-up ">
        {stepsToUse.map((props, index) => (
          <React.Fragment key={props.title}>
            {props.introductionText}
            <Step stepNumber={index + 1} {...props} />
          </React.Fragment>
        ))}
      </div>
    </OnboardingPageLayout>
  );
}

export default HowItWorksPage;
