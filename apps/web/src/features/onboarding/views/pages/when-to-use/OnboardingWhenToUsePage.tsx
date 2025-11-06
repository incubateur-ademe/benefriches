import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { siteCreationInitiated } from "@/features/create-site/core/actions/introduction.actions";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { useHeaderHeight } from "@/shared/views/hooks/useHeaderHeight";
import { routes } from "@/shared/views/router";

import UseCaseList from "./UseCaseList";
import UseItem from "./UseItem";

export type OnboardingVariant = "evaluation-mutabilite" | "evaluation-impacts";

type Props = {
  variant: OnboardingVariant;
};

function OnboardingWhenToUsePage({ variant }: Props) {
  const dispatch = useAppDispatch();
  const headerHeight = useHeaderHeight();
  const containerHeight = headerHeight > 0 ? `calc(100vh - ${headerHeight}px)` : "100vh";

  const skipIntroduction = () => {
    if (variant === "evaluation-mutabilite") {
      routes.evaluateReconversionCompatibility().push();
    } else {
      dispatch(siteCreationInitiated({ skipIntroduction: true }));
      routes.createSiteFoncier().push();
    }
  };

  return (
    <>
      <HtmlTitle>
        {`Pourquoi Bénéfriches (${
          variant === "evaluation-impacts"
            ? "évaluation des impacts"
            : "évaluation de la mutabilité"
        }) - Introduction`}
      </HtmlTitle>
      <div className="fr-container flex flex-col" style={{ minHeight: containerHeight }}>
        <section className="py-10 md:py-20 flex-1">
          <h2 className="mb-8">Bienvenue sur Bénéfriches ! Vous êtes au bon endroit si :</h2>

          {variant === "evaluation-mutabilite" && (
            <UseCaseList>
              <UseItem icon="check">
                Vous souhaitez connaître <strong>les usages les plus adaptés</strong> pour une
                friche ;
              </UseItem>
              <UseItem icon="check">
                Vous hésitez entre <strong>plusieurs friches</strong> pour votre projet
                d'aménagement et souhaitez savoir laquelle est la plus adaptée.
              </UseItem>
            </UseCaseList>
          )}
          {variant === "evaluation-impacts" && (
            <UseCaseList>
              <UseItem icon="check">
                Vous hésitez sur <strong>l'emplacement</strong> de votre projet d'aménagement, entre
                une friche et un espace naturel ou agricole ;
              </UseItem>
              <UseItem icon="check">
                Vous souhaitez découvrir le <strong>coût de l'inaction</strong> sur les finances
                publiques ;
              </UseItem>
              <UseItem icon="check">
                Vous avez besoin de connaître l'ensemble des <strong>retombées</strong> de votre
                projet (sur l'environnement, l'emploi, la sécurité des personnes, les finances
                publiques...) ;
              </UseItem>
              <UseItem icon="check">
                Vous avez besoin d'appuyer un <strong>dossier de financement</strong> (fonds vert
                mesure recyclage foncier, ADEME...)
              </UseItem>
            </UseCaseList>
          )}
        </section>

        <ButtonsGroup
          className="sticky bottom-0 right-0 bg-white border-t border-border-grey py-4"
          inlineLayoutWhen="always"
          alignment="right"
          buttons={[
            {
              children: "Passer l'intro",
              className: "mb-0",
              priority: "secondary",
              onClick: skipIntroduction,
            },
            {
              className: "mb-0",
              children: "Suivant",
              priority: "primary",
              linkProps: routes.onBoardingWhenNotToUse({ fonctionnalite: variant }).link,
            },
          ]}
        />
      </div>
    </>
  );
}

export default OnboardingWhenToUsePage;
