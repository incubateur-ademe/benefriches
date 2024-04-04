import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import {
  BENEFRICHES_DOCUMENTATION_URL,
  BENEFRICHES_SPREADSHEET_URL,
  BENEFRICHES_TUTORIAL_URL,
} from "../links";

import { routes } from "@/app/views/router";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

export default function CallToActionSection() {
  return (
    <section className={fr.cx("fr-py-10w")} style={{ background: "#F6F6F6" }} id="cta-section">
      <div className={fr.cx("fr-container")}>
        <div className={fr.cx("fr-grid-row")}>
          <div className={fr.cx("fr-col-5", "fr-pr-8w")} style={{ borderRight: "1px solid #DDD" }}>
            <img
              src="/img/pictograms/renewable-energy/photovoltaic.svg"
              width="100px"
              className={fr.cx("fr-mb-3w")}
            />
            <h2>Vous êtes développeur de centrales photovoltaïques ?</h2>
            <p className={fr.cx("fr-text--xl", "fr-text--bold")}>
              Calculez les impacts d'un projet photovoltaïque sur une friche ou sur un autre site
              grâce à Bénéfriches !
            </p>
            <Button priority="primary" linkProps={routes.createSiteFoncierIntro().link}>
              Accéder à Bénéfriches
            </Button>
          </div>
          <hr />
          <div className={fr.cx("fr-col-7", "fr-pl-8w")}>
            <img
              src="/img/pictograms/development-plans/mixed-used-neighborhood.svg"
              width="100px"
              className={fr.cx("fr-mb-3w")}
            />
            <h2>Vous êtes aménageur urbain ?</h2>
            <p className={fr.cx("fr-text--xl", "fr-text--bold")}>
              Les projets d’aménagement (logements, lieux d’activités, espace vert...) ne sont pas
              encore disponibles sur la solution numérique.
            </p>
            <p className={fr.cx("fr-text--sm")}>
              Ils le seront à partir de l’été 2024. En attendant, il est toujours possible
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
              Être tenu informé
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
