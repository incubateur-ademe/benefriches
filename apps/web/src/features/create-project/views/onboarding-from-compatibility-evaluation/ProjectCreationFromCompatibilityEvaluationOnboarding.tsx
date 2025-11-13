import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import type { Route } from "type-route";

import UseCaseList from "@/features/onboarding/views/pages/when-to-use/UseCaseList";
import UseItem from "@/features/onboarding/views/pages/when-to-use/UseItem";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import StickyBottomBar from "@/shared/views/components/StickyBottomBar/StickyBottomBar";
import { useHeaderHeight } from "@/shared/views/hooks/useHeaderHeight";
import { routes } from "@/shared/views/router";

type Props = {
  route: Route<typeof routes.projectCreationOnboarding>;
};

function ProjectCreationFromCompatibilityEvaluationOnboarding({ route }: Props) {
  const headerHeight = useHeaderHeight();
  const containerHeight = headerHeight > 0 ? `calc(100vh - ${headerHeight}px)` : "100vh";

  const { siteId, siteName, projectSuggestions } = route.params;

  return (
    <>
      <HtmlTitle>Création de projet - Introduction</HtmlTitle>
      <div className="fr-container flex flex-col" style={{ minHeight: containerHeight }}>
        <section className="py-10 md:py-20 flex-1">
          <h2 className="mb-8">
            Vous allez évaluer votre premier projet sur le site {siteName}. Cela vous sera utile si
            :
          </h2>

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
        </section>

        <StickyBottomBar>
          <ButtonsGroup
            inlineLayoutWhen="always"
            alignment="right"
            buttons={[
              {
                className: "mb-0",
                children: "Continuer",
                priority: "primary",
                linkProps: routes.createProject({ siteId, projectSuggestions }).link,
              },
            ]}
          />
        </StickyBottomBar>
      </div>
    </>
  );
}

export default ProjectCreationFromCompatibilityEvaluationOnboarding;
