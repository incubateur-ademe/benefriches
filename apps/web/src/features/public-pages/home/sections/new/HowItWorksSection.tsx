import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { useState } from "react";

import SectionTitle from "./SectionTitle";

type StepProps = {
  emoji: string;
  title: string;
  children: React.ReactNode;
};

function Step({ emoji, title, children }: StepProps) {
  return (
    <article className="flex flex-col gap-2">
      <span className="text-4xl" aria-hidden="true">
        {emoji}
      </span>
      <h3 className="m-0 text-xl">{title}</h3>
      <p className="m-0 text-sm">{children}</p>
    </article>
  );
}

type UserSituation = "has-site-and-project" | "has-only-site";

export default function HowItWorksSection() {
  const [userSituation, setUserSituation] = useState<UserSituation>("has-site-and-project");

  return (
    <section className="py-20 bg-grey-light dark:bg-grey-dark">
      <div className="fr-container">
        <SectionTitle>Bénéfriches, comment ça marche ?</SectionTitle>
        <SegmentedControl
          legend="Connaissance du projet d'aménagement"
          hideLegend
          className="mb-10 mt-5"
          segments={[
            {
              label: "J'ai un site et un projet",
              nativeInputProps: {
                checked: userSituation === "has-site-and-project",
                onChange: () => {
                  setUserSituation("has-site-and-project");
                },
              },
            },
            {
              label: "J'ai juste une friche",
              nativeInputProps: {
                checked: userSituation === "has-only-site",
                onChange: () => {
                  setUserSituation("has-only-site");
                },
              },
            },
          ]}
        />
        {userSituation === "has-site-and-project" ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <Step emoji="📍" title="Je décris mon site">
              Type de site, sols, pollution, gestion du site... avec un maximum de données
              pré-remplies par l'outil.
            </Step>
            <Step emoji="🏗️" title="Je décris mon projet">
              Type de projet, dépenses et recettes... avec là aussi un maximum de données
              pré-remplies.
            </Step>
            <Step emoji="🗂️" title="L'outil croise vos données avec les siennes">
              Instructions du gouvernement, enquêtes et statistiques, rapports institutionnels
              scientifiques...
            </Step>
            <Step emoji="📊" title="L'outil calcule les impacts du projet">
              Impact sur l'environnement, l'emploi, le cadre de vie des riverains, les finances
              publiques...
            </Step>
            <Step emoji="📥" title="Je m'approprie les impacts">
              Après avoir consulté les impacts, je peux les exporter en PDF et les comparer avec les
              impacts d'un autre projet.
            </Step>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <Step emoji="✍️" title="Je décris ma friche">
              Adresse, terrain, bâtiments, environnement... avec un maximum de données pré-remplies
              par l'outil.
            </Step>
            <Step emoji="🔍" title="L'outil analyse ma friche">
              Et me propose des projets d'aménagement compatibles, classés par pertinence.
            </Step>
            <Step emoji="📊" title="L'outil calcule les impacts d'un projet sur ma friche">
              Pour certains projets, l'outil peut calculer les impacts sur l'environnement,
              l'emploi, les finances publiques...
            </Step>
            <Step emoji="💡" title="Je découvre les solutions pour reconvertir ma friche">
              Outils, subventions disponibles, mise en relation avec un conseiller ou avec des
              porteurs de projets...
            </Step>
          </div>
        )}
      </div>
    </section>
  );
}
