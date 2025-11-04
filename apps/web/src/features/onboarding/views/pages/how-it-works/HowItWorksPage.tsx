import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import React, { ReactNode, useState } from "react";

import { siteCreationInitiated } from "@/features/create-site/core/actions/introduction.actions";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { useHeaderHeight } from "@/shared/views/hooks/useHeaderHeight";
import { routes } from "@/shared/views/router";

import { OnboardingVariant } from "../why-benefriches/WhyBenefrichesPage";
import Step from "./HowItWorksStep";

type Props = {
  variant: OnboardingVariant;
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
  const dispatch = useAppDispatch();
  const headerHeight = useHeaderHeight();
  const INITIAL_STEP = -1;
  const [currentStep, setCurrentStep] = useState<number>(INITIAL_STEP);
  const stepsToUse =
    variant === "evaluation-impacts" ? impactsEvaluationSteps : mutabiliteEvaluationSteps;
  const totalSteps = stepsToUse.length;

  const finishIntroduction = () => {
    if (variant === "evaluation-mutabilite") {
      routes.evaluateReconversionCompatibility().push();
    } else {
      dispatch(siteCreationInitiated({ skipIntroduction: true }));
      routes.createSiteFoncier().push();
    }
  };

  const handleNextClick = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishIntroduction();
    }
  };

  const containerHeight = headerHeight > 0 ? `calc(100vh - ${headerHeight}px)` : "100vh";

  return (
    <>
      <HtmlTitle>Comment ça marche - Introduction</HtmlTitle>
      <div className="fr-container flex flex-col" style={{ minHeight: containerHeight }}>
        <section className="py-10 flex-1">
          <h2 className="mb-8">Bénéfriches, comment ça marche ?</h2>

          {stepsToUse.slice(0, currentStep + 1).map((props, index) => (
            <React.Fragment key={props.title}>
              {props.introductionText}
              <Step stepNumber={index + 1} {...props} />
            </React.Fragment>
          ))}
        </section>

        <ButtonsGroup
          className="sticky bottom-0 right-0 bg-white border-t border-border-grey py-4"
          inlineLayoutWhen="always"
          alignment="right"
          buttons={[
            {
              className: "mb-0",
              children: "Passer l'intro",
              priority: "secondary",
              onClick: () => {
                finishIntroduction();
              },
            },
            {
              className: "mb-0",
              children: currentStep === totalSteps - 1 ? "C'est parti" : "Suivant",
              priority: "primary",
              onClick: handleNextClick,
            },
          ]}
        />
      </div>
    </>
  );
}

export default HowItWorksPage;
