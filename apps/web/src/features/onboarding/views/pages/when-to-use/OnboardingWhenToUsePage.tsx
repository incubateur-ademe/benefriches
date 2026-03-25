import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { useMemo } from "react";

import { routes } from "@/app/router";
import OnboardingPageLayout from "@/shared/views/layout/OnboardingPageLayout/OnboardingPageLayout";

import UseCaseList from "./UseCaseList";
import UseItem from "./UseItem";

export type OnboardingVariant = "evaluation-mutabilite" | "evaluation-impacts";

type Props = {
  variant?: OnboardingVariant;
};

function OnboardingWhenToUsePage({ variant }: Props) {
  const { htmlTitle, skipIntroductionLinkProps } = useMemo(() => {
    if (variant === "evaluation-impacts") {
      return {
        htmlTitle: `Pourquoi Bénéfriches (évaluation des impacts) - Introduction`,
        skipIntroductionLinkProps: routes.createSite({ evaluationMode: "impacts" }).link,
      };
    }
    if (variant === "evaluation-mutabilite") {
      return {
        htmlTitle: `Pourquoi Bénéfriches (évaluation de la mutabilité) - Introduction`,
        skipIntroductionLinkProps: routes.evaluateReconversionCompatibility().link,
      };
    }

    return {
      htmlTitle: `Pourquoi Bénéfriches - Introduction`,
      skipIntroductionLinkProps: routes.myEvaluations().link,
    };
  }, [variant]);

  return (
    <OnboardingPageLayout
      htmlTitle={htmlTitle}
      bottomBarContent={
        <ButtonsGroup
          inlineLayoutWhen="always"
          alignment="right"
          buttons={[
            {
              children: "Passer l'intro",
              className: "mb-0",
              priority: "secondary",
              linkProps: skipIntroductionLinkProps,
            },
            {
              className: "mb-0",
              children: "Suivant",
              priority: "primary",
              linkProps: routes.onBoardingWhenNotToUse({ fonctionnalite: variant }).link,
            },
          ]}
        />
      }
    >
      <h2 className="mb-8">Bienvenue sur Bénéfriches ! Vous êtes au bon endroit si :</h2>

      {variant === "evaluation-mutabilite" ? (
        <UseCaseList>
          <UseItem icon="check">
            Vous souhaitez connaître <strong>les usages les plus adaptés</strong> pour une friche ;
          </UseItem>
          <UseItem icon="check">
            Vous hésitez entre <strong>plusieurs friches</strong> pour votre projet d'aménagement et
            souhaitez savoir laquelle est la plus adaptée.
          </UseItem>
        </UseCaseList>
      ) : (
        <UseCaseList>
          <UseItem icon="check">
            Vous hésitez sur <strong>l'emplacement</strong> de votre projet d'aménagement, entre une
            friche et un espace naturel ou agricole ;
          </UseItem>
          <UseItem icon="check">
            Vous souhaitez découvrir le <strong>coût de l'inaction</strong> sur les finances
            publiques ;
          </UseItem>
          <UseItem icon="check">
            Vous avez besoin de connaître l'ensemble des <strong>retombées</strong> de votre projet
            (sur l'environnement, l'emploi, la sécurité des personnes, les finances publiques...) ;
          </UseItem>
          <UseItem icon="check">
            Vous avez besoin d'appuyer un <strong>dossier de financement</strong> (fonds vert mesure
            recyclage foncier, ADEME...)
          </UseItem>
        </UseCaseList>
      )}
    </OnboardingPageLayout>
  );
}

export default OnboardingWhenToUsePage;
