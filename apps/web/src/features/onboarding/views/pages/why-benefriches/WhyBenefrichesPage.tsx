import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { useState } from "react";

import classNames from "@/shared/views/clsx";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { routes } from "@/shared/views/router";

export type OnboardingVariant = "evaluation-mutabilite" | "evaluation-impacts";

const STEPS = {
  TITLE: 0,
  INTRO: 1,
  WHEN_TO_USE: 2,
  WHEN_NOT_TO_USE: 3,
} as const;

type StepValue = (typeof STEPS)[keyof typeof STEPS];

const TOTAL_STEPS = Object.keys(STEPS).length;

function UseItem({ children, icon }: { children: React.ReactNode; icon: "check" | "red-cross" }) {
  const iconClass =
    icon === "check"
      ? "text-success-dark fr-icon-check-line"
      : "text-error-ultradark fr-icon-close-line";
  return (
    <li className="pb-4 flex items-center gap-6">
      <i
        className={classNames(
          "bg-grey-light rounded-full shrink-0 p-1 flex items-center justify-center text-xl",
          iconClass,
        )}
        style={{ width: "48px", height: "48px" }}
        aria-hidden="true"
      />
      <span>{children}</span>
    </li>
  );
}

function WhenToUseBenefriches({ variant }: { variant: OnboardingVariant }) {
  if (variant === "evaluation-mutabilite") {
    return (
      <ul className="list-none pl-0 animate-fade-in-up">
        <UseItem icon="check">
          Vous souhaitez connaître <strong>les usages les plus adaptés</strong> pour une friche ;
        </UseItem>
        <UseItem icon="check">
          Vous hésitez entre <strong>plusieurs friches</strong> pour votre projet d'aménagement et
          souhaitez savoir laquelle est la plus adaptée.
        </UseItem>
      </ul>
    );
  }

  return (
    <ul className="list-none pl-0 animate-fade-in-up">
      <UseItem icon="check">
        Vous hésitez à reconvertir une friche car vous ne savez pas si la valeur des impacts{" "}
        <strong>compensera le déficit</strong> lié aux travaux de reconversion ;
      </UseItem>
      <UseItem icon="check">
        Vous hésitez sur <strong>l'emplacement</strong> de votre projet d'aménagement, entre une
        friche et un espace naturel ou agricole ;
      </UseItem>
      <UseItem icon="check">
        Vous souhaitez découvrir le <strong>coût de l'inaction</strong> sur les finances publiques ;
      </UseItem>
      <UseItem icon="check">
        Vous avez besoin de connaître l'ensemble des <strong>retombées</strong> de votre projet (sur
        l'environnement, l'emploi, la sécurité des personnes, les finances publiques...) ;
      </UseItem>
      <UseItem icon="check">
        Vous avez besoin de préparer une <strong>présentation aux élus</strong> ou aux partenaires,
        avec des graphiques clairs et des chiffres étayés ;
      </UseItem>
      <UseItem icon="check">
        Vous avez besoin d'appuyer un <strong>dossier de financement</strong> (fonds vert mesure
        recyclage foncier, ADEME...)
      </UseItem>
    </ul>
  );
}

function WhenNotToUseBenefriches({ variant }: { variant: OnboardingVariant }) {
  return (
    <div className="animate-fade-in-up">
      <p className="font-semibold mt-10 text-lg">En revanche, Bénéfriches n'est pas adapté si :</p>
      <ul className="list-none pl-0">
        <UseItem icon="red-cross">
          Vous recherchez une friche sur votre territoire (
          <ExternalLink href="https://cartofriches.cerema.fr/cartofriches/">
            Cartofriches
          </ExternalLink>
          ) ;
        </UseItem>
        <UseItem icon="red-cross">
          Vous avez besoin de conseils pour avancer sur votre projet de reconversion (
          <ExternalLink href="https://urbanvitaliz.fr/">Urban Vitaliz</ExternalLink>)
        </UseItem>
        {variant === "evaluation-mutabilite" && (
          <UseItem icon="red-cross">
            Vous avez besoin d'une étude de faisabilité (tournez-vous pour cela vers des
            professionnels de l'urbanisme).
          </UseItem>
        )}
      </ul>
    </div>
  );
}

type Props = {
  variant: OnboardingVariant;
};

function OnBoardingIntroductionWhyBenefriches({ variant }: Props) {
  const [currentStep, setCurrentStep] = useState<StepValue>(STEPS.TITLE);

  const handleNextClick = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((currentStep + 1) as StepValue);
    } else {
      routes.onBoardingIntroductionHow({ fonctionnalite: variant }).push();
    }
  };

  const showIntro = currentStep >= STEPS.INTRO;
  const showWhenToUse = currentStep >= STEPS.WHEN_TO_USE;
  const showWhenNotToUse = currentStep >= STEPS.WHEN_NOT_TO_USE;

  return (
    <>
      <HtmlTitle>
        {`Pourquoi Bénéfriches (${
          variant === "evaluation-impacts"
            ? "évaluation des impacts"
            : "évaluation de la mutabilité"
        }) - Introduction`}
      </HtmlTitle>
      <div className="fr-container">
        <section className="pt-20 pb-10 flex-1 grow">
          <h2>En quoi Bénéfriches vous sera utile ?</h2>

          {showIntro && (
            <p className="text-lg animate-fade-in-up">
              {variant === "evaluation-impacts"
                ? "Bénéfriches calcule la valeur réelle d'un projet d'aménagement. Il vous sera utile si :"
                : "Bénéfriches est un outil qui vous permet d'analyser la compatibilité d'une friche avec différents usages. Cette fonctionnalité vous sera utile si :"}
            </p>
          )}

          {showWhenToUse && <WhenToUseBenefriches variant={variant} />}

          {showWhenNotToUse && <WhenNotToUseBenefriches variant={variant} />}
        </section>

        <ButtonsGroup
          inlineLayoutWhen="always"
          alignment="right"
          buttons={[
            {
              children: "Passer l'intro",
              priority: "secondary",
              onClick: () => {
                routes.onBoardingIntroductionHow({ fonctionnalite: variant }).push();
              },
            },
            {
              children: "Suivant",
              priority: "primary",
              onClick: handleNextClick,
            },
          ]}
        />
      </div>
    </>
  );
}

export default OnBoardingIntroductionWhyBenefriches;
