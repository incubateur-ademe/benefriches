import CallOut from "@codegouvfr/react-dsfr/CallOut";

import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";

type Props = {
  siteCity: string;
  siteSurfaceArea: number;
  evaluationPeriod: number;
};

export default function QuickImpactsCallout({
  evaluationPeriod,
  siteCity,
  siteSurfaceArea,
}: Props) {
  return (
    <CallOut
      buttonProps={{
        children: "En découvrir plus sur Bénéfriches",
        linkProps: {
          href: "https://benefriches.ademe.fr",
          target: "_blank",
          title: "En découvrir plus sur Bénéfriches - ouvre une nouvelle fenêtre",
        },
      }}
    >
      Bénéfriches a calculé les <strong>impacts à {evaluationPeriod} ans</strong> d'un projet de
      reconversion de type "centralité urbaine" sur une friche située à {siteCity} (superficie :{" "}
      {formatSurfaceArea(siteSurfaceArea)}).
    </CallOut>
  );
}
