import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/app/views/router";
import classNames from "@/shared/views/clsx";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import {
  BENEFRICHES_DOCUMENTATION_URL,
  BENEFRICHES_SPREADSHEET_URL,
  BENEFRICHES_TUTORIAL_URL,
} from "../links";

export default function CallToActionSection() {
  return (
    <section
      className={classNames("tw-py-20", "tw-bg-grey-light", "dark:tw-bg-grey-dark")}
      id="cta-section"
    >
      <div className={fr.cx("fr-container")}>
        <div className="md:tw-flex">
          <div
            className={classNames(
              "tw-pb-12",
              "md:tw-flex-[5]",
              "md:tw-pr-16 md:tw-pb-0",
              "tw-border-0 tw-border-b tw-border-solid tw-border-borderGrey",
              "md:tw-border-b-0 md:tw-border-r",
            )}
          >
            <img
              src="/img/pictograms/development-plans/urban-project.svg"
              width="100px"
              aria-hidden="true"
              alt="icône projet d’aménagement urbain"
              className="tw-mb-6"
            />
            <img
              src="/img/pictograms/renewable-energy/photovoltaic.svg"
              width="100px"
              aria-hidden="true"
              alt="icône projet d’aménagement photovoltaïque"
              className="tw-mb-6"
            />

            <h2>Vous avez un projet d'aménagement urbain ou un projet photovoltaïque&nbsp;?</h2>
            <p className={fr.cx("fr-text--xl", "fr-text--bold")}>
              Calculez les impacts d'un projet d’aménagement urbain (logements, quartier mixte) ou
              photovoltaïque sur une friche ou sur un autre site grâce à Bénéfriches&nbsp;!
            </p>
            <Button priority="primary" linkProps={routes.onBoardingIntroductionWhy().link}>
              Accéder à Bénéfriches
            </Button>
          </div>
          <hr />
          <div className={classNames("tw-pt-6 md:tw-flex-[7] md:tw-pl-16 md:tw-pt-0")}>
            <img
              src="/img/pictograms/development-plans/commercial-activity-area.svg"
              width="100px"
              aria-hidden="true"
              alt="icône projet zone d’activités économiques"
              className="tw-mb-6"
            />
            <img
              src="/img/pictograms/development-plans/natural-urban-space.svg"
              width="100px"
              aria-hidden="true"
              alt="icône projet de renaturation"
              className="tw-mb-6"
            />
            <h2>Vous êtes porteur d’un autre type de projet&nbsp;?</h2>
            <p className={fr.cx("fr-text--xl", "fr-text--bold")}>
              Les projets d'aménagement de type zones d’activités économiques ou renaturation ne
              sont pas encore disponibles sur la solution numérique.
            </p>
            <p className={fr.cx("fr-text--sm")}>
              Ils le seront à partir de décembre 2024. En attendant, il est toujours possible
              d'utiliser le{" "}
              <ExternalLink href={BENEFRICHES_SPREADSHEET_URL}>tableur de calcul</ExternalLink>{" "}
              (téléchargement libre). Pour vous aider dans son utilisation, consultez le{" "}
              <ExternalLink href={BENEFRICHES_TUTORIAL_URL}>tutoriel</ExternalLink>, la{" "}
              <ExternalLink href={BENEFRICHES_DOCUMENTATION_URL}>notice d'utilisation</ExternalLink>{" "}
              ou le{" "}
              <ExternalLink href="https://www.dailymotion.com/video/x8msk3b">
                webinaire de présentation
              </ExternalLink>
              .
            </p>
            <p className={fr.cx("fr-text--sm", "fr-text--bold")}>
              Soyez informé·e de la sortie des fonctionnalités de Bénéfriches en répondant à ce
              questionnaire :
            </p>
            <Button priority="primary" data-tally-open="npKkaE" data-tally-width="450">
              Être tenu informé·e
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
