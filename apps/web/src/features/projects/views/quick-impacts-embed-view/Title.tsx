import classNames from "@/shared/views/clsx";

import ExpressProjectTooltipBadge from "../project-page/ExpressProjectBadge";
import { getScenarioPictoUrl } from "../shared/scenarioType";

type Props = {
  siteCity: string;
};

export default function QuickImpactsEmbedViewTitle({ siteCity }: Props) {
  return (
    <div
      className={classNames(
        "tw-grid",
        "tw-grid-cols-[60px_1fr_32px]",
        "md:tw-grid-cols-[72px_1fr_40px]",
        "tw-gap-x-2 md:tw-gap-x-3",
        "tw-items-center",
        "tw-justify-center",
        "tw-mb-6",
      )}
    >
      <img
        className={classNames(
          "tw-col-start-1",
          "sm:tw-row-start-1",
          "sm:tw-row-span-2",
          "tw-w-[60px] tw-h-[60px]",
        )}
        src={getScenarioPictoUrl("URBAN_PROJECT")}
        aria-hidden={true}
        alt=""
        width="60"
        height="60"
      />
      <div className="tw-col-start-2 sm:tw-inline-flex tw-items-center">
        <h2 className="tw-my-0 tw-text-2xl">Projet de centralité urbaine</h2>
        <ExpressProjectTooltipBadge />
      </div>
      <div className="tw-row-start-2 tw-col-start-1 sm:tw-col-start-2 tw-col-span-3 sm:tw-col-span-1">
        <span className="fr-icon-map-pin-2-line fr-icon--sm fr-mr-1w" aria-hidden="true"></span>
        {siteCity}
      </div>
    </div>
  );
}
