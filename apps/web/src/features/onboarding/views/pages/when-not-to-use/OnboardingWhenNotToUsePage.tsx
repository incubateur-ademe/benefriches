import Button from "@codegouvfr/react-dsfr/Button";
import { useMemo } from "react";

import { routes } from "@/app/router";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import OnboardingPageLayout from "@/shared/views/layout/OnboardingPageLayout/OnboardingPageLayout";

import { OnboardingVariant } from "../when-to-use/OnboardingWhenToUsePage";
import UseCaseList from "../when-to-use/UseCaseList";
import UseItem from "../when-to-use/UseItem";

type Props = {
  variant?: OnboardingVariant;
};

function OnboardingWhenNotToUsePage({ variant }: Props) {
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
        <div className="flex justify-between gap-4">
          <Button
            priority="secondary"
            linkProps={routes.onBoardingWhenToUse({ fonctionnalite: variant }).link}
          >
            Retour
          </Button>
          <Button priority="secondary" className="ml-auto" linkProps={skipIntroductionLinkProps}>
            Passer l'intro
          </Button>
          <Button
            priority="primary"
            linkProps={routes.onBoardingIntroductionHow({ fonctionnalite: variant }).link}
          >
            Suivant
          </Button>
        </div>
      }
    >
      <h2 className="mb-8">En revanche, Bénéfriches n'est pas adapté si :</h2>

      <UseCaseList>
        <UseItem icon="red-cross">
          Vous recherchez une friche sur votre territoire (Rendez-vous sur{" "}
          <ExternalLink href="https://cartofriches.cerema.fr/cartofriches/">
            Cartofriches
          </ExternalLink>
          ) ;
        </UseItem>
        <UseItem icon="red-cross">
          Vous avez besoin de conseils pour avancer sur votre projet de reconversion (Rendez-vous
          sur <ExternalLink href="https://urbanvitaliz.fr/">Urban Vitaliz</ExternalLink>)
        </UseItem>
        {variant === "evaluation-mutabilite" && (
          <UseItem icon="red-cross">
            Vous avez besoin d'une <strong>étude de faisabilité</strong> (tournez-vous pour cela
            vers des professionnels de l'urbanisme).
          </UseItem>
        )}
      </UseCaseList>
    </OnboardingPageLayout>
  );
}

export default OnboardingWhenNotToUsePage;
