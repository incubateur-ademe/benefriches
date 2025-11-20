import Button from "@codegouvfr/react-dsfr/Button";

import { siteCreationInitiated } from "@/features/create-site/core/actions/introduction.actions";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import OnboardingPageLayout from "@/shared/views/layout/OnboardingPageLayout/OnboardingPageLayout";
import { routes } from "@/shared/views/router";

import { OnboardingVariant } from "../when-to-use/OnboardingWhenToUsePage";
import UseCaseList from "../when-to-use/UseCaseList";
import UseItem from "../when-to-use/UseItem";

type Props = {
  variant: OnboardingVariant;
};

function OnboardingWhenNotToUsePage({ variant }: Props) {
  const dispatch = useAppDispatch();

  const onNextClick = () => {
    routes.onBoardingIntroductionHow({ fonctionnalite: variant }).push();
  };
  const skipIntroduction = () => {
    if (variant === "evaluation-mutabilite") {
      routes.evaluateReconversionCompatibility().push();
    } else {
      dispatch(siteCreationInitiated({ skipIntroduction: true, skipUseMutability: true }));
      routes.createSite().push();
    }
  };

  const htmlTitle = `Pourquoi Bénéfriches (${
    variant === "evaluation-impacts" ? "évaluation des impacts" : "évaluation de la mutabilité"
  }) - Introduction`;

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
          <Button priority="secondary" className="ml-auto" onClick={skipIntroduction}>
            Passer l'intro
          </Button>
          <Button priority="primary" onClick={onNextClick}>
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
