import classNames from "@/shared/views/clsx";

import ExpressProjectTooltipBadge from "../shared/project-badge/ExpressProjectBadge";
import { getScenarioPictoUrl } from "../shared/scenarioType";

type Props = {
  siteCity: string;
};

export default function QuickImpactsEmbedViewTitle({ siteCity }: Props) {
  return (
    <div
      className={classNames(
        "grid",
        "grid-cols-[60px_1fr_32px]",
        "md:grid-cols-[72px_1fr_40px]",
        "gap-x-2 md:gap-x-3",
        "items-center",
        "justify-center",
        "mb-6",
      )}
    >
      <img
        className={classNames(
          "col-start-1",
          "sm:row-start-1",
          "sm:row-span-2",
          "w-[60px] h-[60px]",
        )}
        src={getScenarioPictoUrl("URBAN_PROJECT")}
        aria-hidden={true}
        alt=""
        width="60"
        height="60"
      />
      <div className="col-start-2 sm:inline-flex items-center">
        <h2 className="my-0 text-2xl">Projet de centralité urbaine</h2>
        <ExpressProjectTooltipBadge />
      </div>
      <div className="row-start-2 col-start-1 sm:col-start-2 col-span-3 sm:col-span-1">
        <span className="fr-icon-map-pin-2-line fr-icon--sm fr-mr-1w" aria-hidden="true"></span>
        {siteCity}
      </div>
    </div>
  );
}
