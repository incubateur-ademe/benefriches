import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { useState } from "react";

import { siteCreationInitiated } from "@/features/create-site/core/actions/introduction.actions";
import classNames from "@/shared/views/clsx";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

const STEPS = {
  TITLE: 0,
  STEP_1: 1,
  STEP_2: 2,
  STEP_3: 3,
  STEP_4: 4,
  STEP_5: 5,
} as const;

type StepValue = (typeof STEPS)[keyof typeof STEPS];

const TOTAL_STEPS = Object.keys(STEPS).length;

interface StepProps {
  emoji: string;
  stepNumber: number;
  title: string;
  description: string;
  colorClass: string;
}

function Step({ emoji, stepNumber, title, description, colorClass }: StepProps) {
  return (
    <div className="flex items-center animate-fade-in-up mb-6 gap-6">
      <div
        className="bg-grey-light rounded-full flex items-center justify-center"
        style={{ width: "88px", height: "88px" }}
      >
        <span className="text-4xl" role="img" aria-hidden="true">
          {emoji}
        </span>
      </div>

      <div>
        <h3 className="text-xl m-0 mb-2">
          <span
            className={classNames(
              "rounded-full inline-flex flex-none items-center justify-center mr-2 text-white font-bold shrink-0 grow-0",
              colorClass,
            )}
            style={{ width: "24px", height: "24px" }}
            aria-hidden="true"
          >
            <span className="text-sm">{stepNumber}</span>
          </span>
          {title}
        </h3>
        <p className="text-sm m-0">{description}</p>
      </div>
    </div>
  );
}

function HowItWorksPage() {
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState<StepValue>(STEPS.TITLE);

  const handleNextClick = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((currentStep + 1) as StepValue);
    } else {
      dispatch(siteCreationInitiated({ skipIntroduction: true }));
      routes.createSiteFoncier().push();
    }
  };

  const showStep1 = currentStep >= STEPS.STEP_1;
  const showStep2 = currentStep >= STEPS.STEP_2;
  const showStep3 = currentStep >= STEPS.STEP_3;
  const showStep4 = currentStep >= STEPS.STEP_4;
  const showStep5 = currentStep >= STEPS.STEP_5;

  return (
    <>
      <HtmlTitle>Comment ça marche - Introduction</HtmlTitle>
      <div className="fr-container">
        <section className="pt-20 flex-1">
          <h2 className="mb-8">Bénéfriches, comment ça marche ?</h2>

          {showStep1 && (
            <Step
              emoji="📍"
              stepNumber={1}
              title="Je décris mon site"
              description="Type de site, sols, pollution, gestion du site... avec un maximum de données pré-remplies par l'outil."
              colorClass="bg-onboarding-step1"
            />
          )}

          {showStep2 && (
            <Step
              emoji="🏗️"
              stepNumber={2}
              title="Je décris mon projet"
              description="Type de projet, dépenses et recettes... avec là aussi un maximum de données pré-remplies."
              colorClass="bg-onboarding-step2"
            />
          )}

          {showStep3 && (
            <Step
              emoji="🗂️"
              stepNumber={3}
              title="L'outil croise vos données avec les siennes"
              description="Instructions du gouvernement, enquêtes et statistiques, rapports institutionnels scientifiques..."
              colorClass="bg-onboarding-step3"
            />
          )}

          {showStep4 && (
            <Step
              emoji="📊"
              stepNumber={4}
              title="L'outil calcule les impacts du projet"
              description="Impact sur l'environnement, l'emploi, le cadre de vie des riverains, les finances publiques..."
              colorClass="bg-onboarding-step4"
            />
          )}

          {showStep5 && (
            <Step
              emoji="📥"
              stepNumber={5}
              title="Je m'approprie les impacts"
              description="Après avoir consulté les impacts, je peux les exporter en PDF et les comparer avec les impacts d'un autre projet."
              colorClass="bg-onboarding-step5"
            />
          )}
        </section>

        <ButtonsGroup
          inlineLayoutWhen="always"
          alignment="right"
          buttons={[
            {
              children: currentStep === TOTAL_STEPS - 1 ? "C'est parti" : "Suivant",
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
