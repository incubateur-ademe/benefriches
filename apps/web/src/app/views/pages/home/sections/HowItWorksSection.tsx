import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type HowItWorksStepProps = {
  number: number;
  title: string;
  text: ReactNode;
};

function HowItWorksStep({ number, title, text }: HowItWorksStepProps) {
  return (
    <li>
      <div
        className={classNames(
          "tw-mb-2",
          "tw-text-white tw-bg-blue-main",
          "tw-rounded-full",
          "tw-text-center",
          "tw-h-12 tw-w-12",
          "tw-font-bold",
          "tw-pr-[1px]",
          "tw-pt-[11px]",
        )}
      >
        {number}
      </div>
      <h3 className="tw-text-xl tw-mb-2">{title}</h3>
      <p className={fr.cx("fr-text--sm")}>{text}</p>
    </li>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="tw-py-20 tw-bg-grey-light dark:tw-bg-grey-dark">
      <div className={fr.cx("fr-container")}>
        <h2>Bénéfriches, comment ça marche&nbsp;?</h2>
        <ol
          className={classNames(
            "tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-10",
            "tw-list-none marker:tw-content-none",
            "tw-p-0 tw-mt-10",
          )}
        >
          <HowItWorksStep
            number={1}
            title="Décrivez le site"
            text="Adresse, type de site, typologie des sols, pollution, gestion du site, etc. Si vous n'avez pas l'info, Bénéfriches vous propose des valeurs par défaut, basées sur des moyennes sur des sites similaires."
          />
          <HowItWorksStep
            number={2}
            title="Renseignez le projet"
            text="Type de projet, usage des sols, caractéristiques des bâtiments ou équipements, acteurs, dépenses et recettes, calendrier, etc. Là aussi, si vous n'avez pas l'info, Bénéfriches vous propose des valeurs par défaut."
          />
          <HowItWorksStep
            number={3}
            title="Consultez les impacts"
            text={
              <span>
                Consultez les indicateurs du projet sur le site :{" "}
                <strong>
                  impacts économiques directs et indirects, impacts sociaux, impacts
                  environnementaux
                </strong>
                , sur différentes durées allant de 1 à 50 ans.
              </span>
            }
          />
          <HowItWorksStep
            number={4}
            title="Comparez les impacts"
            text={
              <span>
                Après avoir renseigné plusieurs sites et projets, vous comparez les impacts entre{" "}
                <strong>2 variantes</strong> d'un projet, <strong>2 projets différents</strong> sur
                un même site, un même projet sur <strong>2 sites différents</strong> ou un site{" "}
                <strong>avec et sans projet</strong>.
              </span>
            }
          />
        </ol>
      </div>
    </section>
  );
}
