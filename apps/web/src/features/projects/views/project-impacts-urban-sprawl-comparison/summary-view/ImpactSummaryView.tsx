import { fr } from "@codegouvfr/react-dsfr";

import { KeyImpactIndicatorData } from "@/features/projects/application/project-impacts/projectKeyImpactIndicators.selectors";
import classNames from "@/shared/views/clsx";

type Props = {
  baseCase: {
    indicators: KeyImpactIndicatorData[];
    siteName: string;
  };
  comparisonCase: {
    indicators: KeyImpactIndicatorData[];
    siteName: string;
  };
  //  modalData: ModalDataProps;
};

const ImpactSummaryView = ({ baseCase, comparisonCase }: Props) => {
  return (
    <div className="tw-grid tw-grid-cols-2 tw-gap-6 tw-mb-8 ">
      {[baseCase, comparisonCase].map(({ siteName }, index) => {
        // const modalPrefix = index === 0 ? "base" : "comparison";
        return (
          <div
            key={index}
            className="tw-flex tw-flex-col tw-gap-6 tw-p-6 tw-bg-[var(--background-raised-grey)] tw-rounded-2xl"
          >
            <h3
              className={classNames(
                index === 0 ? "tw-text-[#243C83]" : "tw-text-[#7F236B]",
                "tw-text-2xl",
              )}
            >
              <span
                className={fr.cx("fr-icon--sm", "fr-icon-map-pin-2-line", "fr-pr-1w")}
                aria-hidden="true"
              ></span>
              {siteName}
            </h3>
            EN CONSTRUCTION...
          </div>
        );
      })}
    </div>
  );
};

export default ImpactSummaryView;
