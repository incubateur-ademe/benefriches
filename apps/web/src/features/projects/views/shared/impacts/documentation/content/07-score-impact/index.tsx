import type { MDXProps } from "mdx/types";
import type { ComponentType } from "react";

import { heading } from "../../mdxComponents";
import Intro from "./00-intro.mdx";
import Finances from "./01-finances-collectivite.mdx";
import Emplois from "./02-emplois.mdx";
import AccesAuxSoins from "./03-qualite-de-vie/acces-aux-soins.mdx";
import AccesCommercesServices from "./03-qualite-de-vie/acces-commerces-services.mdx";
import AccidentsFriche from "./03-qualite-de-vie/accidents-friche.mdx";
import CadreDeVie from "./03-qualite-de-vie/cadre-de-vie.mdx";
import QualiteDeVieIntro from "./03-qualite-de-vie/index.mdx";
import Sante from "./03-qualite-de-vie/sante.mdx";
import SecuriteRoutiere from "./03-qualite-de-vie/securite-routiere.mdx";
import Co2eq from "./04-environnement/co2eq.mdx";
import EnvironnementIntro from "./04-environnement/index.mdx";
import QualiteDeLEau from "./04-environnement/qualite-de-l-eau.mdx";
import QualiteDesSols from "./04-environnement/qualite-des-sols.mdx";
import ServicesEcosystemiques from "./04-environnement/services-ecosystemiques.mdx";
import Zan from "./04-environnement/zan.mdx";

type ScorePart = {
  // si renseigné, permet de faire un lien direct (#id) vers cet indicateur
  id?: string;
  Content: ComponentType<MDXProps>;
};

const SCORE_PARTS: ScorePart[] = [
  { Content: Intro },

  { id: "score-finances-collectivite", Content: Finances },
  { id: "score-emplois", Content: Emplois },

  { id: "score-qualite-de-vie", Content: QualiteDeVieIntro },
  { id: "score-cadre-de-vie", Content: CadreDeVie },
  { id: "score-sante", Content: Sante },
  { id: "score-acces-aux-soins", Content: AccesAuxSoins },
  { id: "score-acces-commerces-services", Content: AccesCommercesServices },
  { id: "score-securite-routiere", Content: SecuriteRoutiere },
  { id: "score-accidents-friche", Content: AccidentsFriche },

  { id: "score-environnement", Content: EnvironnementIntro },
  { id: "score-co2eq", Content: Co2eq },
  { id: "score-zan", Content: Zan },
  { id: "score-qualite-des-sols", Content: QualiteDesSols },
  { id: "score-qualite-de-l-eau", Content: QualiteDeLEau },
  { id: "score-services-ecosystemiques", Content: ServicesEcosystemiques },
];

export default function ScoreImpact({ components }: MDXProps) {
  return (
    <>
      {SCORE_PARTS.map(({ id, Content }, index) => (
        <div key={id ?? `score-part-${index}`} id={id} className="scroll-mt-20">
          <Content
            components={
              id
                ? {
                    ...components,

                    h1: heading("h4", "text-xl font-bold mb-4"),
                    h2: heading("h5", "text-lg font-semibold mt-6 mb-3"),
                    h3: heading("h6", "text-base font-semibold mt-2 mb-2"),
                    h4: heading("span", "text-sm font-bold mt-2 mb-2"),
                    h5: heading("span", "text-xs font-semibold mt-2 mb-2"),
                  }
                : components
            }
          />
        </div>
      ))}
    </>
  );
}
