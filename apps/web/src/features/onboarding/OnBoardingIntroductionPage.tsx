import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode } from "react";

import DataSourcesSection from "@/app/views/pages/home/sections/DataSourcesSection";
import { routes } from "@/app/views/router";
import classNames from "@/shared/views/clsx";

type StepProps = {
  number: number;
  title: string;
  text: ReactNode;
};

function Step({ number, title, text }: StepProps) {
  return (
    <div
      className={classNames(
        "tw-relative",
        "after:last:tw-content-['']",
        "md:after:tw-content-['➔']",
        "after:tw-absolute",
        "after:tw-top-[50%]",
        "after:tw-right-[0]",
        "after:tw-text-3xl",
        "tw-pr-6",
      )}
    >
      <div
        className={classNames(
          "tw-flex",
          "tw-items-center",
          "tw-justify-center",
          fr.cx("fr-mb-1w"),
          "tw-text-2xl",
          "tw-rounded-full",
          "tw-h-12",
          "tw-w-12",
          "tw-font-bold",
          "tw-text-white",
          "tw-bg-blue-main",
        )}
      >
        {number}
      </div>
      <span className={classNames(fr.cx("fr-text--xl", "fr-text--bold"))}>{title}</span>
      <p className={fr.cx("fr-text--md", "fr-mt-1w")}>{text}</p>
    </div>
  );
}

function OnBoardingIntroductionPage() {
  return (
    <>
      <section
        className={classNames(fr.cx("fr-py-10w"), "tw-bg-grey-light", "dark:tw-bg-grey-dark")}
      >
        <div className={fr.cx("fr-container")}>
          <h2>Bénéfriches, comment ça marche&nbsp;?</h2>
          <div className="tw-grid md:tw-grid-cols-3 tw-gap-6">
            <Step
              number={1}
              title="Décrivez le site"
              text="Adresse, type de site, typologie des sols, pollution, gestion du site, etc."
            />

            <Step
              number={2}
              title="Renseignez le projet"
              text="Type de projet, usage des sols, caractéristiques des bâtiments ou équipements, acteurs, dépenses et recettes, calendrier, etc."
            />

            <Step
              number={3}
              title="Consultez les impacts"
              text={
                <span>
                  Consultez les indicateurs du projet sur le site&nbsp;:{" "}
                  <strong>
                    impacts économiques directs et indirects, impacts sociaux, impacts
                    environnementaux
                  </strong>
                  , sur différentes durées allant de 1 à 50 ans.
                </span>
              }
            />
          </div>
          <p>
            <i
              className={classNames(fr.cx("fr-icon--sm", "fr-icon-information-line"), "tw-mr-2")}
              aria-hidden="true"
            ></i>
            Si vous n'avez pas les informations, Bénéfriches vous propose des valeurs par défaut,
            basées sur des moyennes sur des sites et projets similaires.
          </p>

          <Button linkProps={routes.createSiteFoncier().link}>Renseigner le site</Button>
        </div>
      </section>
      <DataSourcesSection />
    </>
  );
}

export default OnBoardingIntroductionPage;
